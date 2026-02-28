export type CodeStatus = 'active' | 'expired' | 'd1' | 'unknown';

export interface RedemptionCode {
  id: string;
  code: string;
  status: CodeStatus;
  source: string;
  foundAt: Date;
  description?: string;
  note?: string;
  isNew?: boolean;
  emblemImage?: string;
  emblemName?: string;
}

export type FilterStatus = 'all' | CodeStatus;
