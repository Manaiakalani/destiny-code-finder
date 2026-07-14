export type CodeStatus = 'redeemable' | 'restricted' | 'd1' | 'pinned';

export interface RedemptionCode {
  id: string;
  code: string;
  status: CodeStatus;
  source: string;
  foundAt: Date;
  description?: string;
  note?: string;
  isNew?: boolean;
  isPinned?: boolean;
  emblemImage?: string;
  emblemName?: string;
}

export type FilterStatus = 'all' | CodeStatus;
