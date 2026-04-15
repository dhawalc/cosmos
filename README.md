# ✦ Cosmos — Vedic Astrology + Numerology Oracle

> *Ancient Jyotish + numerology, distilled into a conversation.*

A cinematic single-page web app that generates a personalized Vedic birth chart (Lagna, Rashi, Nakshatra, Mahadasha) and numerology profile (Life Path, Expression, Soul Urge), then lets users have a free-form conversation with **Tārā** — an AI oracle powered by Claude or Gemini.

---

## Quick Start (Running Locally)

### Prerequisites
- [Node.js 18+](https://nodejs.org/) — download and install if you don't have it
- An API key from **Anthropic** or **Google** (see below)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up your API key
cp .env.example .env.local
# Open .env.local in any text editor and paste your key

# 3. Run the app
npm run dev

# 4. Open in browser
# → http://localhost:3000
```

That's it. The app works immediately — even without an API key it will show a clear error message pointing to exactly what's missing.

---

## Getting an API Key (Free Options)

### Option A — Google Gemini (100% Free)
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with Google → click **Create API Key**
3. Copy the key into `.env.local`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

### Option B — Anthropic Claude ($5 credit on signup)
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create account → **API Keys** → **Create Key**
3. Copy into `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

> **Both keys are optional independently** — the app tries Claude first, then Gemini. Set at least one.

---

## Project Structure

```
cosmos/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Fonts, global canvas background
│   │   ├── page.tsx                # Stage router (1–4)
│   │   ├── globals.css             # Design tokens (gold, indigo, void…)
│   │   └── api/
│   │       ├── signature/route.ts  # POST → computes Vedic + numerology
│   │       └── oracle/route.ts     # POST → streaming LLM chat
│   ├── components/
│   │   ├── cosmic/
│   │   │   ├── BackgroundCanvas.tsx  # R3F wrapper
│   │   │   ├── Starfield.tsx         # 5000 stars + gold sparkles
│   │   │   ├── Mandala.tsx           # Animated SVG Sri Yantra
│   │   │   └── SignatureCard.tsx     # Glassmorphic reveal card
│   │   ├── stages/
│   │   │   ├── Invocation.tsx        # Stage 1: Landing
│   │   │   ├── BirthImprint.tsx      # Stage 2: Data entry
│   │   │   ├── CosmicSignature.tsx   # Stage 3: Chart reveal
│   │   │   └── Oracle.tsx            # Stage 4: Chat
│   │   └── ui/
│   │       └── GlassCard.tsx         # Floating glassmorphic card
│   ├── lib/
│   │   ├── jyotish.ts    # All 27 Nakshatras, Vimshottari Mahadasha
│   │   ├── numerology.ts # Life Path, Expression, Soul Urge
│   │   ├── llm.ts        # Claude primary → Gemini fallback, streaming
│   │   ├── prompt.ts     # System prompt builder (injects chart data)
│   │   └── geocode.ts    # Place → lat/lon (mock, upgradeable)
│   └── store/
│       └── profile.ts    # Zustand store, localStorage-persisted
├── .env.example          # ← Copy this to .env.local and add keys
├── vercel.json           # Vercel deployment config
└── package.json
```

---

## Deploying to Vercel (Shareable URL — Recommended)

This makes it accessible from **any browser anywhere** — no Node.js needed on your friend's machine.

### One-time setup
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow the prompts — all defaults are fine)
vercel
```

When prompted for Environment Variables, paste your `ANTHROPIC_API_KEY` and/or `GEMINI_API_KEY`.

**Your app will be live at:** `https://cosmos-yourname.vercel.app`

### Re-deploying after changes
```bash
vercel --prod
```

---

## Giving It to Your Friend's Laptop (Local Option)

If they want to run it locally:

1. **Install Node.js** on their laptop from [nodejs.org](https://nodejs.org/) (LTS version)
2. Copy the entire `cosmos/` folder to their machine (USB, zip, AirDrop, etc.)
3. Create `.env.local` with the API key
4. Open a terminal in the folder and run:
   ```bash
   npm install
   npm run dev
   ```
5. Visit `http://localhost:3000`

---

## Upgrading to Real Astrology Data

The app currently uses a **deterministic engine** (same inputs → same chart, every time). To plug in real ephemeris data:

1. Get a free key from [freeastrologyapi.com](https://freeastrologyapi.com)
2. Add to `.env.local`: `FREE_ASTROLOGY_API_KEY=your_key`
3. Replace the `computeSignature()` function in `src/lib/jyotish.ts` with an API call to their `/planets` and `/dashas` endpoints using Lahiri ayanamsa.

---

## Guardrails Built In

| Trigger | Behavior |
|---|---|
| Crisis / self-harm language | Bypasses LLM entirely → shows crisis hotline card (988) |
| Immigration questions | Adds legal disclaimer footer automatically |
| Medical questions | Adds healthcare disclaimer footer |
| Fatalistic words detected mid-stream | Stops generation, prompts reframe |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Styling | Tailwind CSS v4 + CSS Variables |
| 3D Background | React Three Fiber + Drei |
| Animation | Framer Motion |
| LLM Primary | Claude Haiku 4.5 (Anthropic) |
| LLM Fallback | Gemini 2.0 Flash (Google) |
| State | Zustand + localStorage |
| Fonts | Cormorant Garamond, Inter, Tiro Devanagari Sanskrit |

---

*Built with love, starlight, and a little bit of karma.* ✦
