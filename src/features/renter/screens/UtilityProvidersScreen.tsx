/**
 * UtilityProvidersScreen: providers for one utility (opened from a card on
 * the Utilities page). Information only. Light page:
 *  - light top bar: back only (utility name and avatar commented out)
 *  - rounded photo of the utility with its icon chip
 *  - intro: "Service directory", utility name, accent rule, description
 *  - one ProviderCard per provider (call / website / hours)
 *  - "Which provider is mine?" panel with the service address, on the
 *    guest search card's frosted light-blue CardBackground
 */

import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { CARD_BG, CardBackground } from '@/features/guest/components/CardBackground';
import { moderateScale as ms } from '@/utils/responsive';
import { TILE_BORDER } from '../components/checkin/CheckInChecklist';
import { LightTopBar } from '../components/LightTopBar';
import { Reveal } from '../components/Reveal';
import { RenterIcon } from '../components/dashboard/RenterIcon';
import { PageIntro } from '../components/utilities/PageIntro';
import { ProviderCard } from '../components/utilities/ProviderCard';
import { UtilityProvidersNavigation, useUtilityProviders } from '../hooks/useUtilityProviders';

interface Props {
  navigation?: UtilityProvidersNavigation;
  route?: { params?: { residenceId?: string; utilityId?: string } };
}

const Fact: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.fact}>
    <Text style={styles.factLabel}>{label}</Text>
    <Text style={styles.factValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

export const UtilityProvidersScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useUtilityProviders(route?.params?.residenceId, route?.params?.utilityId, navigation);

  const photoW = width - spacing.screenHorizontal * 2;
  const photoH = Math.round(photoW * 0.5);
  const count = vm.utility.providers.length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
      >
        <LightTopBar
          // title={vm.utility.label}
          // initials={vm.profile.initials}
          onBack={vm.back}
          // onProfilePress={vm.openProfile}
          backLabel="Back to utilities"
        />

        <View style={[styles.photoCard, { height: photoH }]}>
          <Image
            source={vm.utility.image}
            style={{ width: photoW, height: photoH }}
            resizeMode="cover"
          />
          <View style={styles.iconChip}>
            <RenterIcon name={vm.utility.icon} size={ms(20)} color={colors.navy} />
          </View>
        </View>

        <PageIntro eyebrow="Service directory" title={vm.utility.label} body={vm.utility.description} />

        <Text style={styles.listHead}>
          {count} {count === 1 ? 'provider' : 'providers'} for your home
        </Text>
        <View style={styles.list}>
          {vm.utility.providers.map((provider, i) => (
            <Reveal key={provider.id} delay={80 + i * 60}>
              <ProviderCard
                provider={provider}
                onCall={vm.call}
                onOpenWebsite={vm.openWebsite}
              />
            </Reveal>
          ))}
        </View>

        {/* Which provider applies to this home */}
        {/* Same frosted light-blue card as the guest search (Orbitl AI) card */}
        <View style={styles.panel}>
          <CardBackground />
          <Text style={styles.panelEyebrow}>Which provider is mine?</Text>
          <Text style={styles.panelBody}>
            Your lease names the {vm.utility.label.toLowerCase()} provider for this home. Not sure?
            Your property manager can confirm it before move-in.
          </Text>
          <View style={styles.facts}>
            <Fact label="Service address" value={vm.residence.street} />
          </View>
          <View style={[styles.facts, styles.factsRow]}>
            <Fact label="City" value={vm.residence.city} />
            <View style={styles.factDivider} />
            <Fact label="Providers" value={String(count).padStart(2, '0')} />
          </View>
        </View>
      </ScrollView>

      <AppDialog {...vm.dialog} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  photoCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.chipBlue,
  },
  iconChip: {
    position: 'absolute',
    left: spacing.lg,
    bottom: spacing.lg,
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  listHead: {
    ...typographyPresets.bodyBold,
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.screenHorizontal,
    color: colors.navy,
  },
  list: {
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  // Same container as the guest SearchCard: CARD_BG fill, glassy white edge, blue glow
  panel: {
    marginTop: spacing.sectionGap,
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.xl,
    borderRadius: borderRadius.xxl,
    backgroundColor: CARD_BG.base,
    borderWidth: 1.5,
    borderColor: CARD_BG.edge,
    ...shadows.lg,
    shadowColor: CARD_BG.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 16,
  },
  // Section title preset (Playfair, dark textPrimary), as in SectionHeader
  panelEyebrow: {
    ...typographyPresets.sectionHeading,
  },
  panelBody: {
    ...typographyPresets.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  facts: {
    marginTop: spacing.xl,
  },
  factsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  fact: {
    flex: 1,
  },
  factDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: spacing.lg,
    backgroundColor: TILE_BORDER,
  },
  factLabel: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  factValue: {
    ...typographyPresets.bodyBold,
    marginTop: spacing.xxs,
    color: colors.navy,
  },
});

export default UtilityProvidersScreen;
