/**
 * Reveal: fades and lifts its child in after `delay` ms (off in tests).
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

export const Reveal: React.FC<{ delay: number; children: React.ReactNode }> = ({
  delay,
  children,
}) => {
  const progress = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;
  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    Animated.timing(progress, {
      toValue: 1,
      duration: 600,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay]);
  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [24, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default Reveal;
