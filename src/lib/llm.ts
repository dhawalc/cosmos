import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt } from './prompt';
import { Signature } from './jyotish';

const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'end my life', 'self harm', 'hurt myself', 'don\'t want to live'];
const FATALISTIC_WORDS = ['die', 'death', 'cancer', 'divorce', 'bankrupt', 'ruin', 'disaster'];

export function isCrisisMessage(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
}

export function hasFatalisticContent(text: string): boolean {
  const lower = text.toLowerCase();
  return FATALISTIC_WORDS.some(w => lower.includes(w));
}

export interface LLMContext {
  userName: string;
  signature: Signature;
  lifePath: number;
  expression: number;
  soulUrge: number;
  history: { role: 'user' | 'assistant'; content: string }[];
  message: string;
}

export async function streamWithClaude(ctx: LLMContext): Promise<ReadableStream<Uint8Array>> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const systemPrompt = buildSystemPrompt(ctx);

  // Keep last 6 turns of history
  const trimmedHistory = ctx.history.slice(-6);

  const response = await client.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      ...trimmedHistory,
      { role: 'user', content: ctx.message },
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = '';
      for await (const event of response) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          buffer += event.delta.text;
          // Post-process: if fatalistic words appear, stop and retry signal
          if (hasFatalisticContent(buffer) && buffer.length > 200) {
            controller.enqueue(encoder.encode('[REFRAME]'));
            controller.close();
            return;
          }
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return stream;
}

export async function streamWithGemini(ctx: LLMContext): Promise<ReadableStream<Uint8Array>> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: buildSystemPrompt(ctx),
  });

  const trimmedHistory = ctx.history.slice(-6);
  const chat = model.startChat({
    history: trimmedHistory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  });

  const result = await chat.sendMessageStream(ctx.message);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return stream;
}

export async function streamOracle(ctx: LLMContext): Promise<ReadableStream<Uint8Array>> {
  // Try Claude first, fall back to Gemini
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await streamWithClaude(ctx);
    } catch (err) {
      console.error('Claude failed, falling back to Gemini:', err);
    }
  }
  if (process.env.GEMINI_API_KEY) {
    return await streamWithGemini(ctx);
  }
  throw new Error('No LLM API key configured. Set ANTHROPIC_API_KEY or GEMINI_API_KEY.');
}
