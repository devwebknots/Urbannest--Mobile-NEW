/**
 * InspectionAreaScreen: one area of the move-in inspection (e.g. Living
 * Room), opened from its card on the Inspection page. Placeholder until the
 * area design is ready: header, area photo + name, and "Finalize <area>",
 * which returns to Inspection and marks the area completed there.
 */

import React from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ChevronLeftIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import { TILE_BORDER } from '../components/checkin/CheckInChecklist';
import type { InspectionNavigation } from '../hooks/useInspection';
import { useInspectionArea } from '../hooks/useInspectionArea';

interface Props {
  navigation?: InspectionNavigation;
  route?: { params?: { residenceId?: string; areaId?: string } };
}

export const InspectionAreaScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const vm = useInspectionArea(route?.params?.residenceId, route?.params?.areaId, navigation);

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + spacing.sm,
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.md,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.bar}>
        <Pressable
          onPress={vm.back}
          hitSlop={8}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Back to inspection"
        >
          <ChevronLeftIcon size={ms(18)} color={colors.navy} />
        </Pressable>
        <Text style={styles.barTitle} numberOfLines={1}>
          {vm.area.label}
        </Text>
        <View style={styles.back} />
      </View>

      <View style={styles.body}>
        <Image source={vm.area.image} style={styles.photo} resizeMode="cover" />
        <Text style={styles.eyebrow}>
          Area {vm.step} of {vm.total}
        </Text>
        <Text style={styles.title}>{vm.area.label}</Text>
        <Text style={styles.hint}>{vm.area.hint}</Text>
        <Text style={styles.note}>The {vm.area.label.toLowerCase()} checklist is coming soon.</Text>
      </View>

      <Button
        title={`Finalize ${vm.area.label}`}
        variant="brand"
        onPress={vm.finalize}
        rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
      />
    </View>
  );
};

const BTN = ms(40);
const PHOTO = ms(120);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: colors.pageTint,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
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
  barTitle: {
    ...typographyPresets.sectionTitle,
    flex: 1,
    marginHorizontal: spacing.md,
    textAlign: 'center',
    color: colors.navy,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: borderRadius.xxl,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    marginTop: spacing.xl,
  },
  title: {
    ...typographyPresets.sectionHeading,
    marginTop: spacing.sm,
  },
  hint: {
    ...typographyPresets.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  note: {
    ...typographyPresets.caption,
    marginTop: spacing.lg,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});

export default InspectionAreaScreen;
