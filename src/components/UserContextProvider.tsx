'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Only include fields you need on the client
export type User = {
  id: number;
  email: string;
  name?: string | null;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({
  user: initialUser,
  children,
}: {
  user: User | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserContextProvider");
  return context;
}
