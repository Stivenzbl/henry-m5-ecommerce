export type UserRole = 'customer' | 'admin';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isAdmin: boolean;
  photoURL?: string | null;
  createdAt?: string;
  customClaims?: Record<string, any>;
}

export interface UserProfile extends AuthenticatedUser {}
