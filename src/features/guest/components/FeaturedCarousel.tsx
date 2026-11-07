/**
 * FeaturedCarousel: snapping, wide property cards with a video tour.
 * The centered card is full size; the neighbours peek in from both sides,
 * slightly smaller. It slides to the next card every AUTO_MS (paused while
 * the user drags). The centered card and both neighbours keep their videos
 * loaded and playing, so a card is already playing when it slides in.
 * The items repeat (LOOPS copies, starting mid-list) so the carousel feels
 * endless and the first card never leaves an empty gap on the left.
 *
 * Card: video (or photo) fills the whole card. On top: the Exclusive badge
 * and a glass heart button; at the bottom a frosted glass panel with the
 * type, price, address and bed / bath / area.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Video, { ViewType } from 'react-native-video';
import { MapPinIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { FeaturedProperty } from '../types';
import {
  AreaIcon,
  BathIcon,
  BedIcon,
  HeartIcon,
  StarGlyph,
} from './GuestIcons';

interface Props {
  items: FeaturedProperty[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

const GAP = ms(12);
/** Time each card stays centered before auto-sliding to the next */
const AUTO_MS = 4500;
/** Cards this far from the center keep a video loaded (0 = center only) */
const VIDEO_RANGE = 1;
/** The list repeats this many times so there is always a card on both sides */
const LOOPS = 40;
/** Card height as a multiple of its width (portrait, room for the glass panel) */
const CARD_RATIO = 1.22;

// Glass panel colors (frosted white over a dark scrim)
const GLASS = {
  fill: 'rgba(255, 255, 255, 0.16)',
  border: 'rgba(255, 255, 255, 0.38)',
  divider: 'rgba(255, 255, 255, 0.25)',
  textSoft: 'rgba(255, 255, 255, 0.82)',
  accent: '#BFDBFE',
};

export const FeaturedCarousel: React.FC<Props> = ({
  items,
  favorites,
  onToggleFavorite,
}) => {
  const { width } = useWindowDimensions();
  // Narrow enough that both neighbours clearly peek in
  const cardWidth = Math.min(width * 0.74, 340);
  const cardHeight = cardWidth * CARD_RATIO;
  const interval = cardWidth + GAP;
  const sidePad = (width - cardWidth) / 2;
  const scrollX = useRef(new Animated.Value(0)).current;
  // Endless feel: repeat the items and start in the middle copy, on its
  // second card, so a neighbour always peeks in on the left and the right
  const data = useMemo(
    () =>
      Array.from({ length: LOOPS }, (_, copy) =>
        items.map(item => ({ item, copy })),
      ).flat(),
    [items],
  );
  const startIndex =
    items.length * Math.floor(LOOPS / 2) + Math.min(1, items.length - 1);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const listRef = useRef<FlatList>(null);
  const dragging = useRef(false);

  const onSettle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragging.current = false;
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / interval));
  };

  // Auto-slide: restarts whenever the centered card changes (also after a swipe)
  useEffect(() => {
    if (IS_TEST || items.length < 2) {
      return;
    }
    const timer = setTimeout(() => {
      if (dragging.current) {
        return;
      }
      let current = activeIndex;
      // Near the end of the repeated list: jump (invisibly) to the same
      // card in the middle copy so it can keep going forever
      if (current >= data.length - items.length - 1) {
        current =
          startIndex +
          ((((current - startIndex) % items.length) + items.length) %
            items.length);
        listRef.current?.scrollToOffset({
          offset: current * interval,
          animated: false,
        });
      }
      const next = current + 1;
      listRef.current?.scrollToOffset({
        offset: next * interval,
        animated: true,
      });
      // Android may not fire momentum end for programmatic scrolls
      setActiveIndex(next);
    }, AUTO_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, data.length, interval, items.length, startIndex]);

  return (
    <Animated.FlatList
      ref={listRef}
      data={data}
      keyExtractor={entry => `${entry.copy}-${entry.item.id}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={interval}
      decelerationRate="fast"
      initialScrollIndex={startIndex}
      getItemLayout={(_, index) => ({
        length: interval,
        offset: interval * index,
        index,
      })}
      contentContainerStyle={{ paddingHorizontal: sidePad - GAP / 2 }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
          useNativeDriver: true,
        },
      )}
      onScrollBeginDrag={() => {
        dragging.current = true;
      }}
      onMomentumScrollEnd={onSettle}
      scrollEventThrottle={16}
      initialNumToRender={3}
      windowSize={5}
      extraData={activeIndex}
      renderItem={({ item: { item }, index }) => {
        const input = [
          (index - 1) * interval,
          index * interval,
          (index + 1) * interval,
        ];
        const scale = scrollX.interpolate({
          inputRange: input,
          outputRange: [0.92, 1, 0.92],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange: input,
          outputRange: [0.8, 1, 0.8],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={{
              width: interval,
              paddingHorizontal: GAP / 2,
              opacity,
              transform: [{ scale }],
            }}
          >
            <FeaturedCard
              item={item}
              width={cardWidth}
              height={cardHeight}
              loadVideo={Math.abs(index - activeIndex) <= VIDEO_RANGE}
              favorite={favorites.has(item.id)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
            />
          </Animated.View>
        );
      }}
    />
  );
};

const formatSqft = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const FeaturedCard: React.FC<{
  item: FeaturedProperty;
  width: number;
  height: number;
  /** Keep this card's video loaded and playing (center + neighbours) */
  loadVideo: boolean;
  favorite: boolean;
  onToggleFavorite: () => void;
}> = ({ item, width, height, loadVideo, favorite, onToggleFavorite }) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = loadVideo && !!item.video && !videoFailed;
  // Video stays invisible (poster shows) until its first frame is ready,
  // then fades in: no black frame while it loads
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!showVideo) {
      fade.setValue(0);
    }
  }, [fade, showVideo]);
  const onReady = () =>
    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

  return (
    <View style={[styles.cardShadow, { width, height }]}>
      <View style={styles.card}>
        {/* Poster photo: shows until the video's first frame is ready */}
        <Image
          source={item.image}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {showVideo && (
          // "cover" makes the video view much wider than the card. This clip
          // crops it to the card. Needs the TextureView patch in
          // patches/react-native-video+6.19.3.patch: the library's default
          // SurfaceView ignores clipping and opacity on Android.
          <Animated.View style={[styles.videoClip, { opacity: fade }]}>
            <Video
              source={item.video!}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              // TextureView respects the card's rounded clip and fade on Android
              viewType={ViewType.TEXTURE}
              muted
              repeat
              paused={false}
              controls={false}
              playInBackground={false}
              disableFocus
              ignoreSilentSwitch="obey"
              shutterColor="transparent"
              onReadyForDisplay={onReady}
              onError={() => setVideoFailed(true)}
            />
          </Animated.View>
        )}

        {/* Darken top and bottom so badges and glass text stay readable */}
        <Scrim edge="top" extent={0.3} maxOpacity={0.45} />
        <Scrim edge="bottom" extent={0.6} maxOpacity={0.8} />

        <View style={styles.badge}>
          <StarGlyph size={scaleFont(10)} color={colors.gold} />
          <Text style={styles.badgeText}>Exclusive</Text>
        </View>
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          style={({ pressed }) => [styles.heart, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          <HeartIcon
            size={ms(17)}
            color={favorite ? colors.favorite : colors.white}
            filled={favorite}
          />
        </Pressable>

        {item.video && (
          <View style={styles.tourPill}>
            <View style={styles.playTriangle} />
            <Text style={styles.tourText}>Video Tour</Text>
          </View>
        )}

        {/* Frosted glass details panel */}
        <View style={styles.glass}>
          <Text style={styles.type}>{item.type}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.period}>{item.period}</Text>
          </View>
          <View style={styles.addressRow}>
            <MapPinIcon size={ms(12)} color={GLASS.textSoft} />
            <Text style={styles.address} numberOfLines={1}>
              {item.address}
            </Text>
          </View>

          <View style={styles.stats}>
            <Stat
              icon={<BedIcon size={ms(15)} color={colors.white} />}
              label={`${item.beds} Bed`}
            />
            <View style={styles.statDivider} />
            <Stat
              icon={<BathIcon size={ms(15)} color={colors.white} />}
              label={`${item.baths} Bath`}
            />
            <View style={styles.statDivider} />
            <Stat
              icon={<AreaIcon size={ms(15)} color={colors.white} />}
              label={`${formatSqft(item.sqft)} Sq Ft`}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <View style={styles.stat}>
    {icon}
    <Text style={styles.statText} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const HEART = ms(36);
const PLAY = ms(7);

const styles = StyleSheet.create({
  // boxShadow, not elevation: Android's elevation shadow ignores the
  // carousel's fade and shows through the faded side cards as a grey band.
  // It sits on an outer view so the card's overflow clip doesn't cut it off.
  cardShadow: {
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.headerDarkBlue,
    boxShadow: '0px 8px 20px rgba(11, 29, 58, 0.18)',
  },
  card: {
    flex: 1,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.headerDarkBlue,
    overflow: 'hidden',
  },
  // Exactly the card's size and shape; clips the oversized video view
  videoClip: {
    ...StyleSheet.absoluteFill,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: ms(26),
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.goldBadgeBg,
  },
  badgeText: {
    ...typographyPresets.badge,
    color: colors.white,
    letterSpacing: 0.3,
  },
  // Glass circle instead of the old solid white button
  heart: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: HEART,
    height: HEART,
    borderRadius: HEART / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: GLASS.border,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
  },
  tourPill: {
    position: 'absolute',
    top: spacing.md + ms(26) + spacing.sm,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    height: ms(24),
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: GLASS.border,
    backgroundColor: GLASS.fill,
  },
  // Small "play" triangle made from borders
  playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: PLAY / 2,
    borderBottomWidth: PLAY / 2,
    borderLeftWidth: PLAY,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
  },
  tourText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  glass: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: GLASS.border,
    backgroundColor: GLASS.fill,
  },
  type: {
    ...typographyPresets.eyebrow,
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(10.5),
    color: GLASS.accent,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  price: {
    ...typographyPresets.price,
    fontSize: scaleFont(20),
    lineHeight: scaleFont(26),
    color: colors.white,
  },
  period: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12),
    marginLeft: spacing.xs,
    color: GLASS.textSoft,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  address: {
    flex: 1,
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11.5),
    color: GLASS.textSoft,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: GLASS.divider,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(5),
  },
  statDivider: {
    width: 1,
    height: ms(14),
    backgroundColor: GLASS.divider,
  },
  statText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(11.5),
    color: colors.white,
  },
});

export default FeaturedCarousel;
