/**
 * Collapsible: smoothly expands / collapses its content.
 * Height animates from 0 to the content's measured height while the
 * content fades in and slides down a little. Content stays mounted so it
 * can be measured; when closed it is hidden from touch and screen readers.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const OPEN_MS = 340;
const CLOSE_MS = 260;

interface Props {
  open: boolean;
  children: React.ReactNode;
}

export const Collapsible: React.FC<Props> = ({ open, children }) => {
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: open ? OPEN_MS : CLOSE_MS,
      easing: open ? Easing.bezier(0.2, 0.8, 0.2, 1) : Easing.bezier(0.4, 0, 0.6, 1),
      // Height can't use the native driver
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [open, progress]);

  return (
    <Animated.View
      pointerEvents={open ? 'auto' : 'none'}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
      accessibilityElementsHidden={!open}
      style={[
        styles.clip,
        { height: progress.interpolate({ inputRange: [0, 1], outputRange: [0, height] }) },
      ]}
    >
      <Animated.View
        onLayout={e => setHeight(e.nativeEvent.layout.height)}
        style={[
          styles.content,
          {
            opacity: progress.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0.6, 1] }),
            transform: [
              { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) },
            ],
          },
        ]}
      >
        <View>{children}</View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  // Absolute so it always lays out at full height, even while clipped
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});

export default Collapsible;
