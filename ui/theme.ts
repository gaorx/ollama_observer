import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeId = 'light' | 'dark';

export interface Theme {
  id: ThemeId;
  colorBg: string;
  colorEmpty: string;
}

const lightTheme: Theme = {
  id: 'light',
  colorBg: '#ffffff',
  colorEmpty: 'rgba(0, 0, 0, 0.25)',
};

const darkTheme: Theme = {
  id: 'dark',
  colorBg: '#000000',
  colorEmpty: 'rgba(255, 255, 255, 0.25)',
};

export interface ThemeState {
  themeId: ThemeId;
  setTheme(themeId: ThemeId): void;
  toggleTheme(): void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: 'light',
      setTheme(themeId: ThemeId): void {
        set({ themeId: themeId });
      },
      toggleTheme(): void {
        set((state) => ({
          themeId: state.themeId === 'light' ? 'dark' : 'light',
        }));
      },
    }),
    {
      name: 'theme-store',
    }
  )
);

export function isDarkTheme(state: ThemeState): boolean {
  return state.themeId === 'dark';
}

export function selectTheme(state: ThemeState): Theme {
  return state.themeId === 'light' ? lightTheme : darkTheme;
}
