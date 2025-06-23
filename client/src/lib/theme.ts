export type Theme = 'light' | 'dark' | 'cool';

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('theme') as Theme) || 'light';
};

export const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
};

export const applyTheme = (theme: Theme): void => {
  if (typeof document === 'undefined') return;
  
  // Remove existing theme classes
  document.body.classList.remove('theme-light', 'theme-dark', 'theme-cool');
  
  // Add new theme class
  document.body.classList.add(`theme-${theme}`);
  
  // Handle dark mode class for compatibility
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Handle RGB border animation for cool mode
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    if (theme === 'cool') {
      searchInput.classList.add('rgb-border');
    } else {
      searchInput.classList.remove('rgb-border');
    }
  }
};
