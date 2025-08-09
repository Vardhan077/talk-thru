// import React, { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';

// // Ensure React is available globally
// if (typeof React === 'undefined') {
//   throw new Error('React is not available. Please check your React installation.');
// }

// interface User {
//   _id: string;
//   username: string;
//   photoURL?: string;
//   hasUnseen?: boolean;
// }

// interface AuthContextType {
//   currentUser: User | null;
//   setCurrentUser: (user: User | null) => void;
//   allUsers: User[];
//   setAllUsers: (users: User[]) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const API = 'https://whatsappwebbackend.vercel.app/api';

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [allUsers, setAllUsers] = useState<User[]>([]);

//   useEffect(() => {
//     axios.get(`${API}/me`, { withCredentials: true })
//       .then((res) => {
//         setCurrentUser(res.data.user);
//         setAllUsers(res.data.users);
//       })
//       .catch(() => {
//         setCurrentUser(null);
//       });
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, setCurrentUser, allUsers, setAllUsers }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Ensure React is available globally
if (typeof React === 'undefined') {
  throw new Error('React is not available. Please check your React installation.');
}

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
  // ✅ NEW: Added the loading state to the context type
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = 'https://whatsappwebbackend.vercel.app/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  // ✅ NEW: State to track if the initial auth check is loading
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    // Start the loading state
    setIsLoadingAuth(true);

    axios.get(`${API}/me`, { withCredentials: true })
      .then((res) => {
        setCurrentUser(res.data.user);
        setAllUsers(res.data.users);
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        // ✅ NEW: Set loading to false once the check is complete
        setIsLoadingAuth(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      allUsers, 
      setAllUsers,
      // ✅ NEW: Pass the loading state to the provider
      isLoadingAuth
    }}>
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

