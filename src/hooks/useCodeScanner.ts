import { useState, useCallback, useEffect } from 'react';
import { RedemptionCode, CodeStatus } from '@/types/code';

const STORAGE_KEY = 'destiny2-codes-cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// Known active/expired codes for demo (in real app, this would be fetched from an API)
const KNOWN_CODES: Record<string, { status: CodeStatus; description?: string }> = {
  'YRC-C3D-YNC': { status: 'active', description: 'The Visionary emblem' },
  '7D4-PKR-MD7': { status: 'active', description: 'Folding Space emblem' },
  'JYN-JAA-Y7D': { status: 'active', description: 'Ab Aeterno emblem' },
  'RA9-XPH-6KJ': { status: 'active', description: 'Tachyon Recall emblem' },
  'JNX-DMH-XLA': { status: 'active', description: 'The Reflector emblem' },
  '7CP-94V-LFP': { status: 'active', description: 'Shadow of Earth emblem' },
  'N3L-XN6-PXF': { status: 'active', description: 'Lone Focus emblem' },
  'X9F-GMA-H6D': { status: 'active', description: "Be True emblem" },
  'A7L-FYC-44X': { status: 'active', description: 'Sign of the Finite emblem' },
  'FJ9-LAM-67F': { status: 'expired', description: 'Expired promo code' },
  'XFV-KHP-N97': { status: 'expired', description: 'Expired seasonal code' },
  'PKH-JL6-L4R': { status: 'active', description: "Countdown to Convergence emblem" },
  'T67-JXY-PH6': { status: 'active', description: 'Future in Shadow emblem' },
  'ML3-FD4-ND9': { status: 'active', description: 'Cryonautics emblem' },
  'VA7-L7H-PNC': { status: 'active', description: 'Galilean Excursion emblem' },
  'XMX-RJH-FMX': { status: 'active', description: 'The Unimagined Plane emblem' },
};

// Demo codes to simulate finding
const DEMO_SOURCES: Record<string, RedemptionCode[]> = {
  '@DestinyTheGame': [
    { id: '1', code: 'YRC-C3D-YNC', status: 'active', source: '@DestinyTheGame', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 2), description: 'The Visionary emblem', isNew: true },
    { id: '2', code: '7D4-PKR-MD7', status: 'active', source: '@DestinyTheGame', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 24), description: 'Folding Space emblem' },
  ],
  '@Bungie': [
    { id: '3', code: 'JYN-JAA-Y7D', status: 'active', source: '@Bungie', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 48), description: 'Ab Aeterno emblem' },
    { id: '4', code: 'FJ9-LAM-67F', status: 'expired', source: '@Bungie', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 72), description: 'Expired promo code' },
  ],
  'default': [
    { id: '5', code: 'RA9-XPH-6KJ', status: 'active', source: 'Community', foundAt: new Date(Date.now() - 1000 * 60 * 30), description: 'Tachyon Recall emblem', isNew: true },
    { id: '6', code: 'JNX-DMH-XLA', status: 'active', source: 'Community', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 5), description: 'The Reflector emblem' },
    { id: '7', code: '7CP-94V-LFP', status: 'active', source: 'Community', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 12), description: 'Shadow of Earth emblem' },
    { id: '8', code: 'N3L-XN6-PXF', status: 'active', source: 'Community', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 18), description: 'Lone Focus emblem' },
    { id: '9', code: 'X9F-GMA-H6D', status: 'active', source: 'Reddit', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 36), description: "Be True emblem" },
    { id: '10', code: 'XFV-KHP-N97', status: 'expired', source: 'Reddit', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 96), description: 'Expired seasonal code' },
  ],
};

interface CacheData {
  codes: RedemptionCode[];
  timestamp: number;
}

function loadFromCache(): RedemptionCode[] {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const data: CacheData = JSON.parse(cached);
      if (Date.now() - data.timestamp < CACHE_DURATION) {
        return data.codes.map(c => ({ ...c, foundAt: new Date(c.foundAt) }));
      }
    }
  } catch (e) {
    console.error('Failed to load cache:', e);
  }
  return [];
}

function saveToCache(codes: RedemptionCode[]) {
  try {
    const data: CacheData = { codes, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save cache:', e);
  }
}

function extractCodeFromText(text: string): string | null {
  // Destiny 2 codes are typically in XXX-XXX-XXX format
  const codePattern = /[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}/gi;
  const match = text.match(codePattern);
  return match ? match[0].toUpperCase() : null;
}

function parseInput(input: string): string[] {
  // Split by newlines, commas, or spaces
  return input
    .split(/[\n,\s]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

export function useCodeScanner() {
  const [codes, setCodes] = useState<RedemptionCode[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  // Load from cache on mount
  useEffect(() => {
    const cached = loadFromCache();
    if (cached.length > 0) {
      setCodes(cached);
      setLastScanTime(new Date(cached[0].foundAt));
    }
  }, []);

  const scan = useCallback(async (input: string) => {
    setIsScanning(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const sources = parseInput(input);
    const newCodes: RedemptionCode[] = [];
    const seenCodes = new Set(codes.map(c => c.code));
    
    for (const source of sources) {
      // Check if it's a known demo source
      let sourceCodes: RedemptionCode[] = [];
      
      if (source.includes('@DestinyTheGame') || source.toLowerCase().includes('destinythegame')) {
        sourceCodes = DEMO_SOURCES['@DestinyTheGame'] || [];
      } else if (source.includes('@Bungie') || source.toLowerCase().includes('bungie')) {
        sourceCodes = DEMO_SOURCES['@Bungie'] || [];
      } else {
        // For any other input, return some community codes
        sourceCodes = DEMO_SOURCES['default'] || [];
      }
      
      // Check for manual code input (XXX-XXX-XXX format)
      const manualCode = extractCodeFromText(source);
      if (manualCode) {
        const knownInfo = KNOWN_CODES[manualCode];
        sourceCodes = [{
          id: `manual-${Date.now()}-${Math.random()}`,
          code: manualCode,
          status: knownInfo?.status || 'unknown',
          source: 'Manual Entry',
          foundAt: new Date(),
          description: knownInfo?.description,
          isNew: true,
        }];
      }
      
      // Add unique codes
      for (const code of sourceCodes) {
        if (!seenCodes.has(code.code)) {
          seenCodes.add(code.code);
          newCodes.push({
            ...code,
            id: `${code.id}-${Date.now()}`,
            isNew: true,
          });
        }
      }
    }
    
    const updatedCodes = [...newCodes, ...codes.map(c => ({ ...c, isNew: false }))];
    setCodes(updatedCodes);
    saveToCache(updatedCodes);
    setLastScanTime(new Date());
    setIsScanning(false);
    
    return newCodes.length;
  }, [codes]);

  const clearCodes = useCallback(() => {
    setCodes([]);
    localStorage.removeItem(STORAGE_KEY);
    setLastScanTime(null);
  }, []);

  return {
    codes,
    isScanning,
    lastScanTime,
    scan,
    clearCodes,
  };
}
