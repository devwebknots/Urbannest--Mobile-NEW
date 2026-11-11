/**
 * CategoryPicker: the request form's category row (Plumbing, Electrical,
 * HVAC, General, Other) using the app's shared IconTile, the same tiles
 * as the guest home categories, with the renter line icons. The chosen
 * one gets the soft blue tick.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ICON_TILE_ICON, IconTile } from '@/components/IconTile';
import { colors } from '@/config/theme';
import { RenterIcon } from '../../dashboard/RenterIcon';
import type { MaintenanceCategory } from '../../../types';

interface Props {
  categories: readonly MaintenanceCategory[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export const CategoryPicker: React.FC<Props> = ({ categories, selectedId, onSelect }) => (
  <View style={styles.row}>
    {categories.map(c => (
      <IconTile
        key={c.id}
        role="radio"
        icon={<RenterIcon name={c.icon} size={ICON_TILE_ICON} color={colors.navy} />}
        label={c.label}
        selected={c.id === selectedId}
        onPress={() => onSelect(c.id)}
        style={styles.item}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  // First tile starts at the left edge (in line with the label icon),
  // last one ends at the right edge, the rest spread evenly between
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Only as wide as the tile, not an equal-width column
  item: {
    flex: 0,
  },
});

export default CategoryPicker;
