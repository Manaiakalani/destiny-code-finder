// Code Scraper Service
// Aggregates emblem codes from multiple sources (Reddit, Blueberries.gg, known codes)

const CORS_PROXY = 'https://corsproxy.io/?';

export interface EmblemCodeData {
  code: string;
  emblemName: string;
  source?: string;
  isActive: boolean;
  iconUrl?: string;
  description?: string;
  note?: string;
  isD1?: boolean;
}

/**
 * Known emblem codes - verified against destinyemblemcollector.com, rewards.mijago.net, and blueberries.gg
 * Last updated: July 2026
 */
export const KNOWN_ACTIVE_CODES: EmblemCodeData[] = [
  // ═══════════════════════════════════════════
  // D2 UNIVERSAL EMBLEM CODES (61 verified)
  // ═══════════════════════════════════════════
  { code: '3VF-LGC-RLX', emblemName: 'Insula Thesauria', source: 'Promotional', isActive: true },
  { code: '7CP-94V-LFP', emblemName: 'Lone Focus, Jagged Edge', source: 'Promotional', isActive: true },
  { code: 'A7L-FYC-44X', emblemName: 'Flames of Forgotten Truth', source: 'Promotional', isActive: true },
  { code: 'JD7-4CM-HJG', emblemName: 'Illusion of Light', source: 'Promotional', isActive: true },
  { code: 'JDT-NLC-JKM', emblemName: 'Ab Aeterno', source: 'Promotional', isActive: true },
  { code: 'JNX-DMH-XLA', emblemName: 'Field of Light', source: 'Promotional', isActive: true },
  { code: 'N3L-XN6-PXF', emblemName: 'The Reflective Proof', source: 'Promotional', isActive: true },
  { code: 'X9F-GMA-H6D', emblemName: 'The Unimagined Plane', source: 'Promotional', isActive: true },
  { code: '7F9-767-F74', emblemName: 'Sign of the Finite', source: 'Promotional', isActive: true },
  { code: 'X4C-FGX-MX3', emblemName: 'Note of Conquest', source: 'Promotional', isActive: true },
  { code: 'F6K-D44-JH4', emblemName: 'Gloriabundus', source: 'Bungie Social Media', isActive: true, description: 'Released July 7, 2026' },
  { code: 'JA9-PRC-XKX', emblemName: 'Take the Mantle', source: 'Pre-Release Event', isActive: true, description: 'Released March 26, 2026' },
  { code: 'YRC-C3D-YNC', emblemName: 'A Classy Order', source: 'TWAB Reward', isActive: true },
  { code: '9FY-KDD-PRT', emblemName: 'Adventurous Spirit', source: 'Community', isActive: true },
  { code: 'HN3-7K9-93G', emblemName: 'Airlock Invitation', source: 'Fall Guys Promo', isActive: true },
  { code: 'PTD-GKG-CVN', emblemName: 'Archived', source: 'TFS Collector\'s Edition', isActive: true },
  { code: 'ML3-FD4-ND9', emblemName: 'Be True', source: 'Trans Awareness', isActive: true },
  { code: 'A67-C7X-3GN', emblemName: 'Bulbul Tarang', source: 'Promotional', isActive: true },
  { code: 'VHT-6A7-3MM', emblemName: 'Conqueror of Infinity', source: 'Promotional', isActive: true },
  { code: 'PHV-6LF-9CP', emblemName: 'Countdown to Convergence', source: 'TWQ Collector\'s Edition', isActive: true },
  { code: 'D97-YCX-7JK', emblemName: 'Crushed Gamma', source: 'r/Destiny Celebration', isActive: true },
  { code: 'RA9-XPH-6KJ', emblemName: 'Cryonautics', source: 'BL Collector\'s Edition', isActive: true },
  { code: 'JXJ-HVA-RCX', emblemName: 'Ever Forward', source: 'Promotional', isActive: true },
  { code: '3J9-AMM-7MG', emblemName: 'Folding Space', source: 'TFS Collector\'s Edition', isActive: true },
  { code: '7LV-GTK-T7J', emblemName: 'Future in Shadow', source: 'BL Collector\'s Edition', isActive: true },
  { code: 'JYN-JAA-Y7D', emblemName: 'Galilean Excursion', source: 'BL Collector\'s Edition', isActive: true },
  { code: '3CV-D6K-RD4', emblemName: 'Gone Home', source: 'TFS Collector\'s Edition', isActive: true },
  { code: 'VXN-V3T-MRP', emblemName: 'Harmonic Commencement', source: 'Promotional', isActive: true },
  { code: 'L7T-CVV-3RD', emblemName: 'Heliotrope Warren', source: '30th Anniversary', isActive: true },
  { code: 'XVK-RLA-RAM', emblemName: 'In Urbe Inventa', source: 'Promotional', isActive: true },
  { code: 'J6P-9YH-LLP', emblemName: 'In Vino Mendacium', source: 'Promotional', isActive: true },
  { code: 'TNN-DKM-6LG', emblemName: 'Jade\'s Burrow', source: 'Lunar New Year 2023', isActive: true },
  { code: 'VA7-L7H-PNC', emblemName: 'Liminal Nadir', source: 'TWQ Collector\'s Edition', isActive: true },
  { code: 'XMY-G9M-6XH', emblemName: 'Limitless Horizon', source: 'Lightfall Collector\'s Edition', isActive: true },
  { code: 'JND-HLR-L69', emblemName: 'M:\\>START', source: 'Marathon ARG', isActive: true },
  { code: 'FMM-44A-RKP', emblemName: 'Myopia', source: 'TFS Collector\'s Edition', isActive: true },
  { code: 'YAA-37T-FCN', emblemName: 'Neon Mirage', source: 'Promotional', isActive: true },
  { code: 'L3P-XXR-GJ4', emblemName: 'Out the Airlock', source: 'EA/BioWare Partnership', isActive: true },
  { code: 'THR-33A-YKC', emblemName: 'Risen', source: 'BiliBili Partnership', isActive: true },
  { code: '9LX-7YC-6TX', emblemName: 'Schrödinger\'s Gun', source: 'Telesto Event', isActive: true },
  { code: 'JGN-PX4-DFN', emblemName: 'Secret Signal', source: 'Aion Archives ARG', isActive: true },
  { code: '7D4-PKR-MD7', emblemName: 'Sequence Flourish', source: 'Splicer Puzzle', isActive: true },
  { code: 'XVX-DKJ-CVM', emblemName: 'Seraphim\'s Gauntlets', source: 'Community Memorial', isActive: true },
  { code: 'F99-KPX-NCF', emblemName: 'Shadow\'s Light', source: 'TWQ Collector\'s Edition', isActive: true },
  { code: '6LJ-GH7-TPA', emblemName: 'Sneer of the Oni', source: 'TWQ Collector\'s Edition', isActive: true },
  { code: 'T67-JXY-PH6', emblemName: 'Stag\'s Spirit', source: 'Nightmare Containment', isActive: true },
  { code: 'PKH-JL6-L4R', emblemName: 'Tangled Web', source: 'TWAB 2022-02-10', isActive: true },
  { code: 'XFV-KHP-N97', emblemName: 'The Visionary', source: 'Curse of Osiris', isActive: true },
  { code: '6AJ-XFR-9ND', emblemName: 'Tigris Fati', source: 'TFS Dev Stream Twitch Drop', isActive: true },
  { code: '993-H3H-M6K', emblemName: 'Visio Spei', source: 'Promotional', isActive: true },
  { code: 'HG7-YRG-HHF', emblemName: 'Year of the Snake', source: 'BiliBili Promo', isActive: true },
  { code: 'JVG-VNT-GGG', emblemName: 'соняшник', source: 'Ukraine Support', isActive: true, description: 'соняшник (Sunflower)' },
  { code: 'DXL-XHC-X37', emblemName: 'Runner', source: 'Special Offer', isActive: true },
  { code: 'VMG-HXK-VAL', emblemName: 'Broken and Bruised', source: 'Promotional', isActive: true },
  { code: 'JRR-7YA-CCC', emblemName: 'Last Blush', source: 'Promotional', isActive: true },
  { code: 'FCX-P94-JCV', emblemName: 'Little Light', source: 'Promotional', isActive: true },
  { code: '7LD-PLJ-FN3', emblemName: 'Lofty Wail', source: 'Promotional', isActive: true },
  { code: 'J64-HYC-HTD', emblemName: 'Red Shift Returning', source: 'Promotional', isActive: true },
  { code: '9NG-KDD-PNG', emblemName: 'Tethered Storm', source: 'Promotional', isActive: true },
  { code: 'FJ9-LAM-67F', emblemName: 'Binding Focus', source: 'Promotional', isActive: true },

  // ═══════════════════════════════════════════
  // D2 NON-EMBLEM REWARD CODES (10 verified)
  // ═══════════════════════════════════════════
  { code: 'R9J-79M-J6C', emblemName: 'End of the Rainbow', source: 'Pride Celebration', isActive: true, description: 'Transmat Effect' },
  { code: 'TK7-D3P-FDF', emblemName: 'Rainbow Connection', source: 'Pride Celebration', isActive: true, description: 'Emote' },
  { code: 'FLK-TXG-P4A', emblemName: 'Hot and Cold', source: 'Monument of Triumph', isActive: true, description: 'Shader' },
  { code: '3TG-G67-PYD', emblemName: 'Deadlands Titan Ornament Set', source: 'Monument of Triumph', isActive: true, description: 'Titan Armor Ornament Set' },
  { code: 'MMX-3HF-CJ4', emblemName: 'Deadlands Warlock Ornament Set', source: 'Monument of Triumph', isActive: true, description: 'Warlock Armor Ornament Set' },
  { code: '6MC-A3F-X3R', emblemName: 'Deadlands Hunter Ornament Set', source: 'Monument of Triumph', isActive: true, description: 'Hunter Armor Ornament Set' },
  { code: 'FPP-NHV-HNC', emblemName: 'Field Transcriber', source: 'Monument of Triumph', isActive: true, description: 'Ghost Shell' },
  { code: '7AM-PJR-GMX', emblemName: 'Mobile Array', source: 'Monument of Triumph', isActive: true, description: 'Sparrow' },
  { code: 'K9P-PVD-NR6', emblemName: 'Dynamic Equivalence', source: 'Monument of Triumph', isActive: true, description: 'Ship' },
  { code: 'M3L-7DA-67C', emblemName: 'Evergreen Destrier', source: 'Monument of Triumph', isActive: true, description: 'Sparrow' },

  // ═══════════════════════════════════════════
  // DESTINY 1 SHADER CODES (3 verified)
  // ═══════════════════════════════════════════
  { code: 'D6T-3JR-CKX', emblemName: 'Prismatic Expanse', source: 'D1 Shader Code', isActive: true, isD1: true, description: 'Destiny 1 Shader' },
  { code: '7MM-VPD-MHP', emblemName: 'Double Banshee', source: 'D1 Shader Code', isActive: true, isD1: true, description: 'Destiny 1 Shader' },
  { code: 'RXC-9XJ-4MH', emblemName: 'Oracle 99', source: 'D1 Shader Code', isActive: true, isD1: true, description: 'Destiny 1 Shader' },

  // ═══════════════════════════════════════════
  // EXPIRED / NON-UNIVERSAL CODES (dependency noted)
  // ═══════════════════════════════════════════
  { code: 'HVN-VVC-KHL', emblemName: 'System of Peace', source: 'Game2Give Charity', isActive: false, note: 'Game2Give charity donation; individual codes only' },
  { code: '9MX-PA4-RKX', emblemName: 'Parallel Program', source: 'Bungie API', isActive: false, note: 'Bungie API developer emblem; granted manually' },
  { code: 'THR-HTP-LGG', emblemName: 'Field Recognition', source: 'Steelseries Promo', isActive: false, note: 'Steelseries promotion; individual codes only' },
  { code: '6RG-HRH-T9T', emblemName: 'Together We Ramen', source: 'D2 Creator Hub', isActive: false, note: 'Creator Hub emblem; creator program only' },
  { code: 'J3X-GNT-JAF', emblemName: 'Emblem of the Hibiscus', source: 'Netcafe Vendor', isActive: false, note: 'Netcafe vendor emblem; no universal code' },
  { code: 'TCN-HCD-TGY', emblemName: 'Emblem of the Fleet', source: 'Unknown', isActive: false, note: 'No known universal code' },
]

/**
 * Scrape Reddit for emblem codes from multiple subreddits
 */
export async function scrapeRedditCodes(): Promise<EmblemCodeData[]> {
  const codes: EmblemCodeData[] = [];
  
  try {
    const searches = [
      { subreddit: 'DestinyTheGame', query: 'emblem code' },
      { subreddit: 'DestinyTheGame', query: 'redeem code' },
      { subreddit: 'destiny2', query: 'emblem code' },
      { subreddit: 'raidsecrets', query: 'emblem' },
    ];
    
    const results = await Promise.allSettled(
      searches.map(async (search) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        try {
          const url = `https://www.reddit.com/r/${search.subreddit}/search.json?q=${encodeURIComponent(search.query)}&sort=new&limit=50&restrict_sr=1&t=month`;
          
          const response = await fetch(url, {
            headers: { 'User-Agent': 'Destiny Code Finder/1.0' },
            signal: controller.signal,
          });
          
          if (!response.ok) {
            console.warn(`Reddit fetch failed for r/${search.subreddit}:`, response.status);
            return [];
          }
          
          const data = await response.json();
          return { posts: data?.data?.children || [], subreddit: search.subreddit };
        } finally {
          clearTimeout(timeoutId);
        }
      })
    );
    
    const codeRegex = /\b([A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3})\b/gi;
    const bungieCharset = /^[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}$/i;
    
    for (const result of results) {
      if (result.status !== 'fulfilled' || !result.value || Array.isArray(result.value)) continue;
      const { posts, subreddit } = result.value;
      
      posts.forEach((post: { data?: { title?: string; selftext?: string } }) => {
        const title = post.data?.title || '';
        const selftext = post.data?.selftext || '';
        const combinedText = `${title} ${selftext}`;
        
        const matches = combinedText.match(codeRegex);
        if (matches) {
          matches.forEach(code => {
            const normalizedCode = code.toUpperCase();
            
            if (!bungieCharset.test(normalizedCode)) return;
            
            if (!codes.some(c => c.code === normalizedCode)) {
              let emblemName = title
                .replace(codeRegex, '')
                .replace(/emblem|code|redeem|new|free/gi, '')
                .trim()
                .substring(0, 50);
              
              if (!emblemName) {
                emblemName = `Emblem ${normalizedCode}`;
              }
              
              const isExpired = combinedText.toLowerCase().includes('expired') ||
                               combinedText.toLowerCase().includes('not working') ||
                               combinedText.toLowerCase().includes("doesn't work");
              
              codes.push({
                code: normalizedCode,
                emblemName,
                source: `Reddit r/${subreddit}`,
                isActive: !isExpired,
                description: `Found in: ${title.substring(0, 100)}`
              });
            }
          });
        }
      });
    }
    
  } catch (error) {
    console.error('Error scraping Reddit:', error);
  }
  
  return codes;
}

/**
 * Scrape Blueberries.gg for emblem codes
 */
export async function scrapeBlueberriesGG(): Promise<EmblemCodeData[]> {
  const codes: EmblemCodeData[] = [];
  
  try {
    const url = 'https://www.blueberries.gg/items/destiny-2-free-emblems/';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    let response: Response;
    try {
      response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
    
    if (!response.ok) {
      console.warn('Blueberries.gg fetch failed:', response.status);
      return codes;
    }
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const rows = doc.querySelectorAll('table tr');
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 3) {
        const emblemName = cells[1]?.textContent?.trim();
        const code = cells[2]?.textContent?.trim();
        const source = cells[3]?.textContent?.trim() || 'Blueberries.gg';
        
        if (emblemName && code && /^[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}$/i.test(code)) {
          codes.push({
            code: code.toUpperCase(),
            emblemName,
            source: `Blueberries.gg - ${source}`,
            isActive: true,
            description: source
          });
        }
      }
    });
    
    // Backup: search for codes in text
    const bodyText = doc.body.textContent || '';
    const codeRegex = /\b([A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3})\b/gi;
    const matches = bodyText.match(codeRegex);
    
    if (matches) {
      const bungieCharsetCheck = /^[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}$/i;
      matches.forEach(code => {
        const normalizedCode = code.toUpperCase();
        if (!bungieCharsetCheck.test(normalizedCode)) return;
        if (!codes.some(c => c.code === normalizedCode)) {
          codes.push({
            code: normalizedCode,
            emblemName: `Emblem ${normalizedCode}`,
            source: 'Blueberries.gg',
            isActive: true,
            description: 'Found on Blueberries.gg'
          });
        }
      });
    }
    
  } catch (error) {
    console.error('Error scraping Blueberries.gg:', error);
  }
  
  return codes;
}

/**
 * Get all available emblem codes from multiple sources
 */
export async function getAllEmblemCodes(): Promise<EmblemCodeData[]> {
  const allCodes: EmblemCodeData[] = [];
  
  try {
    console.log('🔍 Fetching emblem codes from multiple sources...');
    
    // 1. Start with known active codes
    console.log('✓ Loaded known active codes');
    allCodes.push(...KNOWN_ACTIVE_CODES);
    
    // 2. Scrape Reddit
    try {
      console.log('🔍 Scraping Reddit communities...');
      const redditCodes = await scrapeRedditCodes();
      
      redditCodes.forEach(redditCode => {
        if (!allCodes.some(c => c.code === redditCode.code)) {
          allCodes.push(redditCode);
        }
      });
      console.log(`✓ Found ${redditCodes.length} codes from Reddit`);
    } catch (error) {
      console.warn('⚠️ Reddit scraping failed:', error);
    }
    
    // 3. Scrape Blueberries.gg
    try {
      console.log('🔍 Scraping Blueberries.gg...');
      const blueberriesCodes = await scrapeBlueberriesGG();
      
      blueberriesCodes.forEach(code => {
        if (!allCodes.some(c => c.code === code.code)) {
          allCodes.push(code);
        }
      });
      console.log(`✓ Found ${blueberriesCodes.length} codes from Blueberries.gg`);
    } catch (error) {
      console.warn('⚠️ Blueberries.gg scraping failed:', error);
    }
    
    console.log(`✅ Total unique codes found: ${allCodes.length}`);
    
  } catch (error) {
    console.error('Error fetching all emblem codes:', error);
  }
  
  return allCodes;
}

/**
 * Verify if a code is valid by checking Bungie's redemption page.
 * Note: Client-side validation is limited due to CORS restrictions.
 * This only checks basic format validity against Bungie's charset.
 */
export function verifyCodeFormat(code: string): boolean {
  const bungieCharset = /^[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}$/i;
  return bungieCharset.test(code);
}
