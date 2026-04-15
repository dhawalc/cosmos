export type Signature = {
  lagna:     { sign: string; degree: number; lord: string };
  moon:      { sign: string; degree: number; nakshatra: string; pada: number };
  sun:       { sign: string; degree: number };
  nakshatra: { name: string; lord: string; deity: string; symbol: string };
  mahadasha: { lord: string; startsOn: string; endsOn: string };
};

const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const lords = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];

// All 27 Nakshatras with Vimshottari lords
const nakshatras = [
  { name: "Ashwini",     lord: "Ketu",    deity: "Ashwini Kumaras", symbol: "Horse's head",    years: 7  },
  { name: "Bharani",     lord: "Venus",   deity: "Yama",            symbol: "Yoni",             years: 20 },
  { name: "Krittika",    lord: "Sun",     deity: "Agni",            symbol: "Razor / flame",    years: 6  },
  { name: "Rohini",      lord: "Moon",    deity: "Brahma",          symbol: "Ox cart / chariot",years: 10 },
  { name: "Mrigashira",  lord: "Mars",    deity: "Soma",            symbol: "Deer's head",      years: 7  },
  { name: "Ardra",       lord: "Rahu",    deity: "Rudra",           symbol: "Teardrop / gem",   years: 18 },
  { name: "Punarvasu",   lord: "Jupiter", deity: "Aditi",           symbol: "Bow & quiver",     years: 16 },
  { name: "Pushya",      lord: "Saturn",  deity: "Brihaspati",      symbol: "Lotus / arrow",    years: 19 },
  { name: "Ashlesha",    lord: "Mercury", deity: "Nagas",           symbol: "Serpent",          years: 17 },
  { name: "Magha",       lord: "Ketu",    deity: "Pitrs",           symbol: "Throne / palanquin",years: 7 },
  { name: "Purva Phalguni", lord: "Venus",deity: "Bhaga",           symbol: "Hammock / fig tree",years: 20},
  { name: "Uttara Phalguni",lord: "Sun",  deity: "Aryaman",         symbol: "Four legs of bed", years: 6  },
  { name: "Hasta",       lord: "Moon",    deity: "Savitar",         symbol: "Hand / fist",      years: 10 },
  { name: "Chitra",      lord: "Mars",    deity: "Tvashtar",        symbol: "Bright jewel / pearl",years: 7},
  { name: "Swati",       lord: "Rahu",    deity: "Vayu",            symbol: "Coral / sword",    years: 18 },
  { name: "Vishakha",    lord: "Jupiter", deity: "Indra-Agni",      symbol: "Triumphal arch",   years: 16 },
  { name: "Anuradha",    lord: "Saturn",  deity: "Mitra",           symbol: "Lotus / staff",    years: 19 },
  { name: "Jyeshtha",    lord: "Mercury", deity: "Indra",           symbol: "Circular amulet",  years: 17 },
  { name: "Mula",        lord: "Ketu",    deity: "Nirriti",         symbol: "Roots tied together",years: 7},
  { name: "Purva Ashadha",lord: "Venus",  deity: "Apas",            symbol: "Elephant tusk / fan",years:20},
  { name: "Uttara Ashadha",lord: "Sun",   deity: "Vishvedevas",     symbol: "Elephant tusk",    years: 6  },
  { name: "Shravana",    lord: "Moon",    deity: "Vishnu",          symbol: "Three footprints",  years: 10 },
  { name: "Dhanishtha",  lord: "Mars",    deity: "Ashta Vasus",     symbol: "Drum / flute",     years: 7  },
  { name: "Shatabhisha", lord: "Rahu",    deity: "Varuna",          symbol: "Empty circle",     years: 18 },
  { name: "Purva Bhadrapada",lord:"Jupiter",deity:"Ajaikapad",      symbol: "Two-faced man",    years: 16 },
  { name: "Uttara Bhadrapada",lord:"Saturn",deity:"Ahirbudhnya",    symbol: "Twins / back legs of funeral cot",years:19},
  { name: "Revati",      lord: "Mercury", deity: "Pusha",           symbol: "Fish / drum",      years: 17 },
];

const VIMSHOTTARI_ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const VIMSHOTTARI_YEARS = { Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17 } as Record<string,number>;

function getMahadasha(nakIdx: number, dob: string): { lord: string; startsOn: string; endsOn: string } {
  const nak = nakshatras[nakIdx];
  const startLord = nak.lord;
  const orderIdx = VIMSHOTTARI_ORDER.indexOf(startLord);
  void orderIdx; // reserved for future Mahadasha sequencing
  
  // Approximate start using DOB year
  const birthYear = parseInt(dob.split('-')[0], 10) || 1990;
  const startYear = birthYear;
  const endYear = startYear + (VIMSHOTTARI_YEARS[startLord] || 10);

  return {
    lord: startLord,
    startsOn: `${startYear}-01-01`,
    endsOn: `${endYear}-01-01`,
  };
}

/**
 * Deterministic mock — in v2, swap for a real Swiss Ephemeris / API call.
 * The hash is stable for the same name+dob, so the same person always
 * receives the same reading across sessions.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function computeSignature(name: string, dob: string, _time: string, _place: string): Promise<Signature> {
  // Build a stable numeric hash from name + dob digits
  const dobDigits = dob.replace(/\D/g, '');
  let hash = 0;
  for (const ch of name.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffff;
  hash += parseInt(dobDigits.slice(0, 8) || '0');

  const signIndex  = Math.abs(hash)       % 12;
  const moonIndex  = Math.abs(hash + 137) % 12;
  const sunIndex   = Math.abs(hash + 271) % 12;
  const nakIndex   = Math.abs(hash)       % 27;
  const moonNakIdx = Math.abs(hash + 137) % 27;

  return {
    lagna: {
      sign:   signs[signIndex],
      degree: (Math.abs(hash) % 30) + 1,
      lord:   lords[signIndex],
    },
    moon: {
      sign:      signs[moonIndex],
      degree:    (Math.abs(hash + 5) % 30) + 1,
      nakshatra: nakshatras[moonNakIdx].name,
      pada:      (Math.abs(hash) % 4) + 1,
    },
    sun: {
      sign:   signs[sunIndex],
      degree: (Math.abs(hash + 10) % 30) + 1,
    },
    nakshatra: nakshatras[nakIndex],
    mahadasha: getMahadasha(moonNakIdx, dob),
  };
}
