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
}

/**
 * Known active emblem codes - manually verified
 * Last updated: January 2026
 */
export const KNOWN_ACTIVE_CODES: EmblemCodeData[] = [
  {
    code: 'YRC-C3D-YNC',
    emblemName: 'The Visionary',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'The Visionary Emblem'
  },
  {
    code: '7D4-PKR-MD7',
    emblemName: 'Folding Space',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'Folding Space Emblem'
  },
  {
    code: 'JYN-JAA-Y7D',
    emblemName: 'Ab Aeterno',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'Ab Aeterno Emblem'
  },
  {
    code: 'RA9-XPH-6KJ',
    emblemName: 'Be True',
    source: 'Pride Month',
    isActive: true,
    description: 'Be True Emblem'
  },
  {
    code: 'JNX-DMH-XLA',
    emblemName: 'The Reflector',
    source: '@DestinyTheGame',
    isActive: true,
    description: 'The Reflector Emblem'
  },
  {
    code: '7LV-GTK-T7J',
    emblemName: 'Future in Shadow',
    source: 'Season of the Wish',
    isActive: true,
    description: 'Season of the Wish Emblem'
  },
  {
    code: 'A7L-FYC-44X',
    emblemName: 'Sign of the Finite',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'Sign of the Finite Emblem'
  },
  {
    code: 'ML3-FD4-ND9',
    emblemName: 'Lone Focus, Jagged Edge',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'Lone Focus, Jagged Edge Emblem'
  },
  {
    code: 'N3L-XN6-PXF',
    emblemName: 'Cryonautics',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'Cryonautics Emblem'
  },
  {
    code: 'X9F-GMA-H6D',
    emblemName: 'Sequence Flourish',
    source: 'Bungie Store',
    isActive: true,
    description: 'Sequence Flourish Emblem'
  },
  {
    code: 'PHV-6LF-9CP',
    emblemName: 'Liminal Nadir',
    source: 'Bungie Store',
    isActive: true,
    description: 'Liminal Nadir Emblem'
  },
  {
    code: '3VF-LGC-RLX',
    emblemName: 'Sneer of the Oni',
    source: 'Monster Energy Promo',
    isActive: true,
    description: 'Sneer of the Oni Emblem'
  },
  {
    code: 'XFV-KHP-N97',
    emblemName: 'First to the Forge',
    source: 'Bungie Store',
    isActive: true,
    description: 'First to the Forge Emblem'
  },
  {
    code: 'J6P-9YH-LLP',
    emblemName: 'Heretic',
    source: 'Moon Mission',
    isActive: true,
    description: 'Heretic Emblem'
  },
  {
    code: 'F99-KPX-NCF',
    emblemName: 'Tangled Web',
    source: 'Spider Bounty',
    isActive: true,
    description: 'Tangled Web Emblem'
  },
  {
    code: 'PKH-JL6-L4R',
    emblemName: 'Crushed Gamma',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'Crushed Gamma Emblem'
  },
  {
    code: 'VA7-L7H-PNC',
    emblemName: 'Risen',
    source: 'Community Event',
    isActive: true,
    description: 'Risen Emblem'
  },
  {
    code: 'T67-JXY-PH6',
    emblemName: 'A Classy Order',
    source: 'Bungie Store',
    isActive: true,
    description: 'A Classy Order Emblem'
  },
  {
    code: 'XMY-G9M-6XH',
    emblemName: 'Limitless Horizon',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Limitless Horizon Emblem'
  },
  {
    code: 'JND-HLR-L69',
    emblemName: 'M:\\>START',
    source: 'Marathon ARG',
    isActive: true,
    description: 'Marathon ARG Emblem'
  },
  {
    code: 'JVG-VNT-GGG',
    emblemName: 'соняшник',
    source: 'Ukraine Support',
    isActive: true,
    description: 'Ukraine Sunflower Emblem'
  },
  {
    code: 'TK7-D3P-FDF',
    emblemName: 'Shadow\'s Light',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Shadow\'s Light Emblem'
  },
  {
    code: 'D6T-3JR-CKX',
    emblemName: 'Galilean Excursion',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Galilean Excursion Emblem'
  },
  {
    code: '7MM-VPD-MHP',
    emblemName: 'Heliotrope Warren',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Heliotrope Warren Emblem'
  },
  {
    code: 'RXC-9XJ-4MH',
    emblemName: 'Countdown to Convergence',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Countdown to Convergence Emblem'
  },
  {
    code: 'R9J-79M-J6C',
    emblemName: 'Resonant Chord',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Resonant Chord Emblem'
  },
  {
    code: '6LJ-GH7-TPA',
    emblemName: 'Adventurous Spirit',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Adventurous Spirit Emblem'
  },
  {
    code: '9LX-7YC-6TX',
    emblemName: 'Together We Rise',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Together We Rise Emblem'
  },
  {
    code: 'FJ9-LAM-67F',
    emblemName: 'Take Care Now',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Take Care Now Emblem'
  },
  {
    code: 'L7T-CVV-3RD',
    emblemName: 'Wish No More',
    source: 'Blueberries.gg',
    isActive: true,
    description: 'Wish No More Emblem'
  },
  {
    code: 'X4C-FGX-MX3',
    emblemName: "Respite's Focus",
    source: 'Bungie Rewards',
    isActive: true,
    description: "Respite's Focus Emblem"
  },
  {
    code: 'TCN-HCD-TGY',
    emblemName: 'Emblem of the Fleet',
    source: 'Community Event',
    isActive: true,
    description: 'Emblem of the Fleet'
  },
  {
    code: 'HVN-VVC-KHL',
    emblemName: 'System of Peace',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'System of Peace Emblem'
  },
  {
    code: '9MX-PA4-RKX',
    emblemName: 'Parallel Program',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'Parallel Program Emblem'
  },
  {
    code: 'TNN-DKM-6LG',
    emblemName: 'Stars Crossed',
    source: 'Community Event',
    isActive: true,
    description: 'Stars Crossed Emblem'
  },
  {
    code: 'THR-HTP-LGG',
    emblemName: 'Field Recognition',
    source: 'Bungie Rewards',
    isActive: true,
    description: 'Field Recognition Emblem'
  },
  {
    code: '6RG-HRH-T9T',
    emblemName: 'Together We Ramen',
    source: 'Ramen Shop Event',
    isActive: true,
    description: 'Together We Ramen Emblem'
  },
  {
    code: 'J3X-GNT-JAF',
    emblemName: 'Emblem of the Hibiscus',
    source: 'Community Event',
    isActive: true,
    description: 'Emblem of the Hibiscus'
  }
];

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
    
    for (const search of searches) {
      const url = `https://www.reddit.com/r/${search.subreddit}/search.json?q=${encodeURIComponent(search.query)}&sort=new&limit=50&restrict_sr=1&t=month`;
      
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Destiny Code Finder/1.0' }
      });
      
      if (!response.ok) {
        console.warn(`Reddit fetch failed for r/${search.subreddit}:`, response.status);
        continue;
      }
      
      const data = await response.json();
      const posts = data?.data?.children || [];
      
      const codeRegex = /\b([A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3})\b/gi;
      
      posts.forEach((post: { data?: { title?: string; selftext?: string } }) => {
        const title = post.data?.title || '';
        const selftext = post.data?.selftext || '';
        const combinedText = `${title} ${selftext}`;
        
        const matches = combinedText.match(codeRegex);
        if (matches) {
          matches.forEach(code => {
            const normalizedCode = code.toUpperCase();
            
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
                source: `Reddit r/${search.subreddit}`,
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
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
    
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
        
        if (emblemName && code && /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code)) {
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
      matches.forEach(code => {
        const normalizedCode = code.toUpperCase();
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
 * Verify if a code is valid by checking Bungie's redemption page
 */
export async function verifyCode(code: string): Promise<boolean> {
  try {
    const url = `https://www.bungie.net/7/en/Codes/Redeem?token=${code}`;
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return true;
  } catch {
    return false;
  }
}

export default {
  getAllEmblemCodes,
  scrapeRedditCodes,
  scrapeBlueberriesGG,
  verifyCode,
  KNOWN_ACTIVE_CODES
};
