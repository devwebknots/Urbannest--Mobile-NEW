/**
 * ManageActionRow: the four shortcuts (Maintenance, Invoices, Amenities,
 * Access) along the bottom of the residence card. White line icon in a
 * frosted circle, white label under it, thin dividers between the items.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { ManageAction } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  actions: readonly ManageAction[];
  onPress: (action: ManageAction) => void;
}

export const ManageActionRow: React.FC<Props> = ({ actions, onPress }) => (
  <View style={styles.row}>
    {actions.map((action, i) => (
      <React.Fragment key={action.id}>
        {i > 0 ? <View style={styles.divider} /> : null}
        <Pressable
          onPress={() => onPress(action)}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={styles.item}
        >
          {({ pressed }) => (
            <>
              <View style={[styles.icon, pressed && styles.pressed]}>
                <RenterIcon name={action.icon} size={ms(17)} color={colors.white} />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {action.label}
              </Text>
            </>
          )}
        </Pressable>
      </React.Fragment>
    ))}
  </View>
);

const ICON = ms(36);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  // Frosted circle
  icon: {
    width: ICON,
    height: ICON,
    borderRadius: ICON / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  label: {
    ...typographyPresets.badge,
    marginTop: spacing.sm,
    color: colors.white,
  },
});

export default ManageActionRow;
