/**
 * ApplicationStatusScreen: "Application Status", opened by "Track
 * Application Status" after submitting. From the design, app standards:
 *  - light top bar: back + "Rental Application", round filter (sort) and
 *    ⋮ (browse homes) buttons
 *  - `heroTitleCompact` "Application Status" + line
 *  - side-scrolling status filter chips with counts
 *  - application cards (photo, name, unit, status pill, applied date, ID);
 *    tap = details dialog (drafts: "Continue Application")
 * No tab bar (pushed page).
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { MoreVerticalIcon } from '@/components/icons';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { CircleIconButton } from '@/features/renter/components/CircleIconButton';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { Reveal } from '@/features/renter/components/Reveal';
import { CategorySheet } from '@/features/renter/components/inspection/CategorySheet';
import { moderateScale as ms } from '@/utils/responsive';
import { ApplicationIcon } from '../components/ApplicationIcon';
import { ApplicationStatusCard, StatusFilterChips } from '../components/ApplicationStatusParts';
import {
  ApplicationStatusNavigation,
  SORT_OPTIONS,
  useApplicationStatus,
} from '../hooks/useApplicationStatus';

interface Props {
  navigation?: ApplicationStatusNavigation;
  route?: { params?: { propertyId?: string; applicationId?: string; submittedAt?: number } };
}

export const ApplicationStatusScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useApplicationStatus(route?.params, navigation);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xl,
        }}
      >
        {/* Soft blue glow behind the top of the page */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />

        <LightTopBar
          title="Rental Application"
          titleAlign="left"
          onBack={vm.back}
          backLabel="Back"
          right={
            <>
              <CircleIconButton
                size={ms(40)}
                accessibilityLabel="Sort applications"
                onPress={vm.openSort}
                icon={<ApplicationIcon name="funnel" size={ms(17)} color={colors.navy} />}
              />
              <CircleIconButton
                size={ms(40)}
                accessibilityLabel="More options"
                onPress={vm.more}
                icon={<MoreVerticalIcon size={ms(18)} color={colors.navy} />}
              />
            </>
          }
        />

        <View style={styles.heading}>
          <Text style={styles.title} accessibilityRole="header">
            Application Status
          </Text>
          <Text style={styles.subtitle}>Track and manage your rental applications</Text>
        </View>

        <View style={styles.chips}>
          <StatusFilterChips
            filters={vm.filters}
            value={vm.filter}
            counts={vm.counts}
            onChange={vm.setFilter}
          />
        </View>

        <View style={styles.list}>
          {vm.records.length === 0 ? (
            <Text style={styles.empty}>No applications here yet.</Text>
          ) : (
            vm.records.map((r, i) => (
              <Reveal key={r.id} delay={40 * Math.min(i, 6)}>
                <ApplicationStatusCard record={r} onPress={() => vm.open(r)} />
              </Reveal>
            ))
          )}
        </View>
      </ScrollView>

      <CategorySheet
        visible={vm.sortOpen}
        title="Sort applications"
        categories={SORT_OPTIONS}
        selectedId={vm.sort}
        onSelect={vm.pickSort}
        onClose={vm.closeSort}
      />
      <AppDialog {...vm.dialog} />
    </View>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: ms(420),
    backgroundImage: `radial-gradient(circle at 85% 5%, rgba(${BLUE},0.2) 0%, rgba(${BLUE},0) 55%), linear-gradient(180deg, rgba(${BLUE},0.1) 0%, rgba(${BLUE},0) 100%)`,
  },
  heading: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.screenHorizontal,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    color: colors.navy,
  },
  subtitle: {
    ...typographyPresets.body,
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  chips: {
    marginTop: spacing.xl,
  },
  list: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.md,
  },
  empty: {
    ...typographyPresets.body,
    marginTop: spacing.xl,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});

export default ApplicationStatusScreen;
