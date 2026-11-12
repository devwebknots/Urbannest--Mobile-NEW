/**
 * ApplicationSubmittedScreen: shown after "Submit Official Application"
 * (replaces the application page, so back returns to the property).
 * Follows the "Application Submitted" design with app standards:
 *  - SubmittedHero: photo scene (navy sky + apartment block), glass back,
 *    light SuccessCheck, white "Application Submitted!" + line
 *  - Application ID strip (overlapping the hero fade) with a "Submitted" pill
 *  - "What Happens Next?": the shared ticket timeline (submitted done,
 *    review and decision pending)
 *  - "Track Application Status" (brand) and "Back to Home" (white)
 */

import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { Reveal } from '@/features/renter/components/Reveal';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { TicketTimeline } from '@/features/renter/components/maintenance/details/TicketTimeline';
import { moderateScale as ms } from '@/utils/responsive';
import { ApplicationIcon } from '../components/ApplicationIcon';
import { SubmittedHero } from '../components/SubmittedHero';
import {
  ApplicationSubmittedNavigation,
  useApplicationSubmitted,
} from '../hooks/useApplicationSubmitted';

interface Props {
  navigation?: ApplicationSubmittedNavigation;
  route?: { params?: { propertyId?: string; applicationId?: string; submittedAt?: number } };
}

const noop = () => {};

export const ApplicationSubmittedScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useApplicationSubmitted(route?.params, navigation);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xl,
        }}
      >
        {/* Photo scene: navy sky + building, tick and headline on the sky */}
        <SubmittedHero topInset={insets.top} onBack={vm.back} />

        <Reveal delay={80}>
          <View style={styles.content}>
            <View style={styles.idRow}>
              <View style={styles.idTile}>
                <ApplicationIcon name="document" size={ms(22)} color={colors.navy} />
              </View>
              <View style={styles.idText}>
                <Text style={styles.idLabel}>Application ID</Text>
                <Text style={styles.idValue} selectable>
                  {vm.applicationId}
                </Text>
              </View>
              <View style={styles.pill}>
                <ApplicationIcon name="send" size={ms(13)} color={colors.headerGradientEnd} />
                <Text style={styles.pillText}>Submitted</Text>
              </View>
            </View>
          </View>
        </Reveal>

        <Reveal delay={160}>
          <View style={styles.next}>
            <Text style={[styles.nextTitle, styles.padded]} accessibilityRole="header">
              What Happens Next?
            </Text>
            {/* The shared timeline adds the screen side padding itself */}
            <View style={styles.timeline}>
              <TicketTimeline steps={vm.steps} width={width} onPhotoPress={noop} />
            </View>
          </View>
        </Reveal>

        <View style={styles.actions}>
          <Button
            title="Track Application Status"
            variant="brand"
            onPress={vm.track}
            rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
          />
          <Button
            title="Back to Home"
            variant="light"
            onPress={vm.home}
            leftIcon={<ApplicationIcon name="house" size={ms(18)} color={colors.navy} />}
            style={styles.homeButton}
          />
        </View>
      </ScrollView>
      <AppDialog {...vm.dialog} />
    </View>
  );
};

const TILE = ms(48);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  // Starts on the hero's fade, so the strip overlaps the photo's soft edge
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    marginTop: -ms(40),
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  idTile: {
    width: TILE,
    height: TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
    borderWidth: 1,
    borderColor: colors.white,
  },
  idText: {
    flex: 1,
  },
  idLabel: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  idValue: {
    ...typographyPresets.listingTitle,
    marginTop: ms(2),
    color: colors.navy,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  pillText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  next: {
    marginTop: spacing.sectionGap,
  },
  padded: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  nextTitle: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  timeline: {
    marginTop: spacing.lg,
  },
  actions: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.md,
  },
  // White button on the light page: pale blue rim so its edge shows
  homeButton: {
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
});

export default ApplicationSubmittedScreen;
