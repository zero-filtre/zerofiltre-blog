export interface Company {
  id: number;
  thumbnail?: string;
  summary?: string;
  siren: string;
  companyName: string;
}

export type CompanyUserRoleType = 'ADMIN' | 'EDITOR' | 'VIEWER';
