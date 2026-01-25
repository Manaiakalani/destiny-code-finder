// Full Emblem Scraper Script
// Fetches ALL emblems from Bungie manifest and builds a comprehensive database

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get API key from environment variable
// Register for a free key at: https://www.bungie.net/en/Application
const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY;

if (!BUNGIE_API_KEY) {
  console.error('❌ BUNGIE_API_KEY environment variable is required');
  console.error('   Get a free key at: https://www.bungie.net/en/Application');
  console.error('   Then run: BUNGIE_API_KEY=your_key node scripts/scrape-emblems.js');
  process.exit(1);
}

const MANIFEST_URL = 'https://www.bungie.net/common/destiny2_content/json/en/DestinyInventoryItemDefinition-6a2a46ee-e5f9-4c5b-ad6b-bf29948434d6.json';

// Known code-to-emblem mappings (verified from multiple sources)
const CODE_TO_EMBLEM = {
  // Bungie Rewards & Official
  'YRC-C3D-YNC': 'The Visionary',
  '7D4-PKR-MD7': 'Folding Space',
  'JYN-JAA-Y7D': 'Ab Aeterno',
  'RA9-XPH-6KJ': 'Be True',
  'JNX-DMH-XLA': 'The Reflector',
  '7LV-GTK-T7J': 'Future in Shadow',
  'A7L-FYC-44X': 'Sign of the Finite',
  'ML3-FD4-ND9': 'Lone Focus, Jagged Edge',
  'N3L-XN6-PXF': 'Cryonautics',
  'X9F-GMA-H6D': 'Sequence Flourish',
  'PHV-6LF-9CP': 'Liminal Nadir',
  '3VF-LGC-RLX': 'Sneer of the Oni',
  'XFV-KHP-N97': 'First to the Forge',
  'J6P-9YH-LLP': 'Heretic',
  'F99-KPX-NCF': 'Tangled Web',
  'PKH-JL6-L4R': 'Crushed Gamma',
  'VA7-L7H-PNC': 'Risen',
  'T67-JXY-PH6': 'A Classy Order',
  
  // Lightfall & Beyond
  'XMY-G9M-6XH': 'Limitless Horizon',
  'JND-HLR-L69': 'M:\\>START',
  
  // Ukraine Support
  'JVG-VNT-GGG': 'соняшник',
  
  // Community & Events
  'D6T-3JR-CKX': 'Galilean Excursion',
  '7MM-VPD-MHP': 'Heliotrope Warren',
  'RXC-9XJ-4MH': 'Countdown to Convergence',
  'R9J-79M-J6C': 'Resonant Chord',
  '6LJ-GH7-TPA': 'Adventurous Spirit',
  '9LX-7YC-6TX': 'Together We Rise',  // Fixed: no comma
  'FJ9-LAM-67F': 'Take Care Now',
  'L7T-CVV-3RD': 'Wish No More',
  
  // Additional codes from various sources
  'TK7-D3P-FDF': "Shadow's Light",
  'X4C-FGX-MX3': "Respite's Focus",  // Corrected: was Binding Focus
  'TCN-HCD-TGY': 'Emblem of the Fleet',
  'HVN-VVC-KHL': 'System of Peace',
  '9MX-PA4-RKX': 'Parallel Program',
  
  // More verified codes  
  'TNN-DKM-6LG': 'Stars Crossed',  // Corrected: was Starcrossed
  'THR-HTP-LGG': 'Field Recognition',  // Corrected: was Field Calibration
  '6RG-HRH-T9T': 'Together We Ramen',  // Corrected: was Spicy Ramen
  'J3X-GNT-JAF': 'Emblem of the Hibiscus',  // Corrected: added "the"
};

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'X-API-Key': BUNGIE_API_KEY,
        'User-Agent': 'Destiny Code Finder/1.0'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🔍 Fetching Bungie manifest...');
  
  const manifest = await fetchJSON(MANIFEST_URL);
  
  const emblems = {};
  let count = 0;
  
  // Process all items, find emblems
  for (const [hash, item] of Object.entries(manifest)) {
    if (item.itemTypeDisplayName === 'Emblem' && item.displayProperties?.icon) {
      const name = item.displayProperties.name;
      const icon = item.displayProperties.icon;
      
      if (name && icon) {
        emblems[name] = {
          hash: parseInt(hash),
          icon: icon,
        };
        count++;
      }
    }
  }
  
  console.log(`✅ Found ${count} emblems in manifest`);
  
  // Build the database with code mappings
  const database = {
    version: '2.1.0',
    lastUpdated: new Date().toISOString(),
    localCache: true,
    codeToEmblem: CODE_TO_EMBLEM,
    emblems: emblems
  };
  
  // Write to public/data/emblems.json
  const outputPath = path.join(__dirname, '..', 'public', 'data', 'emblems.json');
  fs.writeFileSync(outputPath, JSON.stringify(database, null, 2));
  
  console.log(`📁 Saved database to ${outputPath}`);
  console.log(`📊 Total emblems: ${Object.keys(emblems).length}`);
  console.log(`🔗 Total code mappings: ${Object.keys(CODE_TO_EMBLEM).length}`);
  
  // List emblems that have code mappings
  console.log('\n✨ Emblems with known codes:');
  for (const [code, emblemName] of Object.entries(CODE_TO_EMBLEM)) {
    const emblem = emblems[emblemName];
    if (emblem) {
      console.log(`  ${code} → ${emblemName} ✓`);
    } else {
      console.log(`  ${code} → ${emblemName} ⚠️ (not found in manifest)`);
    }
  }
}

main().catch(console.error);
