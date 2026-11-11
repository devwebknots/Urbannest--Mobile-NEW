/**
 * PropertyGallery: top of the property details page.
 *  - full-width photo slider (swipe), soft fade into the page at the bottom
 *  - round white back / favourite / share buttons on the photo
 *  - "Premium" pill (bottom left) and "1 / 5" counter (bottom right)
 *  - thumbnail strip under the photo: tap to jump; the current photo is
 *    full strength and the others are dimmed (no selected stroke)
 *  - photos slide on their own every 4 s (loops; waits while swiping,
 *    restarts after a swipe or thumbnail tap)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
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
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { CircleIconButton } from '@/features/renter/components/CircleIconButton';
import { HeartIcon } from '../GuestIcons';
import { PremiumPill } from './PremiumPill';
import { PropertyIcon } from './PropertyIcon';

interface Props {
  images: ImageSourcePropType[];
  topInset: number;
  premium: boolean;
  favorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
}

/** Photo height as a share of the screen width */
const HERO_RATIO = 0.62;
const THUMBS_VISIBLE = 5;
const THUMB_GAP = spacing.sm;
/** Time each photo stays before sliding to the next */
const AUTO_MS = 4000;

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

export const PropertyGallery: React.FC<Props> = ({
  images,
  topInset,
  premium,
  favorite,
  onBack,
  onToggleFavorite,
  onShare,
}) => {
  const { width } = useWindowDimensions();
  const heroH = Math.round(width * HERO_RATIO) + topInset;
  const thumbW = Math.floor(
    (width - spacing.screenHorizontal * 2 - THUMB_GAP * (THUMBS_VISIBLE - 1)) / THUMBS_VISIBLE,
  );
  const thumbH = Math.round(thumbW * 0.68);

  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<ImageSourcePropType>>(null);
  const dragging = useRef(false);
  // Bumped after every swipe / tap so the auto-slide timer starts over
  const [touch, setTouch] = useState(0);

  const onSettle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragging.current = false;
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
    setTouch(t => t + 1);
  };

  const jumpTo = (i: number) => {
    setIndex(i);
    setTouch(t => t + 1);
    listRef.current?.scrollToOffset({ offset: i * width, animated: true });
  };

  // Auto-slide to the next photo (back to the first after the last);
  // waits while the user is swiping
  useEffect(() => {
    if (IS_TEST || images.length < 2) {
      return;
    }
    const timer = setTimeout(() => {
      if (dragging.current) {
        return;
      }
      const next = (index + 1) % images.length;
      listRef.current?.scrollToOffset({ offset: next * width, animated: true });
      // Android may not fire momentum end for programmatic scrolls
      setIndex(next);
    }, AUTO_MS);
    return () => clearTimeout(timer);
  }, [index, touch, images.length, width]);

  return (
    <View>
      <View style={{ height: heroH }}>
        <FlatList
          ref={listRef}
          data={images}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => {
            dragging.current = true;
          }}
          onMomentumScrollEnd={onSettle}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          renderItem={({ item }) => (
            <Image source={item} style={{ width, height: heroH }} resizeMode="cover" />
          )}
        />

        {/* Keeps the status bar readable, then melts into the page */}
        <View pointerEvents="none" style={[styles.topScrim, { height: topInset + ms(70) }]} />
        <View pointerEvents="none" style={styles.bottomFade} />

        <View style={[styles.topBar, { top: topInset + spacing.sm }]}>
          <CircleIconButton
            variant="solid"
            size={BTN}
            onPress={onBack}
            accessibilityLabel="Back"
            icon={<PropertyIcon name="arrowLeft" size={ms(20)} color={colors.navy} />}
          />
          <View style={styles.topRight}>
            <CircleIconButton
              variant="solid"
              size={BTN}
              onPress={onToggleFavorite}
              accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
              icon={
                <HeartIcon
                  size={ms(19)}
                  color={favorite ? colors.favorite : colors.navy}
                  filled={favorite}
                />
              }
            />
            <CircleIconButton
              variant="solid"
              size={BTN}
              onPress={onShare}
              accessibilityLabel="Share"
              icon={<PropertyIcon name="share" size={ms(18)} color={colors.navy} />}
            />
          </View>
        </View>

        <View style={styles.bottomBar} pointerEvents="none">
          {premium ? <PremiumPill size="lg" /> : <View />}
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {index + 1} / {images.length}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbs}
      >
        {images.map((img, i) => (
          <Pressable
            key={i}
            onPress={() => jumpTo(i)}
            accessibilityRole="button"
            accessibilityLabel={`Photo ${i + 1} of ${images.length}`}
            accessibilityState={{ selected: i === index }}
            style={({ pressed }) => [
              styles.thumb,
              { width: thumbW, height: thumbH },
              i !== index && styles.thumbDim,
              pressed && styles.pressed,
            ]}
          >
            <Image source={img} style={{ width: thumbW, height: thumbH }} resizeMode="cover" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const BTN = ms(42);

const styles = StyleSheet.create({
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundImage: 'linear-gradient(180deg, rgba(4, 11, 35, 0.35) 0%, rgba(4, 11, 35, 0) 100%)',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: ms(36),
    backgroundImage: `linear-gradient(180deg, rgba(238, 243, 249, 0) 0%, ${colors.pageTint} 100%)`,
  },
  topBar: {
    position: 'absolute',
    left: spacing.screenHorizontal,
    right: spacing.screenHorizontal,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRight: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    left: spacing.screenHorizontal,
    right: spacing.screenHorizontal,
    bottom: ms(36) + spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    height: ms(28),
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  counterText: {
    ...typographyPresets.badge,
    fontSize: scaleFont(11.5),
    color: colors.navy,
  },
  thumbs: {
    gap: THUMB_GAP,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xs,
  },
  thumb: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.chipBlue,
  },
  thumbDim: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});

export default PropertyGallery;
