/**
 * Global Hook: useAppTheme
 * Provides theme tokens and device color scheme awareness.
 */

import { useColorScheme } from 'react-native';
import { colors, theme, Theme } from '@/config/theme';

export interface UseAppThemeReturn {
  theme: Theme;
  isDarkMode: boolean;
  colors: typeof colors;
}

export const useAppTheme = (): UseAppThemeReturn => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  return {
    theme,
    isDarkMode,
    colors,
  };
};

export default useAppTheme;
