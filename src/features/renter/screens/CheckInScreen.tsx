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
import { moderateScale as ms } from '@/utils/responsive';
import { Reveal } from '../components/Reveal';
import { CheckInChecklist } from '../components/checkin/CheckInChecklist';
import { CheckInStatusCard } from '../components/checkin/CheckInStatusCard';
import { CuratedLivingCard } from '../components/checkin/CuratedLivingCard';
import { NeighborhoodCard } from '../components/checkin/NeighborhoodCard';
import { DashboardSection } from '../components/dashboard/DashboardSection';
import { DetailTopBar } from '../components/dashboard/DetailTopBar';
import { ResidenceHero } from '../components/dashboard/ResidenceHero';
import { STATUS_LABEL } from '../constants';
import { CheckInNavigation, useCheckIn } from '../hooks/useCheckIn';

interface Props {
  navigation?: CheckInNavigation;
  route?: { params?: { residenceId?: string } };
}

const SHEET_OVERLAP = ms(30);

export const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useCheckIn(route?.params?.residenceId, navigation);
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
          eyebrow={`Almost home, ${vm.profile.firstName}`}
          firstName={vm.profile.firstName}
          width={width}
          height={heroHeight}
          sheetOverlap={SHEET_OVERLAP}
          scrollY={scrollY}
        />

        <View style={styles.sheet}>
          <Reveal delay={80}>
            <CheckInStatusCard summary={vm.summary} onAccessKey={vm.openKey} />
          </Reveal>

          <Reveal delay={160}>
            <DashboardSection
              title="Move-In Checklist"
              subtitle="Confirm each item before you collect your keys."
            >
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
            </DashboardSection>
          </Reveal>

          <DashboardSection
            title="Around Your Home"
            subtitle={`Top schools, hospitals and parks within ${vm.radius}.`}
          >
            <NeighborhoodCard
              categories={vm.neighborhood}
              selectedId={vm.placeTab}
              onSelect={vm.setPlaceTab}
              onPlacePress={vm.openPlace}
              onOpenMap={vm.openMap}
            />
          </DashboardSection>

          <View style={styles.curated}>
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
    paddingTop: spacing.xl,
    borderTopLeftRadius: ms(30),
    borderTopRightRadius: ms(30),
    backgroundColor: colors.pageTint,
  },
  curated: {
    marginTop: spacing.sectionGap,
  },
});

export default CheckInScreen;
