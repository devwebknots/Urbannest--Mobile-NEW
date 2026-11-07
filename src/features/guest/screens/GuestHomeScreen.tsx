/**
 * GuestHomeScreen: first screen after the splash. Lets visitors browse
 * featured homes, nearby rentals, guides and cities before signing in.
 */

import React, { useRef, useState } from 'react';
import {
  ScrollView,
  ScrollViewInstance,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { CategoryRow } from '../components/CategoryRow';
import { CitiesSection } from '../components/CitiesSection';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { ArrowRightIcon } from '../components/GuestIcons';
import { GuidesSection } from '../components/GuidesSection';
import { GuestMenuKey, GuestSideMenu } from '../components/GuestSideMenu';
import { HeroSection } from '../components/HeroSection';
import { OrbitlListeningOverlay } from '../components/OrbitlListeningOverlay';
import { RentalCard } from '../components/RentalCard';
import { SearchCard } from '../components/SearchCard';
import { CenteredHeader, SectionHeader } from '../components/SectionHeader';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the hidden trust section
import { TrustBar } from '../components/TrustBar';
import {
  BUY_FILTERS,
  CATEGORIES,
  FEATURED_GUIDE,
  FEATURED_PROPERTIES,
  GUIDES,
  HERO_IMAGES,
  ORBITL_PROMPTS,
  RENTALS_NEAR_YOU,
  SEARCH_FILTERS,
  TOP_CITIES,
} from '../constants';
import { GuestNavigation, useGuestHome } from '../hooks/useGuestHome';

interface Props {
  navigation?: GuestNavigation;
}

export const GuestHomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const vm = useGuestHome(navigation);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const searchY = useRef(0);
  // Full-screen Orbitl AI listening view
  const [orbitlListening, setOrbitlListening] = useState(false);

  // Right-side menu opened by the hero burger button
  const [menuOpen, setMenuOpen] = useState(false);
  // Section positions, for menu shortcuts
  const sectionY = useRef<Record<'featured' | 'guides' | 'cities', number>>({
    featured: 0,
    guides: 0,
    cities: 0,
  });

  const scrollToY = (y: number) =>
    scrollRef.current?.scrollTo({
      y: Math.max(0, y - insets.top),
      animated: true,
    });
  const scrollToSearch = () => scrollToY(searchY.current);

  const onMenuSelect = (key: GuestMenuKey) => {
    switch (key) {
      case 'login':
      // Both start with the persona picker; split when sign-up has its own flow
      case 'register':
        vm.goToSignIn();
        break;
      case 'home':
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        break;
      case 'search':
        scrollToSearch();
        break;
      case 'rent':
      case 'buy':
        vm.setMode(key);
        scrollToSearch();
        break;
      case 'featured':
      case 'guides':
      case 'cities':
        scrollToY(sectionY.current[key]);
        break;
      default:
        // help / about / terms: screens not built yet
        break;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.sectionGap,
        }}
      >
        <HeroSection
          images={HERO_IMAGES}
          topInset={insets.top}
          onMenuPress={() => setMenuOpen(true)}
          onExplorePress={scrollToSearch}
        />

        <View
          style={styles.searchWrap}
          onLayout={e => {
            searchY.current = e.nativeEvent.layout.y;
          }}
        >
          <SearchCard
            mode={vm.mode}
            onModeChange={vm.setMode}
            filters={vm.mode === 'buy' ? BUY_FILTERS : SEARCH_FILTERS}
            onSearch={() => {}}
            onTalkToOrbitl={() => setOrbitlListening(true)}
          />
        </View>

        <View style={styles.section}>
          <CategoryRow categories={CATEGORIES} />
        </View>

        <View
          style={styles.section}
          onLayout={e => {
            sectionY.current.featured = e.nativeEvent.layout.y;
          }}
        >
          <CenteredHeader
            eyebrow="Featured Properties"
            title="Most Exclusive Homes Just For You"
            description="Discover a hand-picked collection of luxurious residences tailored to your lifestyle — where elegance, comfort, and exclusivity come together."
          />
          <View style={styles.carousel}>
            <FeaturedCarousel
              items={FEATURED_PROPERTIES}
              favorites={vm.favorites}
              onToggleFavorite={vm.toggleFavorite}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Rentals Near You"
            subtitle="Browse nearby options tailored to your location."
            // Sort filter hidden for now
            // action={{ label: 'Newest', variant: 'dropdown' }}
          />
          <View style={styles.list}>
            {RENTALS_NEAR_YOU.map(item => (
              <RentalCard
                key={item.id}
                item={item}
                favorite={vm.favorites.has(item.id)}
                onToggleFavorite={() => vm.toggleFavorite(item.id)}
              />
            ))}
          </View>
          <Button
            title="See More Properties"
            variant="soft"
            size="md"
            rightIcon={<ArrowRightIcon size={ms(14)} color={colors.navy} />}
            style={styles.seeMore}
          />
        </View>

        <View
          style={styles.section}
          onLayout={e => {
            sectionY.current.guides = e.nativeEvent.layout.y;
          }}
        >
          <SectionHeader
            title="Resources & Guides"
            subtitle="Helpful ideas for renters, buyers and property owners."
            action={{ label: 'Explore Guides', variant: 'link' }}
          />
          <View style={styles.sectionBody}>
            <GuidesSection featured={FEATURED_GUIDE} guides={GUIDES} />
          </View>
        </View>

        <View
          style={styles.section}
          onLayout={e => {
            sectionY.current.cities = e.nativeEvent.layout.y;
          }}
        >
          <SectionHeader title="Explore Real Estate In Popular Cities" />
          <View style={styles.sectionBody}>
            <CitiesSection cities={TOP_CITIES} />
          </View>
        </View>

        {/* Trust section hidden for now — uncomment to bring it back
        <View style={styles.section}>
          <TrustBar />
        </View>
        */}
      </ScrollView>

      <GuestSideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={onMenuSelect}
      />

      <OrbitlListeningOverlay
        visible={orbitlListening}
        prompts={ORBITL_PROMPTS}
        onClose={() => setOrbitlListening(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  searchWrap: {
    marginTop: -ms(28),
  },
  section: {
    marginTop: spacing.sectionGap,
  },
  sectionBody: {
    marginTop: spacing.lg,
  },
  carousel: {
    marginTop: spacing.xl,
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  seeMore: {
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
});

export default GuestHomeScreen;
