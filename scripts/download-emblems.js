/**
 * Emblem Image Downloader
 * 
 * This script downloads emblem images from Bungie's CDN and caches them locally.
 * Run with: npm run cache:emblems
 * 
 * Benefits:
 * - Faster loading (served from your own CDN/server)
 * - No dependency on Bungie's CDN availability
 * - Reduced bandwidth for users
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUNGIE_CDN = 'https://www.bungie.net';
const OUTPUT_DIR = path.join(__dirname, '../public/emblems');
const EMBLEMS_JSON = path.join(__dirname, '../public/data/emblems.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Load emblem database
const emblemDb = JSON.parse(fs.readFileSync(EMBLEMS_JSON, 'utf8'));

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(OUTPUT_DIR, filename);
    
    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      console.log(`✓ Already cached: ${filename}`);
      resolve(filepath);
      return;
    }
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve(filepath);
        });
      } else {
        fs.unlink(filepath, () => {});
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAllEmblems() {
  console.log('🚀 Starting emblem download...\n');
  
  const emblems = Object.entries(emblemDb.emblems);
  let success = 0;
  let failed = 0;
  
  for (const [name, data] of emblems) {
    const url = `${BUNGIE_CDN}${data.icon}`;
    const filename = data.icon.split('/').pop();
    
    try {
      await downloadImage(url, filename);
      success++;
    } catch (error) {
      console.error(`✗ Failed: ${name} - ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n✅ Complete! Downloaded ${success}/${emblems.length} emblems`);
  if (failed > 0) {
    console.log(`⚠️  ${failed} emblems failed to download`);
  }
  
  // Update emblems.json with local paths
  const updatedDb = {
    ...emblemDb,
    localCache: true,
    emblems: Object.fromEntries(
      Object.entries(emblemDb.emblems).map(([name, data]) => [
        name,
        {
          ...data,
          localIcon: `/emblems/${data.icon.split('/').pop()}`
        }
      ])
    )
  };
  
  fs.writeFileSync(EMBLEMS_JSON, JSON.stringify(updatedDb, null, 2));
  console.log('\n📝 Updated emblems.json with local paths');
}

downloadAllEmblems().catch(console.error);
