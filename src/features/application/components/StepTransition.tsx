/**
 * StepTransition: when the application step changes, its content slides
 * in from the side it is coming from (forward = from the right, back = from
 * the left) while fading in. Off in tests.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { moderateScale as ms } from '@/utils/responsive';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

const SHIFT = ms(36);

export const StepTransition: React.FC<{ step: number; children: React.ReactNode }> = ({
  step,
  children,
}) => {
  const progress = useRef(new Animated.Value(1)).current;
  const from = useRef(new Animated.Value(0)).current;
  const prev = useRef(step);

  useEffect(() => {
    if (prev.current === step) {
      return;
    }
    const forward = step > prev.current;
    prev.current = step;
    if (IS_TEST) {
      return;
    }
    from.setValue(forward ? SHIFT : -SHIFT);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [step, progress, from]);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          { translateX: Animated.multiply(from, Animated.subtract(1, progress)) },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default StepTransition;
