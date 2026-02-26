#!/usr/bin/env node
// Patch codeScraperService.ts with correct emblem codes
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/services/codeScraperService.ts';
let content = readFileSync(filePath, 'utf-8');

// Normalize line endings for matching
content = content.replace(/\r\n/g, '\n');

// 1. Update the interface to add note? and isD1?
const oldInterface = `export interface EmblemCodeData {
  code: string;
  emblemName: string;
  source?: string;
  isActive: boolean;
  iconUrl?: string;
  description?: string;
}`;

const newInterface = `export interface EmblemCodeData {
  code: string;
  emblemName: string;
  source?: string;
  isActive: boolean;
  iconUrl?: string;
  description?: string;
  note?: string;
  isD1?: boolean;
}`;

content = content.replace(oldInterface, newInterface);

// 2. Replace the entire KNOWN_ACTIVE_CODES array
const arrayStart = content.indexOf('/**\n * Known active emblem codes');
const arrayEnd = content.indexOf('];\n\n/**\n * Scrape Reddit');
if (arrayStart === -1 || arrayEnd === -1) {
  console.error('Could not find KNOWN_ACTIVE_CODES boundaries');
  process.exit(1);
}

const newArray = `/**
 * Known emblem codes - verified against destinyemblemcollector.com, rewards.mijago.net, and blueberries.gg
 * Last updated: June 2025
 */
export const KNOWN_ACTIVE_CODES: EmblemCodeData[] = [
  // ═══════════════════════════════════════════
  // D2 UNIVERSAL EMBLEM CODES (40 verified)
  // ═══════════════════════════════════════════
  { code: 'YRC-C3D-YNC', emblemName: 'A Classy Order', source: 'TWAB Reward', isActive: true, description: 'A Classy Order' },
  { code: '9FY-KDD-PRT', emblemName: 'Adventurous Spirit', source: 'Community', isActive: true, description: 'Adventurous Spirit' },
  { code: 'HN3-7K9-93G', emblemName: 'Airlock Invitation', source: 'Fall Guys Promo', isActive: true, description: 'Airlock Invitation' },
  { code: 'PTD-GKG-CVN', emblemName: 'Archived', source: 'TFS Collector\\'s Edition', isActive: true, description: 'Archived' },
  { code: 'ML3-FD4-ND9', emblemName: 'Be True', source: 'Trans Awareness', isActive: true, description: 'Be True' },
  { code: 'A67-C7X-3GN', emblemName: 'Bulbul Tarang', source: 'Promotional', isActive: true, description: 'Bulbul Tarang' },
  { code: 'VHT-6A7-3MM', emblemName: 'Conqueror of Infinity', source: 'Promotional', isActive: true, description: 'Conqueror of Infinity' },
  { code: 'PHV-6LF-9CP', emblemName: 'Countdown to Convergence', source: 'TWQ Collector\\'s Edition', isActive: true, description: 'Countdown to Convergence' },
  { code: 'D97-YCX-7JK', emblemName: 'Crushed Gamma', source: 'r/Destiny Celebration', isActive: true, description: 'Crushed Gamma' },
  { code: 'RA9-XPH-6KJ', emblemName: 'Cryonautics', source: 'BL Collector\\'s Edition', isActive: true, description: 'Cryonautics' },
  { code: 'JXJ-HVA-RCX', emblemName: 'Ever Forward', source: 'Promotional', isActive: true, description: 'Ever Forward' },
  { code: '3J9-AMM-7MG', emblemName: 'Folding Space', source: 'TFS Collector\\'s Edition', isActive: true, description: 'Folding Space' },
  { code: '7LV-GTK-T7J', emblemName: 'Future in Shadow', source: 'BL Collector\\'s Edition', isActive: true, description: 'Future in Shadow' },
  { code: 'JYN-JAA-Y7D', emblemName: 'Galilean Excursion', source: 'BL Collector\\'s Edition', isActive: true, description: 'Galilean Excursion' },
  { code: '3CV-D6K-RD4', emblemName: 'Gone Home', source: 'TFS Collector\\'s Edition', isActive: true, description: 'Gone Home' },
  { code: 'VXN-V3T-MRP', emblemName: 'Harmonic Commencement', source: 'Promotional', isActive: true, description: 'Harmonic Commencement' },
  { code: 'L7T-CVV-3RD', emblemName: 'Heliotrope Warren', source: '30th Anniversary', isActive: true, description: 'Heliotrope Warren' },
  { code: 'XVK-RLA-RAM', emblemName: 'In Urbe Inventa', source: 'Promotional', isActive: true, description: 'In Urbe Inventa' },
  { code: 'J6P-9YH-LLP', emblemName: 'In Vino Mendacium', source: 'Promotional', isActive: true, description: 'In Vino Mendacium' },
  { code: 'TNN-DKM-6LG', emblemName: 'Jade\\'s Burrow', source: 'Lunar New Year 2023', isActive: true, description: 'Jade\\'s Burrow' },
  { code: 'VA7-L7H-PNC', emblemName: 'Liminal Nadir', source: 'TWQ Collector\\'s Edition', isActive: true, description: 'Liminal Nadir' },
  { code: 'XMY-G9M-6XH', emblemName: 'Limitless Horizon', source: 'Lightfall Collector\\'s Edition', isActive: true, description: 'Limitless Horizon' },
  { code: 'JND-HLR-L69', emblemName: 'M:\\\\>START', source: 'Marathon ARG', isActive: true, description: 'M:\\\\>START' },
  { code: 'FMM-44A-RKP', emblemName: 'Myopia', source: 'TFS Collector\\'s Edition', isActive: true, description: 'Myopia' },
  { code: 'YAA-37T-FCN', emblemName: 'Neon Mirage', source: 'Promotional', isActive: true, description: 'Neon Mirage' },
  { code: 'L3P-XXR-GJ4', emblemName: 'Out the Airlock', source: 'EA/BioWare Partnership', isActive: true, description: 'Out the Airlock' },
  { code: 'THR-33A-YKC', emblemName: 'Risen', source: 'BiliBili Partnership', isActive: true, description: 'Risen' },
  { code: '9LX-7YC-6TX', emblemName: 'Schrödinger\\'s Gun', source: 'Telesto Event', isActive: true, description: 'Schrödinger\\'s Gun' },
  { code: 'JGN-PX4-DFN', emblemName: 'Secret Signal', source: 'Aion Archives ARG', isActive: true, description: 'Secret Signal' },
  { code: '7D4-PKR-MD7', emblemName: 'Sequence Flourish', source: 'Splicer Puzzle', isActive: true, description: 'Sequence Flourish' },
  { code: 'XVX-DKJ-CVM', emblemName: 'Seraphim\\'s Gauntlets', source: 'Community Memorial', isActive: true, description: 'Seraphim\\'s Gauntlets' },
  { code: 'F99-KPX-NCF', emblemName: 'Shadow\\'s Light', source: 'TWQ Collector\\'s Edition', isActive: true, description: 'Shadow\\'s Light' },
  { code: '6LJ-GH7-TPA', emblemName: 'Sneer of the Oni', source: 'TWQ Collector\\'s Edition', isActive: true, description: 'Sneer of the Oni' },
  { code: 'T67-JXY-PH6', emblemName: 'Stag\\'s Spirit', source: 'Nightmare Containment', isActive: true, description: 'Stag\\'s Spirit' },
  { code: 'PKH-JL6-L4R', emblemName: 'Tangled Web', source: 'TWAB 2022-02-10', isActive: true, description: 'Tangled Web' },
  { code: 'XFV-KHP-N97', emblemName: 'The Visionary', source: 'Curse of Osiris', isActive: true, description: 'The Visionary' },
  { code: '6AJ-XFR-9ND', emblemName: 'Tigris Fati', source: 'TFS Dev Stream Twitch Drop', isActive: true, description: 'Tigris Fati' },
  { code: '993-H3H-M6K', emblemName: 'Visio Spei', source: 'Promotional', isActive: true, description: 'Visio Spei' },
  { code: 'HG7-YRG-HHF', emblemName: 'Year of the Snake', source: 'BiliBili Promo', isActive: true, description: 'Year of the Snake' },
  { code: 'JVG-VNT-GGG', emblemName: 'соняшник', source: 'Ukraine Support', isActive: true, description: 'соняшник (Sunflower)' },

  // ═══════════════════════════════════════════
  // D2 NON-EMBLEM REWARD CODES (2 verified)
  // ═══════════════════════════════════════════
  { code: 'R9J-79M-J6C', emblemName: 'End of the Rainbow', source: 'Pride Celebration', isActive: true, description: 'Transmat Effect' },
  { code: 'TK7-D3P-FDF', emblemName: 'Rainbow Connection', source: 'Pride Celebration', isActive: true, description: 'Emote' },

  // ═══════════════════════════════════════════
  // DESTINY 1 SHADER CODES (3 verified)
  // ═══════════════════════════════════════════
  { code: 'D6T-3JR-CKX', emblemName: 'Prismatic Expanse', source: 'D1 Shader Code', isActive: true, isD1: true, description: 'Destiny 1 Shader' },
  { code: '7MM-VPD-MHP', emblemName: 'Double Banshee', source: 'D1 Shader Code', isActive: true, isD1: true, description: 'Destiny 1 Shader' },
  { code: 'RXC-9XJ-4MH', emblemName: 'Oracle 99', source: 'D1 Shader Code', isActive: true, isD1: true, description: 'Destiny 1 Shader' },

  // ═══════════════════════════════════════════
  // EXPIRED / NON-UNIVERSAL CODES (dependency noted)
  // ═══════════════════════════════════════════
  { code: 'HVN-VVC-KHL', emblemName: 'System of Peace', source: 'Game2Give Charity', isActive: false, note: 'Game2Give charity donation; individual codes only', description: 'System of Peace' },
  { code: '9MX-PA4-RKX', emblemName: 'Parallel Program', source: 'Bungie API', isActive: false, note: 'Bungie API developer emblem; granted manually', description: 'Parallel Program' },
  { code: 'THR-HTP-LGG', emblemName: 'Field Recognition', source: 'Steelseries Promo', isActive: false, note: 'Steelseries promotion; individual codes only', description: 'Field Recognition' },
  { code: '6RG-HRH-T9T', emblemName: 'Together We Ramen', source: 'D2 Creator Hub', isActive: false, note: 'Creator Hub emblem; creator program only', description: 'Together We Ramen' },
  { code: 'J3X-GNT-JAF', emblemName: 'Emblem of the Hibiscus', source: 'Netcafe Vendor', isActive: false, note: 'Netcafe vendor emblem; no universal code', description: 'Emblem of the Hibiscus' },
  { code: 'FJ9-LAM-67F', emblemName: 'Take Care Now', source: 'Game2Give Charity', isActive: false, note: 'Game2Give charity donation; individual codes only', description: 'Take Care Now' },
  { code: 'TCN-HCD-TGY', emblemName: 'Emblem of the Fleet', source: 'Unknown', isActive: false, note: 'No known universal code', description: 'Emblem of the Fleet' },
]`;

content = content.substring(0, arrayStart) + newArray + content.substring(arrayEnd + 2); // +2 to include '];'

writeFileSync(filePath, content, 'utf-8');
console.log('✅ codeScraperService.ts patched successfully');

// Verify
const result = readFileSync(filePath, 'utf-8');
const codeCount = (result.match(/code: '/g) || []).length;
console.log(`   ${codeCount} code entries in KNOWN_ACTIVE_CODES`);
console.log('   Interface updated with note? and isD1? fields');
