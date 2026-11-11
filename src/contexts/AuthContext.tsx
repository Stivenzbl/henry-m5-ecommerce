import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/user';

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  loginAs: (role: UserRole, customName?: string, customEmail?: string) => void;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'patagonix_user_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved) as UserProfile);
      } else {
        // Default customer session for demo
        setUser({
          uid: 'user-default-101',
          email: 'cliente@patagonix.com',
          displayName: 'Stiven Zabala',
          role: 'customer',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Failed to load user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAs = (role: UserRole, customName?: string, customEmail?: string) => {
    const newUser: UserProfile = {
      uid: role === 'admin' ? 'admin-root-001' : 'user-default-101',
      email: customEmail || (role === 'admin' ? 'admin@patagonix.com' : 'cliente@patagonix.com'),
      displayName: customName || (role === 'admin' ? 'Admin Stiven' : 'Stiven Zabala'),
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchRole = () => {
    if (!user) return;
    const nextRole: UserRole = user.role === 'admin' ? 'customer' : 'admin';
    loginAs(nextRole);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginAs, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
