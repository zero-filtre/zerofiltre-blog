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
    roles?: string[];
    loginFrom?: string;
    expired?: boolean;
    language?: string;
}