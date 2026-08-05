import { useState, useCallback, useEffect, useRef } from 'react';
import { RedemptionCode } from '@/types/code';
import { getAllEmblemCodes, KNOWN_ACTIVE_CODES, EmblemCodeData, normalizeCodeInput, verifyCodeFormat } from '@/services/codeScraperService';

const STORAGE_KEY = 'destiny2-codes-cache-v2';
const LEGACY_STORAGE_KEY = 'destiny2-codes-cache';
// User-submitted codes live outside the catalogue cache: they are the only
// data here the user cannot get back, so they must survive cache expiry,
// schema bumps and invalid-cache purges.
const MANUAL_STORAGE_KEY = 'destiny2-manual-codes';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
const CACHE_SCHEMA_VERSION = 2;
const MANUAL_ID_PREFIX = 'manual-';

function isManualCode(code: RedemptionCode): boolean {
  return code.id.startsWith(MANUAL_ID_PREFIX);
}

interface CachedData {
  schemaVersion: number;
  codes: RedemptionCode[];
  timestamp: number;
}

function getStorage(): Storage | null {
  // Accessing window.localStorage throws SecurityError outright when the
  // browser blocks storage for the site, so the access itself must be guarded.
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

// Convert scraped code data to our RedemptionCode format
function codeDataToRedemptionCode(codeData: EmblemCodeData, index: number): RedemptionCode {
  const now = Date.now();

  let status: RedemptionCode['status'] = codeData.isActive ? 'active' : 'expired';
  if (codeData.isD1) status = 'd1';

  return {
    id: `code-${index}`,
    code: normalizeCodeInput(codeData.code),
    status,
    source: codeData.source || 'Community',
    foundAt: new Date(now),
    description: codeData.description || codeData.emblemName,
    note: codeData.note,
    emblemName: codeData.emblemName,
    emblemImage: codeData.iconUrl,
    isNew: true,
  };
}

function normalizeCachedCode(code: Partial<RedemptionCode> | null | undefined, index: number): RedemptionCode | null {
  const normalizedCode = typeof code?.code === 'string' ? normalizeCodeInput(code.code) : '';
  if (!normalizedCode) {
    return null;
  }

  const status = code?.status === 'active' || code?.status === 'expired' || code?.status === 'd1' || code?.status === 'unknown'
    ? code.status
    : 'unknown';

  let foundAt = new Date(code?.foundAt ?? Date.now());
  if (Number.isNaN(foundAt.getTime())) {
    foundAt = new Date();
  }

  return {
    id: typeof code?.id === 'string' ? code.id : `cache-${index}`,
    code: normalizedCode,
    status,
    source: typeof code?.source === 'string' ? code.source : 'Community',
    foundAt,
    description: typeof code?.description === 'string' ? code.description : undefined,
    note: typeof code?.note === 'string' ? code.note : undefined,
    emblemName: typeof code?.emblemName === 'string' ? code.emblemName : undefined,
    emblemImage: typeof code?.emblemImage === 'string' ? code.emblemImage : undefined,
    isNew: Boolean(code?.isNew),
  };
}

function normalizeManualCodes(value: unknown): RedemptionCode[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const manual: RedemptionCode[] = [];

  for (const [index, entry] of value.entries()) {
    const normalized = normalizeCachedCode(entry as Partial<RedemptionCode>, index);
    if (!normalized || !isManualCode(normalized) || seen.has(normalized.code)) {
      continue;
    }

    seen.add(normalized.code);
    manual.push(normalized);
  }

  return manual;
}

function readManualCodes(): RedemptionCode[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(MANUAL_STORAGE_KEY);
    return raw ? normalizeManualCodes(JSON.parse(raw)) : [];
  } catch {
    try {
      storage.removeItem(MANUAL_STORAGE_KEY);
    } catch {
      // noop
    }
    return [];
  }
}

function writeManualCodes(codes: RedemptionCode[]) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const manual = codes.filter(isManualCode);

  try {
    if (manual.length === 0) {
      storage.removeItem(MANUAL_STORAGE_KEY);
    } else {
      storage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(manual));
    }
  } catch {
    // localStorage unavailable or quota exceeded — in-memory state still holds them
  }
}

/**
 * Pulls user-submitted codes out of a cache payload that is about to be
 * discarded. The v1 cache predates `schemaVersion`, so it always fails
 * validation — without this, upgrading users lose every code they added.
 */
function rescueManualCodes(value: unknown) {
  const rescued = normalizeManualCodes((value as Partial<CachedData> | null)?.codes);
  if (rescued.length === 0) {
    return;
  }

  const existing = readManualCodes();
  const known = new Set(existing.map(code => code.code));
  const merged = [...existing, ...rescued.filter(code => !known.has(code.code))];

  if (merged.length > existing.length) {
    writeManualCodes(merged);
  }
}

function readCachedData(): CachedData | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const storageKeys = [STORAGE_KEY, LEGACY_STORAGE_KEY];
  for (const storageKey of storageKeys) {
    try {
      const rawCache = storage.getItem(storageKey);
      if (!rawCache) {
        continue;
      }

      const parsedCache = JSON.parse(rawCache) as Partial<CachedData>;
      if (
        parsedCache?.schemaVersion !== CACHE_SCHEMA_VERSION ||
        !Array.isArray(parsedCache.codes) ||
        typeof parsedCache.timestamp !== 'number'
      ) {
        rescueManualCodes(parsedCache);
        storage.removeItem(storageKey);
        continue;
      }

      const normalizedCodes = parsedCache.codes
        .map((code, index) => normalizeCachedCode(code as Partial<RedemptionCode>, index))
        .filter((code): code is RedemptionCode => Boolean(code));

      if (normalizedCodes.length === 0) {
        storage.removeItem(storageKey);
        continue;
      }

      return {
        schemaVersion: CACHE_SCHEMA_VERSION,
        codes: normalizedCodes,
        timestamp: parsedCache.timestamp,
      };
    } catch {
      try {
        storage.removeItem(storageKey);
      } catch {
        // noop
      }
    }
  }

  return null;
}

function writeCachedData(codes: RedemptionCode[], timestamp: number = Date.now()) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const cacheData: CachedData = {
    schemaVersion: CACHE_SCHEMA_VERSION,
    codes,
    timestamp,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    storage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // localStorage unavailable or quota exceeded — skip caching
  }

  // Mirrored separately so they outlive cache expiry and schema bumps.
  writeManualCodes(codes);
}

// Initialize with known codes immediately (don't wait for API)
const INITIAL_CODES: RedemptionCode[] = KNOWN_ACTIVE_CODES.map((code, index) =>
  codeDataToRedemptionCode(code, index)
);

export function useCodeScanner() {
  const [codes, setCodes] = useState<RedemptionCode[]>(INITIAL_CODES);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  // Fallback for browsers that block localStorage, where the persisted copy
  // silently no-ops and the only surviving record is this session's state.
  const manualCodesRef = useRef<RedemptionCode[]>([]);

  const collectManualCodes = useCallback((catalogueCodes: Set<string>) => {
    const seen = new Set<string>();
    const manual: RedemptionCode[] = [];

    for (const code of [...manualCodesRef.current, ...readManualCodes()]) {
      if (catalogueCodes.has(code.code) || seen.has(code.code)) {
        continue;
      }

      seen.add(code.code);
      manual.push(code);
    }

    manualCodesRef.current = manual;
    return manual;
  }, []);

  const loadCodes = useCallback(async (forceRefresh = false) => {
    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!forceRefresh) {
        const cachedData = readCachedData();
        if (cachedData) {
          const age = Date.now() - cachedData.timestamp;
          if (age < CACHE_DURATION) {
            const cachedCodes = new Set(cachedData.codes.map(c => c.code));
            const restoredManualCodes = collectManualCodes(cachedCodes);

            if (currentRequestId !== requestIdRef.current) return;
            setCodes([...restoredManualCodes, ...cachedData.codes]);
            setLastUpdateTime(new Date(cachedData.timestamp));
            setIsLoading(false);
            return;
          }
        }
      }

      const freshCodes = await getAllEmblemCodes();
      if (currentRequestId !== requestIdRef.current) return;

      const redemptionCodes = freshCodes.map((code, index) =>
        codeDataToRedemptionCode(code, index)
      );

      // User-submitted codes are not in the catalogue, so a refresh would
      // otherwise silently discard them.
      const catalogueCodes = new Set(redemptionCodes.map(c => c.code));
      const preservedManualCodes = collectManualCodes(catalogueCodes);

      const mergedCodes = [...preservedManualCodes, ...redemptionCodes];

      writeCachedData(mergedCodes);

      setCodes(mergedCodes);
      setLastUpdateTime(new Date());
      setErrorMessage(null);
    } catch (error) {
      if (currentRequestId !== requestIdRef.current) return;
      console.error('Error loading codes:', error);
      const fallbackCodes = new Set(INITIAL_CODES.map(c => c.code));
      setCodes([...collectManualCodes(fallbackCodes), ...INITIAL_CODES]);
      setErrorMessage('We could not refresh the latest codes. Showing the last available set.');
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [collectManualCodes]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCodes();
  }, [loadCodes]);

  const refreshCodes = useCallback(async () => {
    try {
      // Keep the current cache in place so loadCodes can carry over
      // user-submitted codes; forceRefresh already bypasses it for reads.
      const storage = getStorage();
      if (storage) {
        storage.removeItem(LEGACY_STORAGE_KEY);
      }
      await loadCodes(true);
    } catch (error) {
      console.error('Error refreshing codes:', error);
    }
  }, [loadCodes]);

  const addManualCode = useCallback((code: string) => {
    const normalizedCode = normalizeCodeInput(code);

    if (!verifyCodeFormat(normalizedCode)) {
      return { success: false, message: 'Invalid code format' };
    }

    const existingCode = codes.find(c => c.code === normalizedCode);
    if (existingCode) {
      return { success: false, message: 'Code already exists' };
    }

    setCodes(prevCodes => {
      const existingCode = prevCodes.find(c => c.code === normalizedCode);
      if (existingCode) {
        return prevCodes;
      }

      const newCode: RedemptionCode = {
        id: `${MANUAL_ID_PREFIX}${Date.now()}`,
        code: normalizedCode,
        status: 'unknown',
        source: 'User Submitted',
        foundAt: new Date(),
        description: 'Manually added code',
        isNew: true,
      };

      const updatedCodes = [newCode, ...prevCodes.map(c => ({ ...c, isNew: false }))];
      manualCodesRef.current = updatedCodes.filter(isManualCode);
      writeCachedData(updatedCodes);
      return updatedCodes;
    });

    return { success: true, message: 'Code added' };
  }, [codes]);

  return {
    codes,
    isLoading,
    errorMessage,
    lastUpdateTime,
    refreshCodes,
    addManualCode,
  };
}
