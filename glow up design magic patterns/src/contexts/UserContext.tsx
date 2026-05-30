import React, { useState, createContext, useContext } from 'react';
interface UserContextType {
  name: string;
  age: number | null;
  setName: (name: string) => void;
  setAge: (age: number | null) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);
export function UserProvider({ children }: {children: ReactNode;}) {
  const [name, setName] = useState<string>('Naina');
  const [age, setAge] = useState<number | null>(24);
  return (
    <UserContext.Provider
      value={{
        name,
        age,
        setName,
        setAge
      }}>
      
      {children}
    </UserContext.Provider>);

}
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}