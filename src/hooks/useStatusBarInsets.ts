/**
 * useStatusBarInsets: safe-area insets that never come out smaller than the
 * real Android status bar.
 *
 * Inside a full-screen Modal (statusBarTranslucent) some Android phones
 * report a short or zero top inset, so content slid under the status bar.
 * On Android the top is at least StatusBar.currentHeight; iOS is unchanged.
 * Use it for Modals / overlays drawn under the status bar.
 */

import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useStatusBarInsets() {
  const insets = useSafeAreaInsets();
  const androidTop = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  return { ...insets, top: Math.max(insets.top, androidTop) };
}

export default useStatusBarInsets;
