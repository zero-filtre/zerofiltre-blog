export interface User {
    id?: string;
    pseudoName?: string;
    fullName?: string;
    email?: string;
    registeredOn?: Date;
    profilePicture?: string;
    bio?: string;
    profession?: string;
    socialLinks?: any;
    website?: string;
    active?: boolean;
    roles?: RoleType[];
    loginFrom?: string;
    expired?: boolean;
    language?: string;
    plan?: PlanType;
    pro?: boolean;
    companies?: Company[];
}

export const PLANS = { PRO: 'PRO', BASIC: 'BASIC' } as const;
export type PlanType = 'PRO' | 'BASIC'

export const ROLES = { ADMIN: 'ROLE_ADMIN', USER: 'ROLE_USER' } as const;
export type RoleType = 'ROLE_ADMIN' | 'ROLE_USER'

// export type RoleType = keyof typeof ROLES;

type Company = {
    companyId: number,
	role: 'ADMIN' | 'EDITOR' | 'VIEWER'
}

