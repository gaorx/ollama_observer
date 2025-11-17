import { create } from 'zustand';
import { GlobalToken, theme } from 'antd';

type ThemeId = 'light' | 'dark';

export function getThemeId(): ThemeId {
  return useThemeStore.getState().themeId;
}

export function setThemeId(theme: ThemeId): void {
  useThemeStore.getState().setTheme(theme);
}

export function useThemeToken(): GlobalToken {
  return theme.useToken().token;
}

interface ThemeState {
  themeId: ThemeId;
  setTheme(theme: ThemeId): void;
}

const useThemeStore = create<ThemeState>()((set) => ({
  themeId: 'light',
  setTheme(theme: ThemeId): void {
    set({ themeId: theme });
  },
}));
