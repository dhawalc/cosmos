"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/store/profile";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, RotateCcw, Star } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  { label: "Career growth at Fragomen", icon: "☉" },
  { label: "Green card timing outlook", icon: "♄" },
  { label: "Malkesh & me this year", icon: "♀" },
  { label: "Naksh's path & potential", icon: "☽" },
  { label: "Wealth & financial growth", icon: "♃" },
  { label: "Health & peace of mind", icon: "♂" },
  { label: "What should I focus on now?", icon: "☊" },
  { label: "Spiritual practice for me", icon: "ॐ" },
];

function ShimmerDots() {
  return (
    <span className="flex gap-1.5 items-center h-5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]"
          animate={{
            opacity: [0.2, 1, 0.2],
            y: [0, -5, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function RemedyChip({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-4 p-3.5 bg-gradient-to-r from-[var(--color-gold)]/[0.08] to-[var(--color-saffron)]/[0.05] rounded-2xl text-sm border border-[var(--color-gold)]/20 flex gap-3 items-start"
    >
      <motion.span
        className="text-xl leading-none"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🪔
      </motion.span>
      <span className="italic opacity-85 leading-relaxed">{text.trim()}</span>
    </motion.div>
  );
}

export default function Oracle() {
  const { name, signature, lifePath, expression, soulUrge, setStage, clearProfile } = useProfileStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = async (prompt: string) => {
    if (!prompt.trim() || isStreaming) return;
    setInput("");
    inputRef.current?.focus();

    const newMessages: Message[] = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);
    setIsStreaming(true);

    const history = newMessages.slice(-6).map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          history: history.slice(0, -1),
          context: { name, signature, lifePath, expression, soulUrge },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setMessages([...newMessages, { role: "assistant", content: `The oracle could not be reached. ${errText}` }]);
        return;
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Handle [REFRAME] token — replace with a gentle reframe message
        if (chunk.includes("[REFRAME]") || assistantMsg.includes("[REFRAME]")) {
          const cleanMsg = assistantMsg.replace("[REFRAME]", "").trim();
          const reframeMsg = cleanMsg + "\n\nThe stars remind us that every challenge carries a seed of transformation. Let\u2019s explore a more empowering angle — what specifically would you like guidance on?";
          setMessages([...newMessages, { role: "assistant", content: reframeMsg }]);
          break;
        }

        assistantMsg += chunk;
        setMessages([...newMessages, { role: "assistant", content: assistantMsg }]);
      }
    } catch (e) {
      console.error(e);
      setMessages([...newMessages, { role: "assistant", content: "The oracle is momentarily between realms. Please try again." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  /** Render assistant message content, splitting out 🪔 remedy as a special chip */
  const renderAssistantContent = (content: string) => {
    const parts = content.split("🪔");
    return (
      <div className="space-y-1">
        <span className="whitespace-pre-wrap leading-relaxed">{parts[0]}</span>
        {parts.slice(1).map((part, idx) => (
          <RemedyChip key={idx} text={part} />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col h-screen w-full max-w-3xl mx-auto px-4 py-4 md:py-6 z-10 relative"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-4 bg-[var(--color-void)]/80 backdrop-blur-xl px-5 py-3.5 rounded-2xl border border-[var(--color-gold)]/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="text-[var(--color-gold)] opacity-60"
          >
            <Star size={18} fill="currentColor" />
          </motion.span>
          <div>
            <h2 className="text-gold-gradient font-serif italic text-xl tracking-wide">Tārā</h2>
            <p className="text-[10px] opacity-35 tracking-widest uppercase">Jyotish & Numerology Oracle</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setStage(3)}
            className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-gold)]/50 hover:text-[var(--color-gold)] transition-colors hidden sm:block"
          >
            ✦ My Signature
          </button>
          <button
            onClick={() => { clearProfile(); setStage(1); }}
            title="Start over"
            className="text-[var(--color-ivory)]/30 hover:text-[var(--color-saffron)] transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </motion.header>

      {/* Chat area — static GlassCard (no bobbing!) */}
      <GlassCard isStatic className="flex-1 flex flex-col overflow-hidden shadow-2xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-5 p-4 md:p-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center mt-[6vh] flex flex-col items-center"
            >
              <motion.span
                className="text-5xl mb-6 block"
                style={{ filter: "drop-shadow(0 0 20px rgba(212,168,75,0.5))" }}
                animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.span>
              <p className="font-serif italic text-xl text-shimmer mb-3">
                What do you seek from the stars, {name}?
              </p>
              <p className="text-xs opacity-30 mb-8 max-w-xs tracking-wide">
                Ask about career, love, family, travel, wealth, health, or anything your soul wonders about
              </p>

              {/* Suggested prompts — now with planet glyphs */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTED_PROMPTS.map((p) => (
                  <motion.button
                    key={p.label}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSend(p.label)}
                    className="
                      px-4 py-2.5
                      border border-[var(--color-gold)]/20 rounded-full
                      text-xs tracking-wide
                      transition-all duration-300
                      hover:bg-[var(--color-gold)]/10 hover:border-[var(--color-gold)]/40
                      flex items-center gap-2
                    "
                  >
                    <span className="text-[var(--color-gold)] opacity-60 text-sm">{p.icon}</span>
                    {p.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[var(--color-gold)]/[0.08] border border-[var(--color-gold)]/15 rounded-br-sm text-[var(--color-ivory)]"
                      : "bg-white/[0.03] border-l-2 border-[var(--color-gold)]/40 rounded-bl-sm text-[var(--color-ivory)]/90 font-light"
                  }`}
                >
                  {m.role === "assistant" && m.content === "" && isStreaming ? (
                    <ShimmerDots />
                  ) : m.role === "assistant" ? (
                    renderAssistantContent(m.content)
                  ) : (
                    <span>{m.content}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={bottomRef} className="h-2" />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-3 border-t border-white/[0.06]">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2.5 items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the stars..."
              disabled={isStreaming}
              className="
                flex-1 bg-[var(--color-void)]/80 text-[var(--color-ivory)]
                placeholder:text-white/20
                border border-[var(--color-gold)]/20 rounded-full
                px-6 py-3.5 text-sm outline-none
                transition-all duration-300
                focus:border-[var(--color-gold)]/50
                disabled:opacity-40
              "
            />
            <motion.button
              type="submit"
              disabled={isStreaming || !input.trim()}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="
                p-3.5
                bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-saffron)]
                text-[var(--color-void)] rounded-full
                disabled:opacity-30 transition-all duration-300
                flex items-center justify-center min-w-[3rem]
                shadow-[0_0_15px_rgba(212,168,75,0.25)]
                hover:shadow-[0_0_25px_rgba(212,168,75,0.4)]
              "
            >
              <Send size={17} className="relative left-[1px]" />
            </motion.button>
          </form>
        </div>
      </GlassCard>
    </motion.div>
  );
}
