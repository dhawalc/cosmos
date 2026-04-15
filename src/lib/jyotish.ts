import { Body, MakeTime, SunPosition, EclipticGeoMoon, EclipticLongitude } from 'astronomy-engine';

// ─── Types ───────────────────────────────────────────────────────────

export type Signature = {
  lagna:     { sign: string; degree: number; lord: string };
  moon:      { sign: string; degree: number; nakshatra: string; pada: number };
  sun:       { sign: string; degree: number };
  nakshatra: { name: string; lord: string; deity: string; symbol: string };
  mahadasha: { lord: string; startsOn: string; endsOn: string };
  antardasha?: { lord: string; startsOn: string; endsOn: string };
  currentTransits?: { jupiter: string; saturn: string; rahu: string };
  birthTimeKnown?: boolean;
};

// ─── Constants ───────────────────────────────────────────────────────

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

const LORDS = [
  "Mars","Venus","Mercury","Moon","Sun","Mercury",
  "Venus","Mars","Jupiter","Saturn","Saturn","Jupiter",
];

const NAKSHATRAS = [
  { name: "Ashwini",            lord: "Ketu",    deity: "Ashwini Kumaras",  symbol: "Horse's head" },
  { name: "Bharani",            lord: "Venus",   deity: "Yama",             symbol: "Yoni" },
  { name: "Krittika",           lord: "Sun",     deity: "Agni",             symbol: "Razor / flame" },
  { name: "Rohini",             lord: "Moon",    deity: "Brahma",           symbol: "Ox cart / chariot" },
  { name: "Mrigashira",         lord: "Mars",    deity: "Soma",             symbol: "Deer's head" },
  { name: "Ardra",              lord: "Rahu",    deity: "Rudra",            symbol: "Teardrop / gem" },
  { name: "Punarvasu",          lord: "Jupiter", deity: "Aditi",            symbol: "Bow & quiver" },
  { name: "Pushya",             lord: "Saturn",  deity: "Brihaspati",       symbol: "Lotus / arrow" },
  { name: "Ashlesha",           lord: "Mercury", deity: "Nagas",            symbol: "Serpent" },
  { name: "Magha",              lord: "Ketu",    deity: "Pitrs",            symbol: "Throne / palanquin" },
  { name: "Purva Phalguni",     lord: "Venus",   deity: "Bhaga",            symbol: "Hammock / fig tree" },
  { name: "Uttara Phalguni",    lord: "Sun",     deity: "Aryaman",          symbol: "Four legs of bed" },
  { name: "Hasta",              lord: "Moon",    deity: "Savitar",          symbol: "Hand / fist" },
  { name: "Chitra",             lord: "Mars",    deity: "Tvashtar",         symbol: "Bright jewel / pearl" },
  { name: "Swati",              lord: "Rahu",    deity: "Vayu",             symbol: "Coral / sword" },
  { name: "Vishakha",           lord: "Jupiter", deity: "Indra-Agni",       symbol: "Triumphal arch" },
  { name: "Anuradha",           lord: "Saturn",  deity: "Mitra",            symbol: "Lotus / staff" },
  { name: "Jyeshtha",           lord: "Mercury", deity: "Indra",            symbol: "Circular amulet" },
  { name: "Mula",               lord: "Ketu",    deity: "Nirriti",          symbol: "Roots tied together" },
  { name: "Purva Ashadha",      lord: "Venus",   deity: "Apas",             symbol: "Elephant tusk / fan" },
  { name: "Uttara Ashadha",     lord: "Sun",     deity: "Vishvedevas",      symbol: "Elephant tusk" },
  { name: "Shravana",           lord: "Moon",    deity: "Vishnu",           symbol: "Three footprints" },
  { name: "Dhanishtha",         lord: "Mars",    deity: "Ashta Vasus",      symbol: "Drum / flute" },
  { name: "Shatabhisha",        lord: "Rahu",    deity: "Varuna",           symbol: "Empty circle" },
  { name: "Purva Bhadrapada",   lord: "Jupiter", deity: "Ajaikapad",        symbol: "Two-faced man" },
  { name: "Uttara Bhadrapada",  lord: "Saturn",  deity: "Ahirbudhnya",      symbol: "Twins / back legs of funeral cot" },
  { name: "Revati",             lord: "Mercury", deity: "Pusha",            symbol: "Fish / drum" },
];

const VIMSHOTTARI_ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const NAK_SPAN = 360 / 27; // 13.3333°

// ─── Lahiri Ayanamsa ─────────────────────────────────────────────────

function getLahiriAyanamsa(date: Date): number {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const years = (date.getTime() - J2000) / (365.25 * 24 * 3600_000);
  return 23.856 + (50.29 / 3600) * years;
}

function toSidereal(tropicalLon: number, date: Date): number {
  let sid = tropicalLon - getLahiriAyanamsa(date);
  if (sid < 0) sid += 360;
  return sid % 360;
}

// ─── Helpers ─────────────────────────────────────────────────────────

function signInfo(siderealLon: number) {
  const idx = Math.floor(siderealLon / 30) % 12;
  const deg = Math.round((siderealLon % 30) * 100) / 100;
  return { sign: SIGNS[idx], degree: deg, lord: LORDS[idx] };
}

function nakInfo(siderealMoonLon: number) {
  const idx = Math.floor(siderealMoonLon / NAK_SPAN) % 27;
  const posInNak = siderealMoonLon % NAK_SPAN;
  const pada = Math.min(Math.floor(posInNak / (NAK_SPAN / 4)) + 1, 4);
  const proportionElapsed = posInNak / NAK_SPAN;
  return { ...NAKSHATRAS[idx], pada, proportionElapsed };
}

function fmtDate(d: Date): string { return d.toISOString().split('T')[0]; }

function addYears(d: Date, y: number): Date {
  const r = new Date(d);
  const whole = Math.floor(y);
  const months = Math.round((y - whole) * 12);
  r.setFullYear(r.getFullYear() + whole);
  r.setMonth(r.getMonth() + months);
  return r;
}

// ─── Rahu (Mean North Node) ──────────────────────────────────────────

function getRahuTropical(date: Date): number {
  const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const days = (date.getTime() - J2000) / (24 * 3600_000);
  let lon = 125.0445 - 0.05295 * days; // retrograde motion
  lon = ((lon % 360) + 360) % 360;
  return lon;
}

// ─── Vimshottari Mahadasha + Antardasha ──────────────────────────────

function calculateDasha(moonSiderealLon: number, birthDate: Date) {
  const nak = nakInfo(moonSiderealLon);
  const remaining = 1 - nak.proportionElapsed;
  const startIdx = VIMSHOTTARI_ORDER.indexOf(nak.lord);
  const now = new Date();

  let cursor = new Date(birthDate);

  for (let i = 0; i < 18; i++) {
    const lordIdx = (startIdx + i) % 9;
    const lord = VIMSHOTTARI_ORDER[lordIdx];
    const totalYears = VIMSHOTTARI_YEARS[lord];
    const years = i === 0 ? remaining * totalYears : totalYears;

    const start = new Date(cursor);
    const end = addYears(cursor, years);

    if (now >= start && now < end) {
      // Found current mahadasha — now find antardasha within it
      let aCursor = new Date(start);
      let antardasha = { lord, startsOn: fmtDate(start), endsOn: fmtDate(end) };

      for (let j = 0; j < 9; j++) {
        const aIdx = (lordIdx + j) % 9;
        const aLord = VIMSHOTTARI_ORDER[aIdx];
        const aYears = (years * VIMSHOTTARI_YEARS[aLord]) / 120;
        const aStart = new Date(aCursor);
        const aEnd = addYears(aCursor, aYears);

        if (now >= aStart && now < aEnd) {
          antardasha = { lord: aLord, startsOn: fmtDate(aStart), endsOn: fmtDate(aEnd) };
          break;
        }
        aCursor = aEnd;
      }

      return {
        mahadasha: { lord, startsOn: fmtDate(start), endsOn: fmtDate(end) },
        antardasha,
      };
    }
    cursor = end;
  }

  // Fallback
  const lord = VIMSHOTTARI_ORDER[startIdx];
  return {
    mahadasha: { lord, startsOn: fmtDate(birthDate), endsOn: fmtDate(addYears(birthDate, VIMSHOTTARI_YEARS[lord])) },
    antardasha: { lord, startsOn: fmtDate(birthDate), endsOn: fmtDate(addYears(birthDate, VIMSHOTTARI_YEARS[lord])) },
  };
}

// ─── Main Computation ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function computeSignature(name: string, dob: string, time: string, _place: string): Promise<Signature> {
  // Parse birth date + time
  const [y, m, d] = dob.split('-').map(Number);
  const birthTimeKnown = !!time && time !== '12:00';
  const [h, min] = time ? time.split(':').map(Number) : [12, 0];
  const birthDate = new Date(y, m - 1, d, h, min, 0);
  const astroTime = MakeTime(birthDate);

  // ── Sun (tropical → sidereal) ──
  const sunTropical = SunPosition(astroTime).elon;
  const sunSidereal = toSidereal(sunTropical, birthDate);
  const sun = signInfo(sunSidereal);

  // ── Moon (tropical → sidereal) ──
  const moonTropical = EclipticGeoMoon(astroTime).lon;
  const moonSidereal = toSidereal(moonTropical, birthDate);
  const moonSign = signInfo(moonSidereal);
  const moonNak = nakInfo(moonSidereal);

  // ── Lagna: use Chandra Lagna (Moon sign) when birth time unknown ──
  const lagna = { sign: moonSign.sign, degree: moonSign.degree, lord: moonSign.lord };

  // ── Dasha ──
  const { mahadasha, antardasha } = calculateDasha(moonSidereal, birthDate);

  // ── Current Transits (today) ──
  const now = new Date();
  const nowAstro = MakeTime(now);
  const jupSid = toSidereal(EclipticLongitude(Body.Jupiter, nowAstro), now);
  const satSid = toSidereal(EclipticLongitude(Body.Saturn, nowAstro), now);
  const rahuSid = toSidereal(getRahuTropical(now), now);

  return {
    lagna,
    moon: {
      sign: moonSign.sign,
      degree: moonSign.degree,
      nakshatra: moonNak.name,
      pada: moonNak.pada,
    },
    sun: { sign: sun.sign, degree: sun.degree },
    nakshatra: {
      name: moonNak.name,
      lord: moonNak.lord,
      deity: moonNak.deity,
      symbol: moonNak.symbol,
    },
    mahadasha,
    antardasha,
    currentTransits: {
      jupiter: `${signInfo(jupSid).sign} at ${signInfo(jupSid).degree}°`,
      saturn: `${signInfo(satSid).sign} at ${signInfo(satSid).degree}°`,
      rahu: `${signInfo(rahuSid).sign} at ${signInfo(rahuSid).degree}°`,
    },
    birthTimeKnown,
  };
}
