/**
 * UtilitiesScreen: move-in utilities (opened from the Check-In
 * "Utilities" tile). Light page, no full-bleed hero:
 *  - light top bar: back only ("Utilities" title and avatar commented out)
 *  - intro: eyebrow (home + unit), "Essential Services", accent rule, line
 *  - one photo card per utility (Electricity, Water Supply, Gas, Sewer);
 *    tap opens that utility's providers page
 *  - "Good to know": short move-in tips laid out on the page
 *  - "Confirm Utilities" at the end (back to Check-In, ticks the tile)
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { SectionHeader } from '@/features/guest/components/SectionHeader';
import { moderateScale as ms } from '@/utils/responsive';
import { LightTopBar } from '../components/LightTopBar';
import { Reveal } from '../components/Reveal';
import { PageIntro } from '../components/utilities/PageIntro';
import { UtilityCard } from '../components/utilities/UtilityCard';
import { UtilitiesNavigation, useUtilities } from '../hooks/useUtilities';

interface Props {
  navigation?: UtilitiesNavigation;
  route?: { params?: { residenceId?: string } };
}

const Tip: React.FC<{ n: number; text: string }> = ({ n, text }) => (
  <View style={styles.tip}>
    <View style={styles.tipNumber}>
      <Text style={styles.tipNumberText}>{n}</Text>
    </View>
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

export const UtilitiesScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useUtilities(route?.params?.residenceId, navigation);
  const cardWidth = width - spacing.screenHorizontal * 2;

  const tips = [
    'Open each account at least 3 days before move-in so service starts on time.',
    `Use your service address: ${vm.residence.street}, ${vm.residence.city}.`,
    'Note your meter readings on move-in day and keep the photos.',
  ];

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
          // title="Utilities"
          // initials={vm.profile.initials}
          onBack={vm.back}
          // onProfilePress={vm.openProfile}
          backLabel="Back to check-in"
        />

        <PageIntro
          // eyebrow={`${vm.residence.name} · ${vm.residence.unit}`}
          title="Essential Services"
          body={`${vm.utilities.length} services, ${vm.providerCount} providers. Tap a service to see who supplies it and how to reach them.`}
        />

        <View style={styles.list}>
          {vm.utilities.map((utility, i) => (
            <Reveal key={utility.id} delay={80 + i * 60}>
              <UtilityCard
                utility={utility}
                width={cardWidth}
                onPress={() => vm.openUtility(utility)}
              />
            </Reveal>
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Good to know" subtitle="A few steps for a smooth move-in." />
          <View style={styles.tips}>
            {tips.map((text, i) => (
              <Tip key={text} n={i + 1} text={text} />
            ))}
          </View>
        </View>

        <View style={styles.confirmBlock}>
          <Button
            title="Confirm Utilities"
            variant="brand"
            onPress={vm.confirm}
            rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
          />
          <Text style={styles.footnote}>
            Confirm once your accounts are set up. This ticks Utilities on your check-in.
          </Text>
        </View>
      </ScrollView>

      <AppDialog {...vm.dialog} />
    </View>
  );
};

const NUM = ms(26);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  list: {
    marginTop: spacing.xxl,
    gap: spacing.lg,
  },
  section: {
    marginTop: spacing.sectionGap,
  },
  tips: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: NUM,
    height: NUM,
    borderRadius: NUM / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  tipNumberText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  tipText: {
    ...typographyPresets.body,
    flex: 1,
    marginLeft: spacing.md,
    marginTop: ms(3),
  },
  confirmBlock: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
  },
  footnote: {
    ...typographyPresets.caption,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default UtilitiesScreen;
