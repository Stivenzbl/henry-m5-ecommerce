import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { AuthenticatedUser, UserRole } from '../types/user';

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthContextValue {
  user: AuthenticatedUser | null;
  status: AuthStatus;
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshClaims: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function mapFirebaseUser(firebaseUser: FirebaseUser, forceRefresh = false): Promise<AuthenticatedUser> {
  const tokenResult = await firebaseUser.getIdTokenResult(forceRefresh);
  const isAdmin = Boolean(tokenResult.claims.admin === true);
  const role: UserRole = isAdmin ? 'admin' : 'customer';

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Usuario'),
    role,
    isAdmin,
    photoURL: firebaseUser.photoURL,
    createdAt: firebaseUser.metadata.creationTime,
    customClaims: tokenResult.claims,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('initializing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      // Fail closed: No fake identity, truthful unauthenticated state
      setStatus('unauthenticated');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const authUser = await mapFirebaseUser(firebaseUser);
          setUser(authUser);
          setStatus('authenticated');
        } catch (err: any) {
          console.error('Error hydrating user token claims:', err);
          setError('No fue posible validar los permisos del usuario.');
          setUser(null);
          setStatus('error');
        }
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    if (!auth || !isFirebaseConfigured) {
      const msg = 'Firebase Authentication no está configurado. Por favor declare VITE_FIREBASE_* en .env o inicie el Firebase Emulator.';
      setError(msg);
      throw new Error(msg);
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const authUser = await mapFirebaseUser(cred.user);
      setUser(authUser);
      setStatus('authenticated');
    } catch (err: any) {
      let friendlyMessage = 'Error al iniciar sesión.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyMessage = 'Correo electrónico o contraseña incorrectos.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'Demasiados intentos fallidos. Intente nuevamente en unos minutos.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'El formato del correo electrónico no es válido.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setStatus('unauthenticated');
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    setError(null);
    if (!auth || !isFirebaseConfigured) {
      const msg = 'Firebase Authentication no está configurado para restablecer contraseña.';
      setError(msg);
      throw new Error(msg);
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      let friendlyMessage = 'No se pudo enviar el correo de recuperación.';
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No existe una cuenta registrada con este correo.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'El formato del correo electrónico no es válido.';
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const refreshClaims = async (): Promise<void> => {
    if (!auth?.currentUser) return;
    try {
      const refreshed = await mapFirebaseUser(auth.currentUser, true);
      setUser(refreshed);
    } catch (err: any) {
      console.error('Error refreshing token claims:', err);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextValue = {
    user,
    status,
    isLoading: status === 'initializing',
    isAdmin: Boolean(user?.isAdmin),
    error,
    isConfigured: isFirebaseConfigured,
    login,
    logout,
    sendPasswordReset,
    refreshClaims,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
