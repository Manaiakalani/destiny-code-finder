import { useCallback, useState } from 'react';
import { RedemptionCode } from '@/types/code';
import {
  CATALOG_REVIEWED_AT,
  KNOWN_ACTIVE_CODES,
  EmblemCodeData,
  normalizeCode,
  verifyCodeFormat,
} from '@/services/codeScraperService';

const PINNED_CODES_KEY = 'destiny2-pinned-codes-v1';

interface StoredPin {
  code: string;
  addedAt: string;
}

export interface AddCodeResult {
  success: boolean;
  message: string;
}

// Convert scraped code data to our RedemptionCode format
function codeDataToRedemptionCode(codeData: EmblemCodeData, index: number): RedemptionCode {
  let status: RedemptionCode['status'] = codeData.isActive ? 'redeemable' : 'restricted';
  if (codeData.isD1) status = 'd1';

  return {
    id: `code-${index}`,
    code: codeData.code,
    status,
    source: codeData.source || 'Community',
    foundAt: new Date(CATALOG_REVIEWED_AT),
    description: codeData.description,
    note: codeData.note,
    emblemName: codeData.emblemName,
    emblemImage: codeData.iconUrl,
    isNew: false,
  };
}

// Initialize with known codes immediately (don't wait for API)
const INITIAL_CODES: RedemptionCode[] = KNOWN_ACTIVE_CODES.map((code, index) =>
  codeDataToRedemptionCode(code, index)
);

function readPins(): StoredPin[] {
  try {
    const stored = JSON.parse(localStorage.getItem(PINNED_CODES_KEY) || '[]') as StoredPin[];
    if (!Array.isArray(stored)) return [];
    return stored.filter(pin =>
      typeof pin?.code === 'string' &&
      typeof pin?.addedAt === 'string' &&
      verifyCodeFormat(pin.code)
    );
  } catch {
    return [];
  }
}

function writePins(pins: StoredPin[]): boolean {
  try {
    localStorage.setItem(PINNED_CODES_KEY, JSON.stringify(pins));
    return true;
  } catch {
    return false;
  }
}

function mergePins(catalog: RedemptionCode[], pins: StoredPin[]): RedemptionCode[] {
  const pinsByCode = new Map(pins.map(pin => [pin.code, pin]));
  const catalogCodes = new Set(catalog.map(item => item.code));
  const mergedCatalog = catalog.map(item =>
    pinsByCode.has(item.code) ? { ...item, isPinned: true } : item
  );
  const localPins = pins
    .filter(pin => !catalogCodes.has(pin.code))
    .map((pin, index): RedemptionCode => ({
      id: `pin-${index}-${pin.code}`,
      code: pin.code,
      status: 'pinned',
      source: 'Pinned locally',
      foundAt: new Date(pin.addedAt),
      description: 'Unverified code',
      isPinned: true,
      isNew: false,
    }));

  return [...localPins, ...mergedCatalog];
}

export function useCodeScanner() {
  const [codes, setCodes] = useState<RedemptionCode[]>(() =>
    mergePins(INITIAL_CODES, readPins())
  );

  const addManualCode = useCallback((code: string): AddCodeResult => {
    const normalizedCode = normalizeCode(code);
    if (!verifyCodeFormat(normalizedCode)) {
      return { success: false, message: 'Use Bungie format XXX-XXX-XXX with supported characters.' };
    }

    const pins = readPins();
    if (pins.some(pin => pin.code === normalizedCode)) {
      return { success: false, message: 'This code is already pinned.' };
    }

    const nextPins = [{ code: normalizedCode, addedAt: new Date().toISOString() }, ...pins];
    if (!writePins(nextPins)) {
      return { success: false, message: 'Local storage is unavailable, so the code could not be pinned.' };
    }

    setCodes(mergePins(INITIAL_CODES, nextPins));
    return { success: true, message: 'Code pinned on this device.' };
  }, []);

  const removePinnedCode = useCallback((code: string) => {
    const normalizedCode = normalizeCode(code);
    const nextPins = readPins().filter(pin => pin.code !== normalizedCode);
    if (!writePins(nextPins)) {
      return { success: false, message: 'Local storage is unavailable, so the pin could not be removed.' };
    }
    setCodes(mergePins(INITIAL_CODES, nextPins));
    return { success: true, message: 'Pin removed.' };
  }, []);

  return {
    codes,
    catalogReviewedAt: new Date(CATALOG_REVIEWED_AT),
    addManualCode,
    removePinnedCode,
  };
}
