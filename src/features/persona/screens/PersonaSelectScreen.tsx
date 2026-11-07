/**
 * PersonaSelectScreen: shown after the splash. A blurred photo backdrop
 * that cross-fades with the centered card, a snapping persona carousel,
 * page dots, and a single continue button.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography, typographyPresets } from '@/config/theme';
import { PaginationDots } from '../components/PaginationDots';
import { PersonaCarousel } from '../components/PersonaCarousel';
import { Scrim } from '../components/Scrim';
import { PERSONA_LAYOUT } from '../constants';
import {
  PersonaNavigation,
  usePersonaSelection,
} from '../hooks/usePersonaSelection';
import type { PersonaSlide } from '../types';

interface Props {
  navigation?: PersonaNavigation;
}

export const PersonaSelectScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const vm = usePersonaSelection(navigation);

  const cardWidth = Math.min(
    width * PERSONA_LAYOUT.cardWidthRatio,
    PERSONA_LAYOUT.cardMaxWidth,
  );
  const cardHeight = Math.min(
    cardWidth * PERSONA_LAYOUT.cardAspect,
    height * PERSONA_LAYOUT.cardMaxHeightRatio,
  );
  const itemWidth = cardWidth + PERSONA_LAYOUT.cardGap;

  const scrollX = useRef(new Animated.Value(0)).current;

  // Entrance: header drops in, carousel and button rise
  const intro = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 750,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [intro]);
  const rise = (from: number) => ({
    opacity: intro,
    transform: [
      {
        translateY: intro.interpolate({
          inputRange: [0, 1],
          outputRange: [from, 0],
        }),
      },
    ],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <Backdrop slides={vm.slides} scrollX={scrollX} itemWidth={itemWidth} />

      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.xxl },
          rise(-14),
        ]}
      >
        <Text style={styles.brand}>URBANNEST</Text>
        <Text style={styles.title}>Choose your persona</Text>
        <Text style={[styles.subtitle, { maxWidth: cardWidth + 24 }]}>
          Select a profile to continue to your personalised dashboard and
          portal.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.carouselArea, rise(36)]}>
        <PersonaCarousel
          slides={vm.slides}
          scrollX={scrollX}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          activeIndex={vm.activeIndex}
          onIndexChange={vm.setActiveIndex}
          onSelect={vm.select}
        />
        <View style={styles.dots}>
          <PaginationDots
            count={vm.slides.length}
            scrollX={scrollX}
            itemWidth={itemWidth}
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + spacing.xl },
          rise(40),
        ]}
      >
        <Pressable
          onPress={vm.onContinue}
          accessibilityRole="button"
          accessibilityLabel={vm.ctaLabel}
          style={({ pressed }) => [
            styles.cta,
            { width: cardWidth },
            pressed && styles.ctaPressed,
          ]}
        >
          <Text style={styles.ctaText} numberOfLines={1}>
            {vm.ctaLabel}
          </Text>
          <View style={styles.ctaArrow}>
            <ChevronRightIcon size={14} color={colors.white} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

/** Blurred photo of each slide, cross-fading as the carousel moves. */
const Backdrop: React.FC<{
  slides: readonly PersonaSlide[];
  scrollX: Animated.Value;
  itemWidth: number;
}> = ({ slides, scrollX, itemWidth }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {slides.map((slide, i) => {
      const opacity = scrollX.interpolate({
        inputRange: [(i - 1) * itemWidth, i * itemWidth, (i + 1) * itemWidth],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      });
      return (
        <Animated.Image
          key={i}
          source={slide.kind === 'add' ? slide.image : slide.persona.image}
          blurRadius={24}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, styles.backdropImage, { opacity }]}
        />
      );
    })}
    <View style={styles.backdropTint} />
    <Scrim edge="top" extent={0.35} maxOpacity={0.7} />
    <Scrim edge="bottom" extent={0.3} maxOpacity={0.8} />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.headerDarkBlue,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.74)',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  brand: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: 3,
    color: colors.subtitlePeriwinkle,
    textAlign: 'center',
  },
  // Page headline: same Playfair style as the guest hero
  title: {
    ...typographyPresets.heroTitle,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    color: 'rgba(199,210,254,0.8)',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  carouselArea: {
    flex: 1,
    justifyContent: 'center',
  },
  dots: {
    marginTop: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  cta: {
    height: 56,
    borderRadius: borderRadius.button,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  ctaPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.headerDarkBlue,
    letterSpacing: 0.2,
  },
  ctaArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerDarkBlue,
  },
});

export default PersonaSelectScreen;
