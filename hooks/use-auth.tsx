'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface UserCharacter {
  Name: string;
  cLevel: number;
  ResetCount: number;
  m_GrandReset: number;
  Class: number;
  Money: number;
  Strength: number;
  Dexterity: number;
  Vitality: number;
  Energy: number;
  Leadership: number;
  PkCount: number;
  PkLevel: number;
  MapNumber: number;
  MapPosX: number;
  MapPosY: number;
  GuildName?: string;
}

export interface UserProfile {
  username: string;
  email: string;
  status: string;
  shopPoints: {
    WCoinC: number;
    WCoinP: number;
    GoblinPoint: number;
  };
  characters: UserCharacter[];
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (userData: UserProfile) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (active) {
          if (data.authenticated && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    initAuth();
    return () => {
      active = false;
    };
  }, []);

  const login = (userData: UserProfile) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
