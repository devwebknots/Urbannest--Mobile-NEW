/**
 * Hero: swipeable house photos (already navy-graded in the design export),
 * with the header, headline, Explore button and page dots on top.
 */

import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { HomeIcon, SearchIcon, UserIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { GUEST_IMAGE_ASPECT } from '../assets/guestAssets';
import { ArrowRightIcon } from './GuestIcons';

interface Props {
  images: ImageSourcePropType[];
  topInset: number;
  onLoginPress: () => void;
  onSearchPress: () => void;
  onExplorePress: () => void;
}

export const HeroSection: React.FC<Props> = ({
  images,
  topInset,
  onLoginPress,
  onSearchPress,
  onExplorePress,
}) => {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  // Show the whole design image; never shorter than the content needs
  const height = Math.max(width / GUEST_IMAGE_ASPECT.hero, ms(360) + topInset);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View style={[styles.root, { height }]}>
      <ScrollView
        horizontal
        pagingEnabled
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

      <Scrim edge="bottom" extent={0.22} maxOpacity={1} color={colors.pageTint} />

      <View
        pointerEvents="box-none"
        style={[styles.content, { paddingTop: topInset + spacing.md }]}
      >
        <View style={styles.header}>
          <View style={styles.brand} pointerEvents="none">
            <HomeIcon size={ms(26)} color={colors.primaryLight} />
            <Text style={styles.brandText}>Urban Nest</Text>
          </View>
          <Pressable
            onPress={onSearchPress}
            hitSlop={8}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <SearchIcon size={ms(20)} color={colors.white} />
          </Pressable>
          <Pressable
            onPress={onLoginPress}
            style={styles.loginPill}
            accessibilityRole="button"
          >
            <UserIcon size={ms(14)} color={colors.white} />
            <Text style={styles.loginText}>Log In / Sign Up</Text>
          </Pressable>
        </View>

        <View pointerEvents="none" style={styles.copy}>
          <Text style={typographyPresets.heroTitle}>Finding New</Text>
          <View style={styles.titleLine}>
            <Text style={typographyPresets.heroTitle}>Home is </Text>
            <View>
              <Text style={[typographyPresets.heroTitle, styles.titleAccent]}>
                Simple
              </Text>
              <View style={styles.accentUnderline} />
            </View>
          </View>
          <Text style={styles.subtitle}>
            Find your perfect home, all in one place.{'\n'}Discover a space that
            feels like yours.
          </Text>
        </View>

        <Pressable
          onPress={onExplorePress}
          style={styles.exploreButton}
          accessibilityRole="button"
        >
          <Text style={styles.exploreText}>Explore Homes</Text>
          <ArrowRightIcon size={ms(16)} color={colors.navy} />
        </Pressable>

        <View pointerEvents="none" style={styles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      </View>
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
  brandText: {
    marginLeft: spacing.sm,
    fontFamily: typography.fontFamily.heading.bold,
    fontSize: scaleFont(21),
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  iconButton: {
    padding: spacing.xs,
    marginRight: spacing.md,
  },
  loginPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: ms(7),
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  loginText: {
    marginLeft: spacing.xs + 2,
    fontFamily: typography.fontFamily.body.medium,
    fontSize: typography.fontSize.sm,
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  copy: {
    marginTop: ms(36),
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  titleAccent: {
    fontFamily: typography.fontFamily.heading.semiBold,
    fontStyle: 'italic',
    color: colors.heroAccent,
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
    fontFamily: typography.fontFamily.body.regular,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  exploreButton: {
    marginTop: spacing.xl,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    height: ms(44),
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
  },
  exploreText: {
    ...typographyPresets.button,
    color: colors.navy,
  },
  dots: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.xs + 2,
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
