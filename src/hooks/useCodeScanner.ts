import { useState, useCallback, useEffect } from 'react';
import { RedemptionCode, CodeStatus } from '@/types/code';
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
  
  return {
    id: `code-${index}`,
    code: codeData.code,
    status: codeData.isActive ? 'active' : 'expired',
    source: codeData.source || 'Community',
    foundAt: new Date(now),
    description: codeData.description,
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

  // Load cached data or fetch fresh data
  const loadCodes = useCallback(async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const cachedData: CachedData = JSON.parse(cached);
        const age = Date.now() - cachedData.timestamp;
        
        // Use cache if less than 30 minutes old
        if (age < CACHE_DURATION) {
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
      
      // Fetch fresh data from APIs
      console.log('Fetching fresh emblem codes from Reddit and community sources...');
      const freshCodes = await getAllEmblemCodes();
      
      const redemptionCodes = freshCodes.map((code, index) => 
        codeDataToRedemptionCode(code, index)
      );
      
      // Cache the results
      const cacheData: CachedData = {
        codes: redemptionCodes,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
      
      setCodes(redemptionCodes);
      setLastUpdateTime(new Date());
      
    } catch (error) {
      console.error('Error loading codes:', error);
      // Fall back to initial codes if fetch fails
      setCodes(INITIAL_CODES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load codes on mount
  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  const refreshCodes = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Force fresh fetch (bypass cache)
      localStorage.removeItem(STORAGE_KEY);
      await loadCodes();
    } catch (error) {
      console.error('Error refreshing codes:', error);
      setIsLoading(false);
    }
  }, [loadCodes]);

  const addManualCode = useCallback((code: string) => {
    const normalizedCode = code.toUpperCase().trim();
    const existingCode = codes.find(c => c.code === normalizedCode);
    
    if (existingCode) {
      return { success: false, message: 'Code already exists' };
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

    const updatedCodes = [newCode, ...codes.map(c => ({ ...c, isNew: false }))];
    setCodes(updatedCodes);
    
    // Update cache
    const cacheData: CachedData = {
      codes: updatedCodes,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    
    return { success: true, message: 'Code added' };
  }, [codes]);

  return {
    codes,
    isLoading,
    lastUpdateTime,
    refreshCodes,
    addManualCode,
  };
}
