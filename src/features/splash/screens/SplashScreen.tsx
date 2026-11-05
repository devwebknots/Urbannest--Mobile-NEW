/**
 * SplashScreen: plays the ambient motion video (arc light sweep, flowing
 * silk wave, warm villa glow) once, then fades to persona selection. Tap to skip.
 */

import React, { useCallback, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Video, { ViewType } from 'react-native-video';
import { navigationRef } from '@/navigation/navigationRef';
import { SPLASH_MEDIA_ASPECT, splashAssets } from '../assets/splashAssets';
import { SPLASH_COLORS } from '../constants';
import { useSplashSequence } from '../hooks/useSplashSequence';

interface Props {
  navigation?: { replace: (route: 'PersonaSelect') => void };
}

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const goNext = useCallback(() => {
    if (navigation?.replace) {
      navigation.replace('PersonaSelect');
    } else if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'PersonaSelect' }] });
    }
  }, [navigation]);

  const s = useSplashSequence(goNext);

  // Size the video box ourselves (same crop as the poster's "cover"), so the
  // player never rescales. Letting the player do "cover" itself flashes a
  // zoomed-in first frame on Android.
  const [box, setBox] = useState<{ width: number; height: number } | null>(
    null,
  );
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setBox({ width, height });
    }
  }, []);
  const video = box && coverRect(box.width, box.height, SPLASH_MEDIA_ASPECT);

  return (
    <Pressable
      style={styles.root}
      onPress={s.skip}
      accessibilityRole="button"
      accessibilityLabel="UrbanNest. Rent, manage, maintain. Tap to continue"
    >
      <StatusBar barStyle="light-content" />

      <Animated.View
        pointerEvents="none"
        onLayout={onLayout}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: s.exit.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            transform: [
              {
                scale: s.exit.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.04],
                }),
              },
            ],
          },
        ]}
      >
        {s.playVideo && video && (
          <View style={styles.clip}>
            <Video
              source={splashAssets.video}
              style={[styles.video, video]}
              // Box already has the video's aspect, so no scaling is needed
              resizeMode="contain"
              // TextureView respects the exit fade on Android (SurfaceView ignores it)
              viewType={ViewType.TEXTURE}
              muted
              repeat={s.hold}
              paused={false}
              controls={false}
              playInBackground={false}
              disableFocus
              ignoreSilentSwitch="obey"
              shutterColor="transparent"
              onEnd={s.skip}
              onError={s.onVideoError}
            />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

/** Centered rect with the given aspect that covers a w x h area. */
function coverRect(w: number, h: number, aspect: number) {
  const width = Math.max(w, h * aspect);
  const height = width / aspect;
  return { width, height, left: (w - width) / 2, top: (h - height) / 2 };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SPLASH_COLORS.base,
  },
  video: {
    position: 'absolute',
  },
  clip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});

export default SplashScreen;
