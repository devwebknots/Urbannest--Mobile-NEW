/**
 * MaintenanceRequestScreen: "Maintenance Request" form, opened by
 * "+ Request" on the Maintenance page. Follows the "Urban Nest Maintenance
 * Request" design, top to bottom:
 *  - light top bar (back, avatar)
 *  - "Maintenance Request" page heading (blue bar) + short line
 *  - "Need a Fix? We're Here." card with a building photo
 *  - form laid on the page (no outer box, like the guest home): Category
 *    (shared IconTile row), Problem, Location (sheet), Describe by Voice,
 *    Detailed Description (0 / 500), Add Evidence (photos / video),
 *    "Submit Request", entry-consent note
 * No bottom tab bar: a pushed page, the back button is the way out.
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import { AccentSectionHeader } from '../components/AccentSectionHeader';
import { LightTopBar } from '../components/LightTopBar';
import { Reveal } from '../components/Reveal';
import { RenterIcon } from '../components/dashboard/RenterIcon';
import { FormLabel } from '../components/form/FormLabel';
import { FormSelect } from '../components/form/FormSelect';
import { formStyles } from '../components/form/formStyles';
import { CategorySheet } from '../components/inspection/CategorySheet';
import { CategoryPicker } from '../components/maintenance/request/CategoryPicker';
import { EvidencePicker } from '../components/maintenance/request/EvidencePicker';
import { RequestHero } from '../components/maintenance/request/RequestHero';
import { VoiceNoteCard } from '../components/maintenance/request/VoiceNoteCard';
import {
  MaintenanceRequestNavigation,
  useMaintenanceRequest,
} from '../hooks/useMaintenanceRequest';

interface Props {
  navigation?: MaintenanceRequestNavigation;
  route?: { params?: { residenceId?: string } };
}

export const MaintenanceRequestScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useMaintenanceRequest(route?.params?.residenceId, navigation);

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
        {/* Soft blue + lavender glow behind the top of the page */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />

        <LightTopBar
          initials={vm.profile.initials}
          onBack={vm.back}
          onProfilePress={vm.openProfile}
          backLabel="Back to maintenance"
        />

        <View style={styles.heading}>
          <AccentSectionHeader
            page
            title="Maintenance Request"
            subtitle="Report an issue and our team will take care of it."
          />
        </View>

        <Reveal delay={60}>
          <View style={styles.hero}>
            <RequestHero image={vm.heroImage} width={width} />
          </View>
        </Reveal>

        {/* Form laid on the page (no outer box), like the guest home sections */}
        <Reveal delay={120}>
          <View style={styles.form}>
            {/* Category */}
            <View style={styles.firstSection}>
              <FormLabel icon="lineLayers" label="Category" />
              <CategoryPicker
                categories={vm.categories}
                selectedId={vm.categoryId}
                onSelect={vm.selectCategory}
              />
            </View>

            {/* Problem */}
            <View style={styles.section}>
              <FormLabel icon="lineAlert" label="Problem" />
              <TextInput
                value={vm.problem}
                onChangeText={vm.setProblem}
                placeholder="e.g. Leaking kitchen faucet"
                placeholderTextColor={colors.textMuted}
                maxLength={80}
                returnKeyType="next"
                accessibilityLabel="Problem"
                style={[formStyles.field, formStyles.input]}
              />
            </View>

            {/* Location */}
            <View style={styles.section}>
              <FormLabel icon="linePin" label="Location" />
              <FormSelect
                icon="lineBuilding"
                value={vm.locationLabel}
                placeholder="Choose a room"
                onPress={vm.openLocation}
                accessibilityLabel="Location"
              />
            </View>

            {/* Describe by voice */}
            <View style={styles.section}>
              <VoiceNoteCard onPress={vm.recordVoice} />
            </View>

            {/* Detailed description */}
            <View style={styles.section}>
              <FormLabel icon="lineNote" label="Detailed Description" />
              <View>
                <TextInput
                  value={vm.description}
                  onChangeText={vm.setDescription}
                  placeholder="Tell us more about what's happening..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  textAlignVertical="top"
                  maxLength={vm.descriptionMax}
                  accessibilityLabel="Detailed description"
                  style={[formStyles.field, formStyles.textArea, formStyles.input]}
                />
                <Text style={formStyles.counter}>
                  {vm.description.length} / {vm.descriptionMax}
                </Text>
              </View>
            </View>

            {/* Evidence */}
            <View style={styles.section}>
              <FormLabel icon="lineImagePlus" label="Add Evidence" optional />
              <EvidencePicker
                media={vm.media}
                max={vm.maxMedia}
                onAdd={vm.addMedia}
                onRemove={vm.removeMedia}
              />
            </View>

            <Button
              title="Submit Request"
              variant="brand"
              onPress={vm.submit}
              disabled={!vm.canSubmit}
              rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
              style={styles.submit}
            />

            <View style={styles.consent}>
              <RenterIcon name="lineShieldCheck" size={ms(22)} color={colors.secondary} />
              <Text style={styles.consentText}>
                By submitting, you agree to allow our certified professionals to enter your
                residence during specified hours.
              </Text>
            </View>
          </View>
        </Reveal>
      </ScrollView>

      <CategorySheet
        visible={vm.locationOpen}
        title="Choose a location"
        categories={vm.locations}
        selectedId={vm.locationId}
        onSelect={vm.selectLocation}
        onClose={vm.closeLocation}
      />
      <AppDialog {...vm.dialog} />
    </KeyboardAvoidingView>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';
// Soft lavender (#DDD6FE) as rgb, same wash as the Maintenance page
const LAVENDER = '221,214,254';

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
    backgroundImage: `radial-gradient(circle at 15% 15%, rgba(${BLUE},0.14) 0%, rgba(${BLUE},0) 60%), radial-gradient(circle at 85% 0%, rgba(${LAVENDER},0.5) 0%, rgba(${LAVENDER},0) 55%)`,
  },
  heading: {
    marginTop: spacing.xl,
  },
  hero: {
    marginTop: spacing.xl,
  },
  // Fields sit on the page with the screen's side margins (no box)
  form: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  firstSection: {
    marginTop: spacing.xxl,
  },
  section: {
    marginTop: spacing.xxl,
  },
  submit: {
    marginTop: spacing.xxl,
  },
  consent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  consentText: {
    ...typographyPresets.cardSubtitle,
    flex: 1,
  },
});

export default MaintenanceRequestScreen;
