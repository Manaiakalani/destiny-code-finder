import { useState, useCallback, useEffect, useRef } from 'react';
import { RedemptionCode } from '@/types/code';
import { getAllEmblemCodes, KNOWN_ACTIVE_CODES, EmblemCodeData } from '@/services/codeScraperService';

const STORAGE_KEY = 'destiny2-codes-cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

interface CachedData {
  codes: RedemptionCode[];
  timestamp: number;
}

// Convert scraped code data to our RedemptionCode format
function codeDataToRedemptionCode(codeData: EmblemCodeData, index: number): RedemptionCode {
  const now = Date.now();

  let status: RedemptionCode['status'] = codeData.isActive ? 'active' : 'expired';
  if (codeData.isD1) status = 'd1';

  return {
    id: `code-${index}`,
    code: codeData.code,
    status,
    source: codeData.source || 'Community',
    foundAt: new Date(now),
    description: codeData.description || codeData.emblemName,
    note: codeData.note,
    emblemName: codeData.emblemName,
    emblemImage: codeData.iconUrl,
    isNew: true
  };
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

  // Load cached data or fetch fresh data
  const loadCodes = useCallback(async (forceRefresh = false) => {
    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached && !forceRefresh) {
          const cachedData = JSON.parse(cached) as CachedData;
          if (cachedData?.codes && typeof cachedData.timestamp === 'number') {
            const age = Date.now() - cachedData.timestamp;
            if (age < CACHE_DURATION) {
              if (currentRequestId !== requestIdRef.current) return;
              const restoredCodes = cachedData.codes.map(c => ({
                ...c,
                foundAt: new Date(c.foundAt)
              }));
              setCodes(restoredCodes);
              setLastUpdateTime(new Date(cachedData.timestamp));
              setIsLoading(false);
              return;
            }
          }
        }
      } catch {
        // localStorage unavailable or corrupted — clear and continue
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
      }

      const freshCodes = await getAllEmblemCodes();
      if (currentRequestId !== requestIdRef.current) return; // stale response

      const redemptionCodes = freshCodes.map((code, index) =>
        codeDataToRedemptionCode(code, index)
      );

      try {
        const cacheData: CachedData = {
          codes: redemptionCodes,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      } catch {
        // localStorage unavailable or quota exceeded — skip caching
      }

      setCodes(redemptionCodes);
      setLastUpdateTime(new Date());
      setErrorMessage(null);
    } catch (error) {
      if (currentRequestId !== requestIdRef.current) return;
      console.error('Error loading codes:', error);
      setCodes(INITIAL_CODES);
      setErrorMessage('We could not refresh the latest codes. Showing the last available set.');
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Initial data load on mount — setState within async callback is intentional
    void loadCodes(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadCodes]);

  const refreshCodes = useCallback(async () => {
    try {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
      await loadCodes(true);
    } catch (error) {
      console.error('Error refreshing codes:', error);
    }
  }, [loadCodes]);

  const addManualCode = useCallback((code: string) => {
    const normalizedCode = code.toUpperCase().trim();

    const bungieCharset = /^[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}$/;
    if (!bungieCharset.test(normalizedCode)) {
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
        id: `manual-${Date.now()}`,
        code: normalizedCode,
        status: 'unknown',
        source: 'User Submitted',
        foundAt: new Date(),
        description: 'Manually added code',
        isNew: true,
      };

      const updatedCodes = [newCode, ...prevCodes.map(c => ({ ...c, isNew: false }))];

      try {
        const cacheData: CachedData = {
          codes: updatedCodes,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      } catch {
        // localStorage unavailable — skip caching
      }

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
