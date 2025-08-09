import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  photoURL?: string;
  hasUnseen?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get(`${API}/me`, { withCredentials: true })
      .then((res) => {
        setCurrentUser(res.data.user);
        setAllUsers(res.data.users);
      })
      .catch(() => {
        setCurrentUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, allUsers, setAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};