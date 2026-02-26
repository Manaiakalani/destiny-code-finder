#!/usr/bin/env node
// Fix emblem code mappings based on community feedback from Reddit and authoritative sources
// (destinyemblemcollector.com, rewards.mijago.net, blueberries.gg)

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const emblemsPath = join(__dirname, '..', 'public', 'data', 'emblems.json');

const db = JSON.parse(readFileSync(emblemsPath, 'utf-8'));

// ============================================================
// CORRECT universal code → emblem name mappings
// Sources: destinyemblemcollector.com/availability/universalcode
//          rewards.mijago.net
//          blueberries.gg/items/destiny-2-free-emblems/
// ============================================================
const correctCodeToEmblem = {
  // Emblems (41 universal codes)
  "YRC-C3D-YNC": "A Classy Order",
  "9FY-KDD-PRT": "Adventurous Spirit",
  "HN3-7K9-93G": "Airlock Invitation",
  "PTD-GKG-CVN": "Archived",
  "ML3-FD4-ND9": "Be True",
  "A67-C7X-3GN": "Bulbul Tarang",
  "VHT-6A7-3MM": "Conqueror of Infinity",
  "PHV-6LF-9CP": "Countdown to Convergence",
  "D97-YCX-7JK": "Crushed Gamma",
  "RA9-XPH-6KJ": "Cryonautics",
  "JXJ-HVA-RCX": "Ever Forward",
  "3J9-AMM-7MG": "Folding Space",
  "7LV-GTK-T7J": "Future in Shadow",
  "JYN-JAA-Y7D": "Galilean Excursion",
  "3CV-D6K-RD4": "Gone Home",
  "VXN-V3T-MRP": "Harmonic Commencement",
  "L7T-CVV-3RD": "Heliotrope Warren",
  "XVK-RLA-RAM": "In Urbe Inventa",
  "J6P-9YH-LLP": "In Vino Mendacium",
  "TNN-DKM-6LG": "Jade's Burrow",
  "VA7-L7H-PNC": "Liminal Nadir",
  "XMY-G9M-6XH": "Limitless Horizon",
  "JND-HLR-L69": "M:\\>START",
  "FMM-44A-RKP": "Myopia",
  "YAA-37T-FCN": "Neon Mirage",
  "L3P-XXR-GJ4": "Out the Airlock",
  "THR-33A-YKC": "Risen",
  "9LX-7YC-6TX": "Schr\u00F6dinger's Gun",
  "JGN-PX4-DFN": "Secret Signal",
  "7D4-PKR-MD7": "Sequence Flourish",
  "XVX-DKJ-CVM": "Seraphim's Gauntlets",
  "F99-KPX-NCF": "Shadow's Light",
  "6LJ-GH7-TPA": "Sneer of the Oni",
  "T67-JXY-PH6": "Stag's Spirit",
  "PKH-JL6-L4R": "Tangled Web",
  "XFV-KHP-N97": "The Visionary",
  "6AJ-XFR-9ND": "Tigris Fati",
  "993-H3H-M6K": "Visio Spei",
  "HG7-YRG-HHF": "Year of the Snake",
  "JVG-VNT-GGG": "\u0441\u043E\u043D\u044F\u0448\u043D\u0438\u043A",
  // Non-emblem universal code rewards
  "R9J-79M-J6C": "End of the Rainbow",
  "TK7-D3P-FDF": "Rainbow Connection",
  // D1 shader codes (for image lookup)
  "D6T-3JR-CKX": "Prismatic Expanse",
  "7MM-VPD-MHP": "Double Banshee",
  "RXC-9XJ-4MH": "Oracle 99",
  // Expired/non-universal (for image lookup)
  "HVN-VVC-KHL": "System of Peace",
  "9MX-PA4-RKX": "Parallel Program",
  "THR-HTP-LGG": "Field Recognition",
  "6RG-HRH-T9T": "Together We Ramen",
  "J3X-GNT-JAF": "Emblem of the Hibiscus",
  "FJ9-LAM-67F": "Take Care Now",
  "TCN-HCD-TGY": "Emblem of the Fleet",
};

// Replace the entire codeToEmblem mapping
db.codeToEmblem = correctCodeToEmblem;

// Add missing emblem entries for non-emblem rewards
if (!db.emblems["End of the Rainbow"]) {
  db.emblems["End of the Rainbow"] = {
    icon: "/common/destiny2_content/icons/c2b4f8ff4133e88f3c0fc6012c361aa0.jpg",
    note: "Transmat Effect - Universal Code (Pride)"
  };
}

if (!db.emblems["Rainbow Connection"]) {
  db.emblems["Rainbow Connection"] = {
    icon: "/common/destiny2_content/icons/3dae5db36b3c8c7ae8e64e5e2c92e5f7.jpg",
    note: "Emote - Universal Code (Pride)"
  };
}

// Update metadata
db.version = "2.2.0";
db.lastUpdated = new Date().toISOString();

writeFileSync(emblemsPath, JSON.stringify(db), 'utf-8');

console.log(`Updated emblems.json:`);
console.log(`  - ${Object.keys(correctCodeToEmblem).length} code mappings (was ${Object.keys(db.codeToEmblem).length})`);
console.log(`  - Version: ${db.version}`);
console.log(`  - Last updated: ${db.lastUpdated}`);

// Verify all codes map to existing emblems
let missing = 0;
for (const [code, name] of Object.entries(correctCodeToEmblem)) {
  if (!db.emblems[name]) {
    console.error(`  WARNING: No emblem entry for "${name}" (code: ${code})`);
    missing++;
  }
}
if (missing === 0) {
  console.log(`  - All code mappings have matching emblem entries ✓`);
}
