export type CodeStatus = 'active' | 'expired' | 'unknown';

export interface RedemptionCode {
  id: string;
  code: string;
  status: CodeStatus;
  source: string;
  sourceUrl?: string;
  foundAt: Date;
  description?: string;
  isNew?: boolean;
}

export type FilterStatus = 'all' | CodeStatus;

export type SortOrder = 'newest' | 'oldest';
