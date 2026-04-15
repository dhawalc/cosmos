# Cosmos — Handoff Notes

**Live URL:** https://cosmos-lilac.vercel.app
**Repo:** https://github.com/dhawalc/cosmos (public)
**Stack:** Next.js 15 + Gemini 2.5 Flash + Supabase + Vercel

---

## What's Built

### Core App (4-stage flow)
1. **Landing** — "The stars know you, Himani." Personalized greeting.
2. **Birth Imprint** — Prefilled with Himani's data (Aug 24 1984, Surat). Hit "Reveal My Signature" to compute her chart.
3. **Cosmic Signature** — Shows her real chart: Sun in Leo, Moon in Cancer (Pushya nakshatra), Venus Mahadasha, Life Path 9.
4. **Oracle (Tārā)** — AI chat powered by Gemini 2.5 Flash. Knows her family, career at Fragomen, immigration situation. Tone-tuned to be honest but positive — never leaves her more anxious.

### Real Jyotish Engine
- **astronomy-engine** library for actual Sun, Moon, Jupiter, Saturn positions
- Lahiri ayanamsa correction (tropical → sidereal)
- Proper Vimshottari Mahadasha + Antardasha from real Moon nakshatra position
- Current transit data passed to AI for timing questions
- Pythagorean numerology (Life Path, Expression, Soul Urge) with correct calculation

### Database (Supabase)
- **Profiles table** — Family members with computed charts
- **Activity logs** — Every Oracle Q&A stored with timestamp
- Pre-seeded profiles: Himani (self), Malkesh (husband), Naksh (son), Pooja (sister)
- Malkesh/Naksh/Pooja DOBs are approximate — she can update via the Family panel (people icon in Oracle header)

### Mobile
- Responsive across all screens (320px → desktop)
- Reduced 3D particles on mobile for performance
- Scaled SVG mandala, stacked form fields, tighter padding

---

## Environment Variables

### Vercel (already set)
| Var | Status |
|-----|--------|
| `GEMINI_API_KEY` | Set |
| `NEXT_PUBLIC_SUPABASE_URL` | Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Set |

### .env.local (local dev)
Same keys, already configured. `.env.local` is gitignored.

`ANTHROPIC_API_KEY` is empty — if added, the app will use Claude as primary LLM and fall back to Gemini.

---

## Supabase
- **Project ID:** zouodkeayeuekryxxfpj
- **URL:** https://zouodkeayeuekryxxfpj.supabase.co
- **Schema:** `supabase-schema.sql` (already run)
- **Tables:** `profiles`, `activity_logs`
- No RLS configured (single-user app). Add if you ever expose it to multiple users.

---

## Key Files

| File | What it does |
|------|-------------|
| `src/lib/jyotish.ts` | Real astronomical calculations (Sun, Moon, planets, dasha) |
| `src/lib/numerology.ts` | Life Path, Expression, Soul Urge numbers |
| `src/lib/prompt.ts` | System prompt for Tārā — personal context, tone rules, guardrails |
| `src/lib/llm.ts` | Gemini/Claude streaming with fatalistic content filter |
| `src/lib/supabase.ts` | Lazy Supabase client (graceful when unconfigured) |
| `src/components/stages/Oracle.tsx` | Chat UI + activity logging |
| `src/components/FamilyPanel.tsx` | Slide-out panel for managing family profiles |

---

## Things To Do Next

- [ ] Get real DOBs for Malkesh, Naksh, and Pooja (currently approximate — update in Family panel or via API)
- [ ] Add Himani's birth time if she knows it (unlocks real Lagna/Ascendant instead of Chandra Lagna)
- [ ] Consider adding compatibility readings between profiles (e.g., Himani + Malkesh synastry)
- [ ] Past readings viewer — logs are stored but there's no UI to browse them yet
- [ ] Rotate the Supabase secret key (it was shared in chat)

---

## Himani's Chart (verified)

| | Value |
|---|---|
| Sun (sidereal) | Leo at 7.85° |
| Moon | Cancer at 5.76° |
| Nakshatra | Pushya (Saturn, Brihaspati, Lotus/arrow), Pada 1 |
| Lagna | Chandra Lagna = Cancer (birth time unknown) |
| Mahadasha | Venus (2024–2044) |
| Antardasha | Venus (2024–2027) |
| Life Path | 9 |
| Expression | 3 |
| Soul Urge | 3 |
| Jupiter transit | Cancer at 3.66° (in her Moon sign — very favorable) |
| Saturn transit | Pisces at 11.21° |
| Rahu transit | Aquarius at 12.47° |
