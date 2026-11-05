/**
 * Global Hook: useKeyboard
 * Detects keyboard status and height changes.
 */

import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export interface KeyboardState {
  readonly isKeyboardVisible: boolean;
  readonly keyboardHeight: number;
}

export const useKeyboard = (): KeyboardState => {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isKeyboardVisible: false,
    keyboardHeight: 0,
  });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      setKeyboardState({
        isKeyboardVisible: true,
        keyboardHeight: e.endCoordinates.height,
      });
    };

    const onHide = () => {
      setKeyboardState({
        isKeyboardVisible: false,
        keyboardHeight: 0,
      });
    };

    const showSubscription = Keyboard.addListener(showEvent, onShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardState;
};

export default useKeyboard;
