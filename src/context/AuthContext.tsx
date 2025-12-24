import React, { createContext, useContext } from 'react';

interface AuthContextType {
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType>({ accessToken: null });

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  // With django-allauth and session authentication, we don't need token handling
  // Session cookies are handled automatically by the browser
  return (
    <AuthContext.Provider value={{ accessToken: null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthToken() {
  const context = useContext(AuthContext);
  return context.accessToken;
}
