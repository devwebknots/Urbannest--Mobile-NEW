/**
 * ApplicationDetailsScreen: one rental application, opened by tapping a card
 * on Application Status. Layout from the "Application Details" design, app
 * standards:
 *  - light top bar: back + "Application Details", ⋮ (continue draft /
 *    browse homes)
 *  - ApplicationSummaryCard: swipeable photo + name, status pill, facts
 *  - CurrentStatusCard for the application's status
 *  - "Application Journey" (`sectionHeading` + line) and the eight steps
 *    on a timeline rail
 *  - "Close" (brand button) pinned to the bottom
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the hidden Close button
import { Button } from '@/components/Button';
import { MoreVerticalIcon } from '@/components/icons';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { CircleIconButton } from '@/features/renter/components/CircleIconButton';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { Reveal } from '@/features/renter/components/Reveal';
import { moderateScale as ms } from '@/utils/responsive';
import {
  ApplicationSummaryCard,
  CurrentStatusCard,
  JourneyStepRow,
} from '../components/ApplicationDetailsParts';
import {
  ApplicationDetailsNavigation,
  useApplicationDetails,
} from '../hooks/useApplicationDetails';
import type { ApplicationRecord } from '../types';

interface Props {
  navigation?: ApplicationDetailsNavigation;
  route: { params: { record: ApplicationRecord } };
}

/** Button height + its padding above (for the hidden Close footer) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the hidden Close button
const FOOTER = ms(48) + spacing.lg;

export const ApplicationDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useApplicationDetails(route.params.record, navigation);
  const bottom = Math.max(insets.bottom, spacing.md) + spacing.sm;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          // Close footer hidden: FOOTER + bottom + spacing.xl while it shows
          paddingBottom: bottom + spacing.xl,
        }}
      >
        {/* Soft blue glow behind the top of the page (as on Application Status) */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />

        <LightTopBar
          title="Application Details"
          titleAlign="left"
          onBack={vm.back}
          right={
            <CircleIconButton
              size={ms(40)}
              accessibilityLabel="More options"
              onPress={vm.more}
              icon={<MoreVerticalIcon size={ms(18)} color={colors.navy} />}
            />
          }
        />

        <Reveal delay={40}>
          <View style={styles.summary}>
            <ApplicationSummaryCard
              record={vm.record}
              photos={vm.photos}
              facts={vm.facts}
              width={width - spacing.screenHorizontal * 2}
            />
          </View>
        </Reveal>

        <Reveal delay={110}>
          <View style={styles.padded}>
            <CurrentStatusCard title={vm.progress.title} message={vm.progress.message} />
          </View>
        </Reveal>

        <View style={[styles.padded, styles.journey]}>
          <Text style={styles.heading} accessibilityRole="header">
            Application Journey
          </Text>
          <Text style={styles.subheading}>Track the progress of your rental application.</Text>
          {/* No Reveal per row: the rail must stay one continuous line */}
          <Reveal delay={160}>
            <View style={styles.steps}>
              {vm.journey.map((row, i) => (
                <JourneyStepRow
                  key={row.id}
                  row={row}
                  first={i === 0}
                  last={i === vm.journey.length - 1}
                  prevDone={i > 0 && vm.journey[i - 1].state === 'done'}
                  onPress={() => vm.openStep(row)}
                />
              ))}
            </View>
          </Reveal>
        </View>
      </ScrollView>

      {/* Pinned Close: hidden for now (back button covers it)
      <View style={[styles.footer, { paddingBottom: bottom }]}>
        <Button title="Close" variant="brand" onPress={vm.back} />
      </View> */}

      <AppDialog {...vm.dialog} />
    </View>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';
// colors.pageTint (#EEF3F9) as rgb, for the footer fade
const TINT = '238,243,249';

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
  padded: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  summary: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
  },
  journey: {
    marginTop: spacing.xxl,
  },
  heading: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  subheading: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  steps: {
    marginTop: spacing.md,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundImage: `linear-gradient(180deg, rgba(${TINT},0) 0%, rgba(${TINT},0.96) 30%, rgba(${TINT},1) 100%)`,
  },
});

export default ApplicationDetailsScreen;
