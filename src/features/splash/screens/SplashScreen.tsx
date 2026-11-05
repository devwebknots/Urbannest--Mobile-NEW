/**
 * SplashScreen: plays the ambient motion video (arc light sweep, flowing
 * silk wave, warm villa glow) once, then fades to Home. Tap to skip.
 * The first video frame is shown as a still underneath, so there is no
 * black flash while the video loads.
 */

import React, { useCallback } from 'react';
import { Animated, Image, Pressable, StatusBar, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { navigationRef } from '@/navigation/navigationRef';
import { splashAssets } from '../assets/splashAssets';
import { SPLASH_COLORS } from '../constants';
import { useSplashSequence } from '../hooks/useSplashSequence';

interface Props {
  navigation?: { replace: (route: 'Home') => void };
}

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const goHome = useCallback(() => {
    if (navigation?.replace) {
      navigation.replace('Home');
    } else if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [navigation]);

  const s = useSplashSequence(goHome);

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
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: Animated.multiply(
              s.intro,
              s.exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            ),
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
        <Image
          source={splashAssets.background}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {s.playVideo && (
          <Video
            source={splashAssets.video}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            muted
            repeat={false}
            paused={false}
            controls={false}
            playInBackground={false}
            disableFocus
            ignoreSilentSwitch="obey"
            shutterColor="transparent"
            onEnd={s.skip}
            onError={s.onVideoError}
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SPLASH_COLORS.base,
  },
});

export default SplashScreen;
