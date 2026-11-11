/**
 * BannerCarousel: full-width sliding banners at the top of the
 * Maintenance page. Each banner is a 16:9 artwork (headline, text and
 * button are part of the image) in a rounded card; tap opens it.
 *  - one full-screen-width page per banner, so neighbours never peek in
 *  - expanding-pill indicator under it: the active dot stretches into a
 *    navy pill and the others are small grey dots; it follows the swipe
 *  - slides on its own every few seconds (looping), pauses while the
 *    user swipes; off in tests and with the phone's Reduce Motion on
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  View,
} from 'react-native';
import { colors, spacing } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { MaintenanceBanner } from '../../types';
import { CARD_RADIUS } from './cardStyle';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

/** Time each banner stays before sliding to the next */
const AUTO_SLIDE_MS = 4500;

interface Props {
  banners: readonly MaintenanceBanner[];
  /** Artwork width / height */
  aspect: number;
  /** Screen width */
  width: number;
  onPress: (banner: MaintenanceBanner) => void;
}

export const BannerCarousel: React.FC<Props> = ({ banners, aspect, width, onPress }) => {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const dragging = useRef(false);
  // Bumped when a swipe settles, to restart the timer on the same slide
  const [cycle, setCycle] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const cardWidth = width - spacing.screenHorizontal * 2;
  const cardHeight = Math.round(cardWidth / aspect);
  const autoPlay = !IS_TEST && !reduceMotion && banners.length > 1;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  // Auto-slide; the timer restarts whenever the slide changes or a swipe ends
  useEffect(() => {
    if (!autoPlay) {
      return;
    }
    const timer = setTimeout(() => {
      if (dragging.current) {
        return;
      }
      const next = (indexRef.current + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }, AUTO_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, cycle, autoPlay, width, banners.length]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    scrollX.setValue(x);
    const next = Math.max(0, Math.min(banners.length - 1, Math.round(x / width)));
    if (next !== indexRef.current) {
      indexRef.current = next;
      setIndex(next);
    }
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          dragging.current = true;
        }}
        onMomentumScrollEnd={() => {
          if (dragging.current) {
            dragging.current = false;
            setCycle(c => c + 1);
          }
        }}
      >
        {banners.map(banner => (
          // Page: clips the card's shadow to its own width
          <View key={banner.id} style={[styles.page, { width }]}>
            <Pressable
              onPress={() => onPress(banner)}
              accessibilityRole="button"
              accessibilityLabel={`${banner.title}. View details`}
              style={({ pressed }) => [
                styles.card,
                { width: cardWidth, height: cardHeight },
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={banner.image}
                style={{ width: cardWidth, height: cardHeight }}
                resizeMode="cover"
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {banners.length > 1 ? (
        <View
          style={styles.dots}
          accessible
          accessibilityLabel={`Banner ${index + 1} of ${banners.length}`}
        >
          {banners.map((banner, i) => {
            // How close this dot's page is to the centre: 1 when on it
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [DOT, PILL, DOT],
              extrapolate: 'clamp',
            });
            const backgroundColor = scrollX.interpolate({
              inputRange,
              outputRange: [colors.textSubtle, colors.navy, colors.textSubtle],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={banner.id}
                style={[styles.dot, { width: dotWidth, backgroundColor }]}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const DOT = ms(7);
const PILL = ms(24);

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  card: {
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
    boxShadow: '0px 10px 24px rgba(11,29,58,0.12)',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(6),
  },
  dot: {
    height: DOT,
    borderRadius: DOT / 2,
  },
});

export default BannerCarousel;
