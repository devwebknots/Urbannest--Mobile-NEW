/**
 * Hero: swipeable house photos (already navy-graded in the design export),
 * with the header (logo + burger button that opens the side menu), headline,
 * Explore button and page dots on top.
 * Auto-advances every AUTO_MS and loops; a swipe resets the timer.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { HeaderBrand } from '@/components/BrandLogo';
import { Button } from '@/components/Button';
import {
  borderRadius,
  colors,
  spacing,
  typographyPresets,
} from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';
import { GUEST_IMAGE_ASPECT } from '../assets/guestAssets';
import { ArrowRightIcon } from './GuestIcons';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

/** Time each slide stays before moving on */
const AUTO_MS = 5000;
/** Bottom share of the hero that fades into the page */
const SCRIM_EXTENT = 0.22;
/** How far the search card overlaps the hero (GuestHomeScreen searchWrap) */
const SEARCH_OVERLAP = ms(28);
const DOT = ms(6);
/** Inner padding of the dark pill behind the dots */
const DOTS_PAD = ms(6);

interface Props {
  images: ImageSourcePropType[];
  topInset: number;
  /** Burger button: opens the side menu (GuestSideMenu) */
  onMenuPress: () => void;
  onExplorePress: () => void;
}

export const HeroSection: React.FC<Props> = ({
  images,
  topInset,
  onMenuPress,
  onExplorePress,
}) => {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const dragging = useRef(false);
  // Show the whole design image; never shorter than the content needs
  const height = Math.max(width / GUEST_IMAGE_ASPECT.hero, ms(360) + topInset);
  // Dots sit low, just above the search card overlap (on a dark pill so
  // they stay visible over the fade)
  const dotsBottom = SEARCH_OVERLAP + spacing.md;

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragging.current = false;
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  // Auto-slide: restarts whenever the slide changes (also after a swipe)
  useEffect(() => {
    if (IS_TEST || images.length < 2) {
      return;
    }
    const timer = setTimeout(() => {
      if (dragging.current) {
        return;
      }
      const next = (index + 1) % images.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      // Android may not fire momentum end for programmatic scrolls
      setIndex(next);
    }, AUTO_MS);
    return () => clearTimeout(timer);
  }, [index, images.length, width]);

  return (
    <View style={[styles.root, { height }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onScrollBeginDrag={() => {
          dragging.current = true;
        }}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        style={StyleSheet.absoluteFill}
      >
        {images.map((source, i) => (
          <Image
            key={i}
            source={source}
            style={{ width, height }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <Scrim
        edge="bottom"
        extent={SCRIM_EXTENT}
        maxOpacity={1}
        color={colors.pageTint}
      />

      <View
        pointerEvents="box-none"
        style={[
          styles.content,
          {
            paddingTop: topInset + spacing.md,
            paddingBottom: dotsBottom + DOT + DOTS_PAD * 2 + spacing.lg,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.brand} pointerEvents="none">
            <HeaderBrand />
          </View>
          {/* Search icon removed from the header for now
          <Pressable
            onPress={onSearchPress}
            hitSlop={8}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <SearchIcon size={ms(20)} color={colors.white} />
          </Pressable>
          */}
          {/* Opens the side menu (Log In / Sign Up and more) */}
          <Pressable
            onPress={onMenuPress}
            hitSlop={8}
            style={styles.menuButton}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <BurgerIcon size={ms(18)} color={colors.white} />
          </Pressable>
        </View>

        {/* Headline + Explore button, centered between header and dots */}
        <View pointerEvents="box-none" style={styles.middle}>
          <View pointerEvents="none">
            <Text style={typographyPresets.heroTitle}>Finding New</Text>
            <View style={styles.titleLine}>
              <Text style={typographyPresets.heroTitle}>Home is </Text>
              <View>
                {/* Slanted with a skew so it stays in Playfair (there is no
                  Playfair italic file; fontStyle italic can fall back to
                  the system font) */}
                <Text
                  style={[typographyPresets.heroAccent, styles.titleAccent]}
                >
                  Simple
                </Text>
                <View style={styles.accentUnderline} />
              </View>
            </View>
            {/* Subtitle hidden for now
          <Text style={[typographyPresets.heroSubtitle, styles.subtitle]}>
            Find your perfect home, all in one place.{'\n'}Discover a space that
            feels like yours.
          </Text>
          */}
          </View>

          <Button
            title="Explore Homes"
            variant="light"
            size="md"
            onPress={onExplorePress}
            rightIcon={<ArrowRightIcon size={ms(16)} color={colors.navy} />}
            style={styles.exploreButton}
          />
        </View>

        {/* Page dots, centered, just above the fade into the page */}
        <View
          pointerEvents="none"
          style={[styles.dots, { bottom: dotsBottom }]}
        >
          <View style={styles.dotsPill}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

/** Three-line menu icon */
const BurgerIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => {
  const bar = {
    height: Math.max(2, size * 0.12),
    borderRadius: size * 0.06,
    backgroundColor: color,
  };
  return (
    <View style={[styles.burger, { width: size, height: size * 0.78 }]}>
      <View style={[bar, { width: size }]} />
      <View style={[bar, { width: size }]} />
      <View style={[bar, { width: size * 0.7 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.headerDarkBlue,
    overflow: 'hidden',
  },
  content: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: spacing.screenHorizontal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Same frosted look the Log In pill had
  menuButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  burger: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  // Italic look without an italic font file
  titleAccent: {
    transform: [{ skewX: '-10deg' }],
  },
  accentUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: ms(3),
    height: 3,
    backgroundColor: colors.heroAccentUnderline,
  },
  subtitle: {
    marginTop: spacing.md,
  },
  exploreButton: {
    marginTop: spacing.xl,
    alignSelf: 'flex-start',
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: DOTS_PAD * 1.6,
    paddingVertical: DOTS_PAD,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(11, 29, 58, 0.32)',
  },
  dot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  dotActive: {
    width: ms(16),
    backgroundColor: colors.white,
  },
});

export default HeroSection;
