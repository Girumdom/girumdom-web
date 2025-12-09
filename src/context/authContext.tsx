import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export interface User {
  user_id: number;
  email: string;
  fullname: string;
  role: string;
  profile_picture: string | null;
  memory_count?: number;
  collaboration_count?: number;
}

interface DecodedToken {
  user_id: number;
  email: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: false,
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Helper function to clear storage safely
  const clearStorage = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    clearStorage();
    setUser(null);
    setToken(null);
  }, []);
  
  const login = useCallback(async (newToken: string, userData: User) => {
    try {
      const decoded: DecodedToken = jwtDecode(newToken);

      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Token expired during login attempt');
        await logout();
        return;
      }

      localStorage.setItem("authToken", newToken);
      localStorage.setItem("userData", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      await logout();
    }
  }, [logout]);

  const loadUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("userData");

      if (storedToken && storedUser) {
        const decoded: DecodedToken = jwtDecode(storedToken);

        if (decoded.exp * 1000 < Date.now()) {
          console.warn('Stored token is expired. Logging out user.');
          await logout();
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Error loading user:', error);
      await logout();
    }
  }, [logout]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  }, [user]);

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
      setIsLoading(false);
    };
    initialize();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};