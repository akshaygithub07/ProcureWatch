import React, { useState, createContext, useContext } from 'react'
export type UserRole = 'vendor' | 'buyer' | 'auditor' | 'citizen'
interface User {
  name: string
  role: UserRole
  avatar: string
}
interface UserContextType {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}
const UserContext = createContext<UserContextType | undefined>(undefined)
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: 'Jane Cooper',
    role: 'buyer',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  })
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
