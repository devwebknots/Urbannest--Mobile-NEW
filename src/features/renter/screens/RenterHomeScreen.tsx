/**
 * RenterHomeScreen: "My Residences" — the renter's landing page after
 * choosing the Renter persona. Navy header art with a faded house photo,
 * All / Active / Past segmented filter, residence cards and a floating
 * tab bar.
 */

import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { RENTER_HEADER_ASPECT, renterAssets } from '../assets/renterAssets';
import { RenterHeader } from '../components/RenterHeader';
import { RENTER_TAB_BAR_HEIGHT, RenterTabBar } from '../components/RenterTabBar';
import { ResidenceCard } from '../components/ResidenceCard';
import { ResidenceFilterBar } from '../components/ResidenceFilterBar';
import { Reveal } from '../components/Reveal';
import { RenterHomeNavigation, useRenterHome } from '../hooks/useRenterHome';
import { useRenterTabs } from '../hooks/useRenterTabs';

const comingSoon = (what: string) => Alert.alert(what, 'Coming soon.');

interface Props {
  navigation?: RenterHomeNavigation;
}

export const RenterHomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useRenterHome(navigation);
  const tabs = useRenterTabs();
  const cardWidth = width - spacing.screenHorizontal * 2;
  // Header art keeps its ratio; it fades into pageTint at the bottom,
  // so the page continues seamlessly below it.
  const headerArtHeight = Math.round(width / RENTER_HEADER_ASPECT);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            RENTER_TAB_BAR_HEIGHT + Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
      >
        <Image
          source={renterAssets.header}
          style={[styles.headerArt, { width, height: headerArtHeight }]}
          resizeMode="cover"
        />

        <RenterHeader
          topInset={insets.top}
          initials={vm.profile.initials}
          onProfilePress={() => comingSoon('Profile')}
        />

        <View style={styles.filter}>
          <Reveal delay={60}>
            <ResidenceFilterBar
              value={vm.filter}
              counts={vm.counts}
              onChange={vm.setFilter}
            />
          </Reveal>
        </View>

        <View style={styles.list}>
          {vm.residences.map((residence, i) => (
            <Reveal key={`${vm.filter}-${residence.id}`} delay={140 + i * 90}>
              <ResidenceCard
                residence={residence}
                width={cardWidth}
                onPress={() => vm.openResidence(residence)}
                onMenuPress={() => vm.openMenu(residence)}
              />
            </Reveal>
          ))}
          {vm.residences.length === 0 ? (
            <Text style={styles.empty}>No homes here yet.</Text>
          ) : null}
        </View>
      </ScrollView>

      <RenterTabBar
        active={tabs.tab}
        bottomInset={insets.bottom}
        hasAlerts={vm.profile.unreadAlerts > 0}
        onChange={tabs.onTabChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  headerArt: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  filter: {
    marginTop: spacing.xxl,
  },
  list: {
    marginTop: spacing.xxl,
    gap: spacing.section,
  },
  empty: {
    ...typographyPresets.caption,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default RenterHomeScreen;
