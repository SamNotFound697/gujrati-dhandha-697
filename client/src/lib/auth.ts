import type { User } from "@shared/schema";

export interface AuthUser extends Omit<User, 'password'> {}

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};

export const setStoredUser = (user: AuthUser | null): void => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }
};

export const getStoredInterface = (): 'buyer' | 'seller' => {
  if (typeof window === 'undefined') return 'buyer';
  return (localStorage.getItem('interface') as 'buyer' | 'seller') || 'buyer';
};

export const setStoredInterface = (interfaceMode: 'buyer' | 'seller'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('interface', interfaceMode);
};
