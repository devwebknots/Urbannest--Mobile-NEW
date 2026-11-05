/**
 * PersonaCarousel: snapping horizontal carousel. The centered card is full
 * size; neighbours shrink, drop and fade. All motion runs on the native driver.
 */

import React, { useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { PERSONA_LAYOUT } from '../constants';
import type { PersonaSlide } from '../types';
import { PersonaCard } from './PersonaCard';

interface Props {
  slides: readonly PersonaSlide[];
  scrollX: Animated.Value;
  cardWidth: number;
  cardHeight: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  /** Tap on the centered card */
  onSelect: (index: number) => void;
}

const P = PERSONA_LAYOUT.parallax;

export const PersonaCarousel: React.FC<Props> = ({
  slides,
  scrollX,
  cardWidth,
  cardHeight,
  activeIndex,
  onIndexChange,
  onSelect,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const itemWidth = cardWidth + PERSONA_LAYOUT.cardGap;
  const sidePadding = Math.max(0, (screenWidth - itemWidth) / 2);

  const listRef = useRef<FlatList<PersonaSlide>>(null);
  const lastIndex = useRef(activeIndex);

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
        listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const raw = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
          const index = Math.min(Math.max(raw, 0), slides.length - 1);
          if (index !== lastIndex.current) {
            lastIndex.current = index;
            onIndexChange(index);
          }
        },
      }),
    [scrollX, itemWidth, slides.length, onIndexChange],
  );

  const onCardPress = useCallback(
    (index: number) => {
      if (index === lastIndex.current) {
        onSelect(index);
      } else {
        listRef.current?.scrollToOffset({
          offset: index * itemWidth,
          animated: true,
        });
      }
    },
    [itemWidth, onSelect],
  );

  const renderItem: ListRenderItem<PersonaSlide> = ({ item, index }) => {
    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.88, 1, 0.88],
      extrapolate: 'clamp',
    });
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [cardHeight * 0.05, 0, cardHeight * 0.05],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.55, 1, 0.55],
      extrapolate: 'clamp',
    });
    const parallax = scrollX.interpolate({
      inputRange,
      outputRange: [-P, 0, P],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.item, { width: itemWidth }]}>
        <Animated.View
          style={[
            styles.shadow,
            { opacity, transform: [{ scale }, { translateY }] },
          ]}
        >
          <PersonaCard
            slide={item}
            width={cardWidth}
            height={cardHeight}
            isActive={index === activeIndex}
            parallax={parallax}
            onPress={() => onCardPress(index)}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <Animated.FlatList
      ref={listRef}
      data={slides}
      extraData={activeIndex}
      keyExtractor={slideKey}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={itemWidth}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      scrollEventThrottle={16}
      onScroll={onScroll}
      getItemLayout={(_, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      contentContainerStyle={{ paddingHorizontal: sidePadding }}
      style={[styles.list, { height: cardHeight * 1.06 }]}
    />
  );
};

function slideKey(slide: PersonaSlide): string {
  return slide.kind === 'add' ? 'add-persona' : slide.persona.id;
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 14,
    borderRadius: 28,
  },
});

export default PersonaCarousel;
