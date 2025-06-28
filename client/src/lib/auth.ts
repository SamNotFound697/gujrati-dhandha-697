import type { User } from "@shared/schema";

export interface AuthUser extends Omit<User, 'password'> {}

// Remove localStorage usage for sensitive data
export const getStoredUser = (): AuthUser | null => {
  // In a secure implementation, this would check session validity with server
  return null; // Force re-authentication on page load
};

export const setStoredUser = (user: AuthUser | null): void => {
  // Remove localStorage storage of user data
  // Session management is now handled server-side
  if (typeof window === 'undefined') return;
  
  // Only store non-sensitive UI preferences
  if (user) {
    sessionStorage.setItem('userPreferences', JSON.stringify({
      theme: localStorage.getItem('theme') || 'light',
      interface: localStorage.getItem('interface') || 'buyer'
    }));
  } else {
    sessionStorage.removeItem('userPreferences');
  }
};

export const getStoredInterface = (): 'buyer' | 'seller' => {
  if (typeof window === 'undefined') return 'buyer';
  const prefs = sessionStorage.getItem('userPreferences');
  if (prefs) {
    try {
      const parsed = JSON.parse(prefs);
      return parsed.interface || 'buyer';
    } catch {
      return 'buyer';
    }
  }
  return 'buyer';
};

export const setStoredInterface = (interfaceMode: 'buyer' | 'seller'): void => {
  if (typeof window === 'undefined') return;
  const prefs = sessionStorage.getItem('userPreferences');
  let preferences = { interface: interfaceMode };
  
  if (prefs) {
    try {
      preferences = { ...JSON.parse(prefs), interface: interfaceMode };
    } catch {
      // Use default if parsing fails
    }
  }
  
  sessionStorage.setItem('userPreferences', JSON.stringify(preferences));
};

// Session validation utility
export const validateSession = async (): Promise<AuthUser | null> => {
  try {
    const response = await fetch('/api/auth/validate', {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    
    return null;
  } catch {
    return null;
  }
};

// Secure logout
export const secureLogout = async (): Promise<void> => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Handle logout error silently
  } finally {
    // Clear all client-side data
    sessionStorage.clear();
    localStorage.removeItem('interface');
    // Redirect to home page
    window.location.href = '/';
  }
};