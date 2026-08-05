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

interface ManualCodesRead {
  codes: RedemptionCode[];
  /**
   * False when the stored payload could not be parsed AND could not be set
   * aside — meaning it is still the only copy of whatever it holds, and must
   * not be overwritten.
   */
  readable: boolean;
  /** False when the browser denies localStorage entirely. */
  available: boolean;
}

function readManualCodes(): ManualCodesRead {
  const storage = getStorage();
  if (!storage) {
    return { codes: [], readable: true, available: false };
  }

  try {
    const raw = storage.getItem(MANUAL_STORAGE_KEY);
    return {
      codes: raw ? normalizeManualCodes(JSON.parse(raw)) : [],
      readable: true,
      available: true,
    };
  } catch {
    return {
      codes: [],
      readable: quarantineCorruptPayload(storage, MANUAL_STORAGE_KEY),
      available: true,
    };
  }
}

/**
 * 'saved' also covers "there was nothing new to write" — in both cases the
 * caller's codes are accounted for in storage and any source payload holding
 * them is safe to discard.
 */
type ManualWriteResult = 'saved' | 'unavailable' | 'failed';

/**
 * Persists user-submitted codes by MERGING with whatever is already stored,
 * never by replacing it. Callers hand in a snapshot of their own state, and a
 * snapshot can be stale — a plain replace would let one caller silently delete
 * a code another path had just rescued. Nothing in the UI deletes a manual
 * code, so union is always the correct resolution.
 *
 * Returns 'failed' only when the merged set could not be persisted.
 */
function writeManualCodes(codes: RedemptionCode[]): ManualWriteResult {
  const storage = getStorage();
  if (!storage) {
    return 'unavailable';
  }

  const incoming = codes.filter(isManualCode);
  if (incoming.length === 0) {
    return 'saved';
  }

  const existing = readManualCodes();
  if (!existing.readable) {
    // Overwriting now would destroy a payload we could not preserve.
    return 'failed';
  }

  const known = new Set(existing.codes.map(code => code.code));
  const merged = [...existing.codes, ...incoming.filter(code => !known.has(code.code))];

  if (merged.length === existing.codes.length) {
    return 'saved';
  }

  try {
    storage.setItem(MANUAL_STORAGE_KEY, JSON.stringify(merged));
    return 'saved';
  } catch {
    // Quota exceeded or storage blocked.
    return 'failed';
  }
}

/**
 * Pulls user-submitted codes out of a cache payload before that payload is
 * discarded. The v1 cache predates `schemaVersion`, so it always fails
 * validation — without this, upgrading users lose every code they added.
 *
 * Returns false only when there was something to rescue and it could not be
 * persisted, in which case the caller must NOT delete the source payload: at
 * that point it is the only surviving copy.
 */
function rescueManualCodes(value: unknown): boolean {
  return writeManualCodes(normalizeManualCodes((value as Partial<CachedData> | null)?.codes)) === 'saved';
}

/**
 * Moves a payload we cannot parse out of the way instead of deleting it. It
 * may still contain a user code behind the corruption, and that is the one
 * thing here we cannot regenerate.
 *
 * Quarantine slots are never reused: a second corruption on the same key would
 * otherwise overwrite the first one's bytes, which is the exact loss this is
 * meant to prevent.
 *
 * Returns false when the original could not be set aside, in which case it is
 * left untouched and callers must not overwrite it.
 */
function quarantineCorruptPayload(storage: Storage, storageKey: string): boolean {
  try {
    const raw = storage.getItem(storageKey);
    if (raw !== null) {
      const preferredSlot = `${storageKey}-corrupt`;
      const occupant = storage.getItem(preferredSlot);
      const slot =
        occupant === null || occupant === raw
          ? preferredSlot
          : `${preferredSlot}-${Date.now()}`;

      storage.setItem(slot, raw);
    }
    storage.removeItem(storageKey);
    return true;
  } catch {
    // Could not set it aside — leave the original rather than lose it.
    return false;
  }
}

function purgeLegacyCache() {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    const raw = storage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return;
    }

    if (rescueManualCodes(JSON.parse(raw))) {
      storage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    quarantineCorruptPayload(storage, LEGACY_STORAGE_KEY);
  }
}

/**
 * Lifts user codes out of a cache payload written by an older build that still
 * stored them inline. Must run before any overwrite of that key — including on
 * the force-refresh path, which never reads the cache at all.
 *
 * Returns false when the existing payload may still be the only copy of a user
 * code, meaning the caller must not overwrite it.
 */
function migrateInlineManualCodes(storage: Storage, storageKey: string): boolean {
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) {
      return true;
    }

    return rescueManualCodes(JSON.parse(raw));
  } catch {
    // Unparseable, but corruption can hide an intact user code — set it aside
    // rather than let the caller write straight over it.
    return quarantineCorruptPayload(storage, storageKey);
  }
}

interface CacheReadResult {
  data: CachedData | null;
  /**
   * Manual codes found inline in a cache payload that could not be moved to
   * the dedicated key. They are still safe on disk, but nothing else can see
   * them, so they are handed back for display.
   */
  unpersistedManualCodes: RedemptionCode[];
}

function readCachedData(): CacheReadResult {
  const storage = getStorage();
  if (!storage) {
    return { data: null, unpersistedManualCodes: [] };
  }

  // Migrate first. Once a valid v2 cache exists the loop below returns before
  // it ever reaches the legacy key, so a legacy payload whose earlier rescue
  // failed would otherwise be orphaned with no further retry.
  purgeLegacyCache();

  const unpersistedManualCodes: RedemptionCode[] = [];
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
        if (rescueManualCodes(parsedCache)) {
          storage.removeItem(storageKey);
        } else {
          unpersistedManualCodes.push(...normalizeManualCodes(parsedCache?.codes));
        }
        continue;
      }

      const normalizedCodes = parsedCache.codes
        .map((code, index) => normalizeCachedCode(code as Partial<RedemptionCode>, index))
        .filter((code): code is RedemptionCode => Boolean(code));

      // Earlier builds stored manual codes inside the catalogue cache. Move any
      // stragglers to the dedicated key and hand back catalogue entries only,
      // so callers never mistake a user code for a catalogue one.
      const catalogueCodes = normalizedCodes.filter(code => !isManualCode(code));
      if (catalogueCodes.length !== normalizedCodes.length) {
        // Only strip them from the cache once they are safely in the other key.
        if (rescueManualCodes({ codes: normalizedCodes })) {
          try {
            storage.setItem(storageKey, JSON.stringify({
              schemaVersion: CACHE_SCHEMA_VERSION,
              codes: catalogueCodes,
              timestamp: parsedCache.timestamp,
            }));
          } catch {
            // Cache stays mixed; it is filtered on every read regardless.
          }
        } else {
          unpersistedManualCodes.push(...normalizedCodes.filter(isManualCode));
        }
      }

      if (catalogueCodes.length === 0) {
        continue;
      }

      return {
        data: {
          schemaVersion: CACHE_SCHEMA_VERSION,
          codes: catalogueCodes,
          timestamp: parsedCache.timestamp,
        },
        unpersistedManualCodes,
      };
    } catch {
      quarantineCorruptPayload(storage, storageKey);
    }
  }

  return { data: null, unpersistedManualCodes };
}

function writeCachedData(
  codes: RedemptionCode[],
  timestamp: number = Date.now()
): ManualWriteResult {
  // Manual codes first, and always: they are the only unrecoverable data here,
  // whereas the catalogue cache can be rebuilt from the bundled catalogue.
  const manualResult = writeManualCodes(codes);

  const storage = getStorage();
  if (!storage) {
    return manualResult;
  }

  purgeLegacyCache();

  // A force refresh never reads the cache, so this is the only chance to lift
  // user codes out of a payload written by an older build before we clobber it.
  if (!migrateInlineManualCodes(storage, STORAGE_KEY)) {
    // Those codes exist nowhere else yet — keep the payload holding them.
    return manualResult;
  }

  const cacheData: CachedData = {
    schemaVersion: CACHE_SCHEMA_VERSION,
    codes: codes.filter(code => !isManualCode(code)),
    timestamp,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
  } catch {
    // localStorage unavailable or quota exceeded — skip caching. Retry the
    // manual write now that the catalogue cache may have freed space; user
    // codes are worth a second attempt, the catalogue is not.
    if (manualResult === 'failed') {
      return writeManualCodes(codes);
    }
  }

  return manualResult;
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
  /**
   * Manual codes this session knows about that are NOT confirmed to be in
   * storage — either the browser blocks localStorage, or a write failed. They
   * are the only surviving copy, so they are unioned into every read.
   *
   * Deliberately NOT a mirror of storage: if the user clears site data, those
   * codes are meant to be gone, and a mirror would resurrect them on the next
   * refresh.
   */
  const unsavedManualCodesRef = useRef<RedemptionCode[]>([]);
  // Lets the cross-tab handler read current codes without re-subscribing on
  // every render, and without doing side effects inside a state updater.
  const codesRef = useRef(codes);
  useEffect(() => {
    codesRef.current = codes;
  }, [codes]);

  const collectManualCodes = useCallback(
    (catalogueCodes: Set<string>, extraCodes: RedemptionCode[] = []) => {
      const stored = readManualCodes();
      const seen = new Set<string>();
      const manual: RedemptionCode[] = [];

      for (const code of [...unsavedManualCodesRef.current, ...extraCodes, ...stored.codes]) {
        if (catalogueCodes.has(code.code) || seen.has(code.code)) {
          continue;
        }

        seen.add(code.code);
        manual.push(code);
      }

      // Anything now confirmed in storage no longer needs the in-memory copy.
      if (stored.available && stored.readable) {
        const persisted = new Set(stored.codes.map(code => code.code));
        unsavedManualCodesRef.current = unsavedManualCodesRef.current.filter(
          code => !persisted.has(code.code)
        );
      }

      return manual;
    },
    []
  );

  const loadCodes = useCallback(async (forceRefresh = false) => {
    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (!forceRefresh) {
        const { data: cachedData, unpersistedManualCodes } = readCachedData();
        if (cachedData) {
          const age = Date.now() - cachedData.timestamp;
          if (age < CACHE_DURATION) {
            const cachedCodes = new Set(cachedData.codes.map(c => c.code));
            const restoredManualCodes = collectManualCodes(cachedCodes, unpersistedManualCodes);

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
      writeCachedData([...collectManualCodes(catalogueCodes), ...redemptionCodes]);

      // Re-collect: writeCachedData migrates user codes out of any older
      // payload, and on a force refresh that is the first time this run sees
      // them. Skipping this would hide them until the next load.
      const mergedCodes = [...collectManualCodes(catalogueCodes), ...redemptionCodes];

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
      // Keep the v2 cache in place so loadCodes can carry over user-submitted
      // codes; forceRefresh already bypasses it for reads. The legacy key is
      // migrated rather than dropped, so a manual code cannot be lost here.
      purgeLegacyCache();
      await loadCodes(true);
    } catch (error) {
      console.error('Error refreshing codes:', error);
    }
  }, [loadCodes]);

  const addManualCode = useCallback((code: string) => {
    const normalizedCode = normalizeCodeInput(code);

    if (!verifyCodeFormat(normalizedCode)) {
      return { success: false, message: 'Invalid code format', persisted: false };
    }

    if (codes.some(c => c.code === normalizedCode)) {
      return { success: false, message: 'Code already exists', persisted: false };
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

    // Persist outside the state updater so the caller learns whether it stuck.
    const writeResult = writeCachedData([newCode, ...codes]);
    if (writeResult !== 'saved') {
      unsavedManualCodesRef.current = [
        newCode,
        ...unsavedManualCodesRef.current.filter(c => c.code !== normalizedCode),
      ];
    }

    setCodes(prevCodes => {
      if (prevCodes.some(c => c.code === normalizedCode)) {
        return prevCodes;
      }

      return [newCode, ...prevCodes.map(c => ({ ...c, isNew: false }))];
    });

    if (writeResult === 'saved') {
      return { success: true, message: 'Code added and pinned to the top', persisted: true };
    }

    return {
      success: true,
      persisted: false,
      message:
        writeResult === 'unavailable'
          ? 'Code added, but your browser is blocking storage — it will be gone if you reload.'
          : 'Code added, but it could not be saved — it will be gone if you reload.',
    };
  }, [codes]);

  // Another tab merging its own codes into the shared key can only ever have
  // written a superset or a stale set. Re-merging ours back in makes the two
  // converge instead of letting the later write win.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== MANUAL_STORAGE_KEY) {
        return;
      }

      const manual = codesRef.current.filter(isManualCode);
      if (manual.length > 0) {
        writeManualCodes(manual);
      }

      const catalogueCodes = codesRef.current.filter(c => !isManualCode(c));
      const merged = collectManualCodes(new Set(catalogueCodes.map(c => c.code)), manual);
      setCodes([...merged, ...catalogueCodes]);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [collectManualCodes]);

  return {
    codes,
    isLoading,
    errorMessage,
    lastUpdateTime,
    refreshCodes,
    addManualCode,
  };
}
