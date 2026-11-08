/**
 * InspectionAreaScreen: one area of the move-in inspection. A single common
 * page for every area (Living Room, Kitchen, ...); the area comes in by id.
 * Light page (no full-bleed hero):
 *  - top bar: back, "Inspection", avatar
 *  - rounded photo card of the area with an "Area n of N" pill
 *  - area name (heroTitleCompact, navy) + what to check
 *  - room stepper: every area as a round thumbnail (done / current / to do);
 *    tap to jump to another area
 *  - "How is the <area>?": All good / Report issues tabs
 *  - Issues (n): reported issues, divided rows
 *  - New issue: category dropdown, description, optional photos / videos
 *    (or "Add another issue" once one is added)
 *  - "Save <area>" + hint, at the end of the page (like Check-In)
 * Warnings and choices use the shared AppDialog.
 */

import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { ChevronLeftIcon, PlusIcon } from '@/components/icons';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { SectionHeader } from '@/features/guest/components/SectionHeader';
import { moderateScale as ms } from '@/utils/responsive';
import { TILE_BORDER } from '../components/checkin/CheckInChecklist';
import { RenterIcon } from '../components/dashboard/RenterIcon';
import { AreaStatusChoice } from '../components/inspection/AreaStatusChoice';
import { CategorySheet } from '../components/inspection/CategorySheet';
import { IssueCard } from '../components/inspection/IssueCard';
import { IssueForm } from '../components/inspection/IssueForm';
import { RoomStepper } from '../components/inspection/RoomStepper';
import type { InspectionNavigation } from '../hooks/useInspection';
import { useInspectionArea } from '../hooks/useInspectionArea';

interface Props {
  navigation?: InspectionNavigation;
  route?: { params?: { residenceId?: string; areaId?: string } };
}

const AreaPage: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useInspectionArea(route?.params?.residenceId, route?.params?.areaId, navigation);

  const photoW = width - spacing.screenHorizontal * 2;
  const photoH = Math.round(photoW * 0.62);

  const footnote =
    vm.status === 'unset'
      ? 'Choose All good or Report issues to continue.'
      : vm.status === 'issues' && vm.issues.length === 0
        ? 'Add at least one issue to save.'
        : vm.status === 'allGood'
          ? 'This area will be saved with no issues.'
          : `${vm.issues.length} ${vm.issues.length === 1 ? 'issue' : 'issues'} will be saved.`;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
      >
        {/* Top bar */}
        <View style={styles.bar}>
          <Pressable
            onPress={vm.back}
            hitSlop={8}
            style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
            accessibilityRole="button"
            accessibilityLabel="Back to inspection"
          >
            <ChevronLeftIcon size={ms(18)} color={colors.navy} />
          </Pressable>
          <Text style={styles.barTitle}>Inspection</Text>
          <ProfileAvatar initials={vm.profile.initials} onPress={vm.openProfile} />
        </View>

        {/* Photo card */}
        <View style={[styles.photoCard, { height: photoH }]}>
          <Image
            source={vm.area.image}
            style={{ width: photoW, height: photoH }}
            resizeMode="cover"
          />
          <View style={styles.stepPill}>
            <Text style={styles.stepText}>
              Area {vm.step} of {vm.total}
            </Text>
          </View>
        </View>

        {/* Name + what to check */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{vm.area.label}</Text>
          <Text style={styles.subtitle}>
            {vm.residence.name} · {vm.residence.unit}
          </Text>
        </View>

        {/* Every room: done / current / to do */}
        <View style={styles.stepper}>
          <RoomStepper rooms={vm.rooms} onSelect={vm.jumpTo} />
        </View>

        {/* All good / Report issues */}
        <View style={styles.section}>
          <SectionHeader
            title={`How is the ${vm.area.label}?`}
            subtitle={`Check ${vm.area.hint.toLowerCase()}.`}
          />
          <View style={styles.sectionBody}>
            <AreaStatusChoice
              status={vm.status}
              onAllGood={vm.markAllGood}
              onReportIssues={vm.reportIssues}
            />
          </View>
        </View>

        {vm.status === 'allGood' ? (
          <View style={styles.goodNote}>
            <View style={styles.goodIcon}>
              <RenterIcon name="check" size={ms(10)} color={colors.white} />
            </View>
            <Text style={styles.goodText}>
              Great! Save to mark the {vm.area.label} as all good.
            </Text>
          </View>
        ) : null}

        {vm.status === 'issues' && vm.issues.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              title={`Issues (${vm.issues.length})`}
              subtitle="Remove any you added by mistake."
            />
            <View style={[styles.sectionBody, styles.issueList]}>
              {vm.issues.map((issue, i) => (
                <View key={issue.id} style={i > 0 ? styles.divider : undefined}>
                  <IssueCard
                    issue={issue}
                    categoryLabel={vm.categoryLabel(issue.categoryId) ?? 'Issue'}
                    onRemove={() => vm.removeIssue(issue.id)}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {vm.status === 'issues' ? (
          vm.formOpen ? (
            <View style={styles.section}>
              <SectionHeader
                title={vm.issues.length > 0 ? `Issue ${vm.issues.length + 1}` : 'New issue'}
                subtitle="Tell us what's wrong. Photos help us fix it faster."
              />
              <View style={styles.sectionBody}>
                <IssueForm
                  categoryLabel={vm.categoryLabel(vm.draft.categoryId)}
                  description={vm.draft.description}
                  media={vm.draft.media}
                  maxMedia={vm.maxMedia}
                  canAdd={vm.canAddIssue}
                  canCancel={vm.issues.length > 0}
                  onOpenCategory={vm.openCategory}
                  onChangeDescription={vm.setDescription}
                  onAddMedia={vm.addMedia}
                  onRemoveMedia={vm.removeMedia}
                  onAdd={vm.addIssue}
                  onCancel={vm.cancelIssue}
                />
              </View>
            </View>
          ) : (
            <Button
              title="Add another issue"
              variant="soft"
              size="md"
              onPress={vm.startAnotherIssue}
              leftIcon={<PlusIcon size={ms(14)} color={colors.navy} />}
              style={styles.another}
            />
          )
        ) : null}

        {/* Save, at the end of the page like Check-In */}
        <View style={styles.saveBlock}>
          <Button
            title={`Save ${vm.area.label}`}
            variant="brand"
            onPress={vm.save}
            disabled={!vm.canSave}
            rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
          />
          <Text style={styles.footnote}>{footnote}</Text>
        </View>
      </ScrollView>

      <CategorySheet
        visible={vm.categoryOpen}
        categories={vm.categories}
        selectedId={vm.draft.categoryId}
        onSelect={vm.selectCategory}
        onClose={vm.closeCategory}
      />
      <AppDialog {...vm.dialog} />
    </KeyboardAvoidingView>
  );
};

/** Remounts the page when the room stepper switches area (fresh state) */
export const InspectionAreaScreen: React.FC<Props> = props => (
  <AreaPage key={props.route?.params?.areaId ?? 'first'} {...props} />
);

const BTN = ms(40);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  back: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  backPressed: {
    transform: [{ scale: 0.94 }],
  },
  barTitle: {
    ...typographyPresets.sectionTitle,
    flex: 1,
    marginHorizontal: spacing.md,
    textAlign: 'center',
    color: colors.navy,
  },
  photoCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.chipBlue,
  },
  stepPill: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    height: ms(28),
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(11,29,58,0.6)',
  },
  stepText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  titleBlock: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenHorizontal,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    color: colors.navy,
  },
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  stepper: {
    marginTop: spacing.xl,
  },
  // Same section rhythm as the other pages
  section: {
    marginTop: spacing.sectionGap,
  },
  sectionBody: {
    marginTop: spacing.lg,
  },
  issueList: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  another: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.screenHorizontal,
  },
  goodNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
  },
  goodIcon: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerGradientEnd,
  },
  goodText: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.navy,
  },
  saveBlock: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
  },
  footnote: {
    ...typographyPresets.caption,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default InspectionAreaScreen;
