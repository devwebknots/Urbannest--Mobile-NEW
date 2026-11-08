/**
 * InspectionScreen: move-in inspection, opened from the "Inspection" tile on
 * the Check-In checklist. Same shell as Check-In: parallax glass hero,
 * rounded sheet and a floating top bar that turns solid on scroll.
 * Sheet: "Property Readiness" checklist of areas + "Finalize Inspection",
 * which returns to Check-In and ticks the Inspection tile there.
 */

import React, { useRef } from 'react';
import { Animated, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { SectionHeader } from '@/features/guest/components/SectionHeader';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';
import { renterAssets } from '../assets/renterAssets';
import { Reveal } from '../components/Reveal';
import { InspectionAreaList } from '../components/checkin/InspectionAreaList';
import { DetailTopBar } from '../components/dashboard/DetailTopBar';
import { ResidenceHero } from '../components/dashboard/ResidenceHero';
import { InspectionNavigation, useInspection } from '../hooks/useInspection';

interface Props {
  navigation?: InspectionNavigation;
  route?: { params?: { residenceId?: string } };
}

const SHEET_OVERLAP = ms(30);

export const InspectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useInspection(route?.params?.residenceId, navigation);
  const scrollY = useRef(new Animated.Value(0)).current;

  const heroHeight = Math.round(width * 0.92);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
      >
        <ResidenceHero
          image={renterAssets.inspectionHero}
          name="Move-In Inspection"
          street={vm.residence.street}
          city={vm.residence.city}
          statusLabel={vm.residence.unit}
          primaryPill={vm.residence.name}
          eyebrow=""
          // Same font as the residence pages' title, smaller (26)
          nameStyle={typographyPresets.heroTitleCompact}
          // Secondary blue (#518EF9) glass at 20% instead of white frost
          glassTint={`${colors.headerGradientEnd}33`}
          compact
          firstName={vm.profile.firstName}
          width={width}
          height={heroHeight}
          sheetOverlap={SHEET_OVERLAP}
          scrollY={scrollY}
          glass
        />

        <View style={styles.sheet}>
          {/* Soft fade from the glass into the page (same as Check-In) */}
          <View pointerEvents="none" style={styles.fade}>
            <Scrim edge="bottom" extent={1} maxOpacity={1} color={colors.pageTint} />
          </View>
          <View pointerEvents="none" style={styles.sheetFill} />

          <Reveal delay={80}>
            <SectionHeader
              title="Property Readiness"
              subtitle="Walk through each area and confirm it's in good condition."
            />
            <View style={styles.sectionBody}>
              <InspectionAreaList
                areas={vm.areas}
                confirmed={vm.confirmed}
                done={vm.done}
                total={vm.total}
                canSubmit={vm.canSubmit}
                onToggle={vm.toggleArea}
                onSubmit={vm.finalize}
              />
            </View>
          </Reveal>
        </View>
      </Animated.ScrollView>

      <DetailTopBar
        topInset={insets.top}
        title="Inspection"
        initials={vm.profile.initials}
        scrollY={scrollY}
        solidAt={heroHeight - SHEET_OVERLAP - insets.top - ms(60)}
        onBack={vm.back}
        onProfilePress={vm.openProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  sheet: {
    marginTop: -SHEET_OVERLAP,
    paddingTop: SHEET_OVERLAP + spacing.xxl,
    backgroundColor: 'transparent',
  },
  sheetFill: {
    position: 'absolute',
    top: SHEET_OVERLAP,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.pageTint,
  },
  fade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SHEET_OVERLAP,
  },
  sectionBody: {
    marginTop: spacing.lg,
  },
});

export default InspectionScreen;
