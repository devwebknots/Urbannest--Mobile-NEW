/**
 * CheckInScreen: move-in page for a "Move-In Ready" residence (opened from
 * "Check-In Now" on My Residences). Same shell as the residence dashboard:
 * parallax hero, rounded sheet and a floating top bar that turns solid on
 * scroll. Sheet: status card + digital key, move-in checklist + submit,
 * neighborhood highlights and the curated-living story.
 */

import React, { useRef } from 'react';
import { Animated, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/config/theme';
import { SectionHeader } from '@/features/guest/components/SectionHeader';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';
import { Reveal } from '../components/Reveal';
import { CheckInChecklist } from '../components/checkin/CheckInChecklist';
import { CheckInStatusCard } from '../components/checkin/CheckInStatusCard';
import { CuratedLivingCard } from '../components/checkin/CuratedLivingCard';
import { NeighborhoodCard } from '../components/checkin/NeighborhoodCard';
import { DetailTopBar } from '../components/dashboard/DetailTopBar';
import { ResidenceHero } from '../components/dashboard/ResidenceHero';
import { STATUS_LABEL } from '../constants';
import { CheckInNavigation, useCheckIn } from '../hooks/useCheckIn';

interface Props {
  navigation?: CheckInNavigation;
  route?: {
    params?: { residenceId?: string; inspectionSubmitted?: boolean; utilitiesConfirmed?: boolean };
  };
}

const SHEET_OVERLAP = ms(30);

export const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useCheckIn(
    route?.params?.residenceId,
    navigation,
    route?.params?.inspectionSubmitted,
    route?.params?.utilitiesConfirmed,
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  const cardWidth = width - spacing.screenHorizontal * 2;
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
          image={vm.residence.image}
          name={vm.residence.name}
          street={vm.residence.street}
          city={vm.residence.city}
          statusLabel={vm.residence.unit}
          primaryPill={STATUS_LABEL[vm.residence.status]}
          // eyebrow={`Almost home, ${vm.profile.firstName}`}
          eyebrow=""
          firstName={vm.profile.firstName}
          width={width}
          height={heroHeight}
          sheetOverlap={SHEET_OVERLAP}
          scrollY={scrollY}
          glass
        />

        <View style={styles.sheet}>
          {/* Soft fade from the glass into the page (like the guest hero) */}
          <View pointerEvents="none" style={styles.fade}>
            <Scrim edge="bottom" extent={1} maxOpacity={1} color={colors.pageTint} />
          </View>
          {/* Solid page below the fade: hides the photo as it drifts down on scroll */}
          <View pointerEvents="none" style={styles.sheetFill} />
          <Reveal delay={80}>
            <CheckInStatusCard summary={vm.summary} onAccessKey={vm.openKey} />
          </Reveal>

          <Reveal delay={160}>
            <View style={styles.section}>
              <SectionHeader
                title="Move-In Checklist"
                subtitle="Tick each item before you get your keys."
              />
              <View style={styles.sectionBody}>
                <CheckInChecklist
                  tasks={vm.tasks}
                  confirmed={vm.confirmed}
                  done={vm.done}
                  total={vm.total}
                  canSubmit={vm.canSubmit}
                  submitted={vm.submitted}
                  onToggle={vm.toggleTask}
                  onSubmit={vm.submit}
                />
              </View>
            </View>
          </Reveal>

          <View style={styles.section}>
            <SectionHeader
              title="Around Your Home"
              subtitle={`Schools, hospitals and parks within ${vm.radius}`}
            />
            <View style={styles.sectionBody}>
              <NeighborhoodCard
                categories={vm.neighborhood}
                selectedId={vm.placeTab}
                onSelect={vm.setPlaceTab}
                onPlacePress={vm.openPlace}
                onOpenMap={vm.openMap}
              />
            </View>
          </View>

          <View style={styles.section}>
            <CuratedLivingCard
              eyebrow={vm.curated.eyebrow}
              title={vm.curated.title}
              body={vm.curated.body}
              image={vm.curated.image}
              width={cardWidth}
            />
          </View>
        </View>
      </Animated.ScrollView>

      <DetailTopBar
        topInset={insets.top}
        title="Check-In"
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
    // Status card starts below the fade strip
    paddingTop: SHEET_OVERLAP + spacing.xxl,
    // Only the top fade strip is see-through; sheetFill paints the rest
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
  // Same section rhythm as the guest home page
  section: {
    marginTop: spacing.sectionGap,
  },
  sectionBody: {
    marginTop: spacing.lg,
  },
});

export default CheckInScreen;
