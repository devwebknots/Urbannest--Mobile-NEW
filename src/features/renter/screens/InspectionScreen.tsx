/**
 * InspectionScreen: move-in inspection, opened from the "Inspection" tile on
 * the Check-In checklist. Placeholder for now (full design comes next):
 * a back button and "Submit Inspection". Submitting returns to Check-In
 * with `inspectionSubmitted`, which ticks the Inspection tile there.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { goBack, navigate } from '@/navigation/navigationRef';
import { moderateScale as ms } from '@/utils/responsive';

export interface InspectionNavigation {
  goBack: () => void;
  navigate: (options: {
    name: 'CheckIn';
    params: { residenceId: string; inspectionSubmitted: boolean };
    merge: boolean;
  }) => void;
}

interface Props {
  navigation?: InspectionNavigation;
  route?: { params?: { residenceId?: string } };
}

export const InspectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const residenceId = route?.params?.residenceId ?? '';

  // Go back to the existing Check-In screen and mark the inspection done
  const submit = () => {
    const params = { residenceId, inspectionSubmitted: true };
    if (navigation?.navigate) {
      navigation.navigate({ name: 'CheckIn', params, merge: true });
    } else {
      navigate('CheckIn', params);
    }
  };

  const back = () => (navigation?.goBack ? navigation.goBack() : goBack());

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <Button title="Back" variant="link" onPress={back} style={styles.back} />
      <View style={styles.body}>
        <Text style={styles.title}>Move-In Inspection</Text>
        <Text style={styles.subtitle}>Inspection steps are coming soon.</Text>
      </View>
      <Button
        title="Submit Inspection"
        variant="brand"
        onPress={submit}
        rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: colors.pageTint,
  },
  back: {
    alignSelf: 'flex-start',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...typographyPresets.sectionHeading,
    textAlign: 'center',
  },
  subtitle: {
    ...typographyPresets.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default InspectionScreen;
