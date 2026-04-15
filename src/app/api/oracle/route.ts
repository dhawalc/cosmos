import { streamOracle, isCrisisMessage, LLMContext } from '@/lib/llm';
import { Signature } from '@/lib/jyotish';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], context } = body as {
      message: string;
      history: { role: 'user' | 'assistant'; content: string }[];
      context: {
        name: string;
        signature: Signature;
        lifePath: number;
        expression: number;
        soulUrge: number;
      };
    };

    if (!message?.trim()) {
      return new Response('Message is required.', { status: 400 });
    }

    // Crisis guardrail — bypass LLM entirely
    if (isCrisisMessage(message)) {
      const crisisResponse = `I hear something heavy in your words, and I want you to know — you matter deeply. Please reach out to someone who can truly be there with you right now.

🆘 **US Crisis Line:** Call or text **988**
🌍 **International:** befrienders.org

When you're ready, the stars and I will be right here, waiting to guide you forward. 🪔`;
      return new Response(crisisResponse, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (!context?.signature) {
      return new Response('No cosmic signature found.', { status: 400 });
    }

    const llmCtx: LLMContext = {
      userName: context.name || 'Dear One',
      signature: context.signature,
      lifePath: context.lifePath,
      expression: context.expression,
      soulUrge: context.soulUrge,
      history,
      message,
    };

    const stream = await streamOracle(llmCtx);

    // Add immigration / medical footers via transform
    const immigrationKeywords = ['immigration', 'visa', 'green card', 'citizenship', 'us immigration'];
    const medicalKeywords = ['health', 'disease', 'illness', 'doctor', 'medicine', 'medical'];
    const lowerMsg = message.toLowerCase();

    let footer = '';
    if (immigrationKeywords.some(k => lowerMsg.includes(k))) {
      footer = '\n\n*For visa procedures, please consult a licensed immigration attorney. What the stars show is timing and karma, not paperwork.*';
    } else if (medicalKeywords.some(k => lowerMsg.includes(k))) {
      footer = '\n\n*For specific health concerns, please consult a qualified healthcare professional.*';
    }

    if (!footer) {
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Append footer after stream completes
    const encoder = new TextEncoder();
    const transformedStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.enqueue(encoder.encode(footer));
        controller.close();
      },
    });

    return new Response(transformedStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Oracle error:', msg);
    return new Response(
      `The oracle could not be reached. ${msg.includes('API key') ? 'Please configure your API key in .env.local.' : 'Please try again.'}`,
      { status: 500 }
    );
  }
}
