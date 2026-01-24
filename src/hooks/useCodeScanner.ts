import { useState, useCallback, useEffect } from 'react';
import { RedemptionCode, CodeStatus } from '@/types/code';

const STORAGE_KEY = 'destiny2-codes-cache';

// Known Destiny 2 redemption codes - curated list
const CURATED_CODES: RedemptionCode[] = [
  // Active emblems
  { id: '1', code: 'YRC-C3D-YNC', status: 'active', source: 'Bungie Rewards', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 2), description: 'The Visionary Emblem', isNew: true },
  { id: '2', code: '7D4-PKR-MD7', status: 'active', source: 'Bungie Rewards', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 8), description: 'Folding Space Emblem', isNew: true },
  { id: '3', code: 'JYN-JAA-Y7D', status: 'active', source: 'Bungie Rewards', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 24), description: 'Ab Aeterno Emblem' },
  { id: '4', code: 'RA9-XPH-6KJ', status: 'active', source: 'Bungie Newsletter', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 36), description: 'Tachyon Recall Emblem' },
  { id: '5', code: 'JNX-DMH-XLA', status: 'active', source: '@DestinyTheGame', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 48), description: 'The Reflector Emblem' },
  { id: '6', code: '7CP-94V-LFP', status: 'active', source: 'Community Event', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 72), description: 'Shadow of Earth Emblem' },
  { id: '7', code: 'N3L-XN6-PXF', status: 'active', source: 'Bungie Rewards', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 96), description: 'Lone Focus Emblem' },
  { id: '8', code: 'X9F-GMA-H6D', status: 'active', source: 'Pride Event', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 120), description: 'Be True Emblem' },
  { id: '9', code: 'A7L-FYC-44X', status: 'active', source: 'Bungie Rewards', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 144), description: 'Sign of the Finite Emblem' },
  { id: '10', code: 'PKH-JL6-L4R', status: 'active', source: 'The Final Shape', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 168), description: 'Countdown to Convergence Emblem' },
  { id: '11', code: 'T67-JXY-PH6', status: 'active', source: 'Season of the Wish', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 192), description: 'Future in Shadow Emblem' },
  { id: '12', code: 'ML3-FD4-ND9', status: 'active', source: 'Bungie Rewards', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 216), description: 'Cryonautics Emblem' },
  { id: '13', code: 'VA7-L7H-PNC', status: 'active', source: 'Community Quest', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 240), description: 'Galilean Excursion Emblem' },
  { id: '14', code: 'XMX-RJH-FMX', status: 'active', source: 'Bungie ARG', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 264), description: 'The Unimagined Plane Emblem' },
  // Expired codes
  { id: '15', code: 'FJ9-LAM-67F', status: 'expired', source: 'Season 19', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 720), description: 'Seraph Cipher Emblem (Expired)' },
  { id: '16', code: 'XFV-KHP-N97', status: 'expired', source: 'Season 18', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 1440), description: 'Plundered Lucre Emblem (Expired)' },
  { id: '17', code: 'PHV-6LF-9CP', status: 'expired', source: 'Season 17', foundAt: new Date(Date.now() - 1000 * 60 * 60 * 2160), description: 'Haunted Memories Emblem (Expired)' },
];

export function useCodeScanner() {
  const [codes, setCodes] = useState<RedemptionCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // Load codes on mount
  useEffect(() => {
    // Simulate initial load
    setTimeout(() => {
      setCodes(CURATED_CODES);
      setLastUpdateTime(new Date());
      setIsLoading(false);
    }, 800);
  }, []);

  const refreshCodes = useCallback(async () => {
    setIsLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCodes(CURATED_CODES);
    setLastUpdateTime(new Date());
    setIsLoading(false);
  }, []);

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

    setCodes(prev => [newCode, ...prev.map(c => ({ ...c, isNew: false }))]);
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
