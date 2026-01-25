// Emblem Database Service
// Supports lookup by code OR by name
// Server-side data loading with in-memory caching

const BUNGIE_CDN_BASE = 'https://www.bungie.net';
const BASE_URL = import.meta.env.BASE_URL || '/';
const EMBLEM_DB_URL = `${BASE_URL}data/emblems.json`;

export interface EmblemData {
  hash?: number;
  icon: string;
  localIcon?: string;
  note?: string;
}

export interface LegacyEmblemData {
  icon: string;
  note?: string;
}

export interface EmblemDatabase {
  version: string;
  lastUpdated: string;
  localCache?: boolean;
  codeToEmblem: Record<string, string>;  // code -> emblem name
  legacyEmblems?: Record<string, LegacyEmblemData>;  // legacy emblem name -> data
  emblems: Record<string, EmblemData>;    // emblem name -> data
}

// In-memory cache
let codeToEmblemMap: Record<string, string> | null = null;
let emblemCache: Record<string, EmblemData> | null = null;
let legacyEmblemCache: Record<string, LegacyEmblemData> | null = null;
let useLocalImages: boolean = false;
let isLoading: boolean = false;
let loadPromise: Promise<void> | null = null;

/**
 * Initialize/load the emblem database from the server
 */
export async function initEmblemDatabase(): Promise<void> {
  if (emblemCache && codeToEmblemMap) return;
  
  if (loadPromise) {
    await loadPromise;
    return;
  }
  
  isLoading = true;
  loadPromise = fetchDatabase();
  await loadPromise;
  isLoading = false;
}

/**
 * Fetch the emblem database from the server
 */
async function fetchDatabase(): Promise<void> {
  try {
    const response = await fetch(EMBLEM_DB_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch emblem database: ${response.status}`);
    }
    
    const data: EmblemDatabase = await response.json();
    codeToEmblemMap = data.codeToEmblem || {};
    emblemCache = data.emblems || {};
    legacyEmblemCache = data.legacyEmblems || {};
    useLocalImages = data.localCache || false;
    
    console.log(`[EmblemDB] Loaded ${Object.keys(data.emblems).length} emblems, ${Object.keys(data.codeToEmblem).length} code mappings, ${Object.keys(data.legacyEmblems || {}).length} legacy emblems (v${data.version})`);
  } catch (error) {
    console.error('[EmblemDB] Failed to fetch database:', error);
    codeToEmblemMap = {};
    emblemCache = {};
    legacyEmblemCache = {};
  }
}

/**
 * Get emblem name from code
 */
export function getEmblemNameByCode(code: string): string | null {
  if (!code || !codeToEmblemMap) return null;
  return codeToEmblemMap[code.toUpperCase()] || null;
}

/**
 * Get emblem icon URL by code (primary lookup method)
 */
export function getEmblemIconByCode(code: string): string | null {
  if (!code || !codeToEmblemMap || !emblemCache) return null;
  
  const normalizedCode = code.toUpperCase();
  const emblemName = codeToEmblemMap[normalizedCode];
  
  if (!emblemName) return null;
  
  return getEmblemIconByName(emblemName);
}

/**
 * Get emblem icon URL by name (fallback lookup method)
 */
export function getEmblemIconByName(emblemName: string): string | null {
  if (!emblemName) return null;
  
  // First check regular emblems
  if (emblemCache) {
    const emblem = emblemCache[emblemName];
    if (emblem) {
      // Prefer local cached image if available
      if (useLocalImages && emblem.localIcon) {
        // Prepend base URL for local images
        return `${BASE_URL}${emblem.localIcon.replace(/^\//, '')}`;
      }
      
      // Fall back to Bungie CDN
      if (emblem.icon && !emblem.icon.includes('placeholder')) {
        return `${BUNGIE_CDN_BASE}${emblem.icon}`;
      }
    }
  }
  
  // Check legacy emblems
  if (legacyEmblemCache) {
    const legacyEmblem = legacyEmblemCache[emblemName];
    if (legacyEmblem && legacyEmblem.icon) {
      // Legacy emblems have full URLs
      if (legacyEmblem.icon.startsWith('http')) {
        return legacyEmblem.icon;
      }
      return `${BUNGIE_CDN_BASE}${legacyEmblem.icon}`;
    }
  }
  
  return null;
}

/**
 * Get emblem icon - tries code first, then name
 */
export function getEmblemIcon(codeOrName: string, emblemName?: string): string | null {
  // First try by code
  let icon = getEmblemIconByCode(codeOrName);
  if (icon) return icon;
  
  // Then try by provided emblem name
  if (emblemName) {
    icon = getEmblemIconByName(emblemName);
    if (icon) return icon;
  }
  
  // Finally try the first param as a name
  return getEmblemIconByName(codeOrName);
}

/**
 * Get full emblem data by name
 */
export function getEmblemData(emblemName: string): EmblemData | null {
  if (!emblemName || !emblemCache) return null;
  return emblemCache[emblemName] || null;
}

/**
 * Get all code-to-emblem mappings
 */
export function getCodeMappings(): Record<string, string> {
  return codeToEmblemMap || {};
}

/**
 * Check if an emblem exists in the database (by name)
 */
export function hasEmblem(emblemName: string): boolean {
  return emblemCache ? emblemName in emblemCache : false;
}

/**
 * Check if a code has a known emblem mapping
 */
export function hasCodeMapping(code: string): boolean {
  return codeToEmblemMap ? code.toUpperCase() in codeToEmblemMap : false;
}

/**
 * Check if the database is loaded
 */
export function isDatabaseReady(): boolean {
  return emblemCache !== null && codeToEmblemMap !== null;
}

/**
 * Check if the database is currently loading
 */
export function isDatabaseLoading(): boolean {
  return isLoading;
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  initEmblemDatabase();
}
