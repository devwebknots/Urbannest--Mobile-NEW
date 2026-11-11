import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeIcon } from '@/components/icons';
import { ICON_TILE_ICON, IconTile } from '@/components/IconTile';
import { colors, spacing } from '@/config/theme';
import type { Category, CategoryKey } from '../types';
import { ApartmentsIcon, BuildingIcon, LayersIcon } from './GuestIcons';

const CategoryIcon: React.FC<{ id: CategoryKey }> = ({ id }) => {
  const size = ICON_TILE_ICON;
  const color = colors.navy;
  switch (id) {
    case 'multi':
      return <BuildingIcon size={size} color={color} />;
    case 'apartments':
      return <ApartmentsIcon size={size} color={color} />;
    case 'condos':
      return <LayersIcon size={size} color={color} />;
    default:
      return <HomeIcon size={size} color={color} />;
  }
};

interface Props {
  categories: Category[];
  onPress?: (key: CategoryKey) => void;
}

export const CategoryRow: React.FC<Props> = ({ categories, onPress }) => (
  <View style={styles.row}>
    {categories.map(c => (
      <IconTile
        key={c.key}
        icon={<CategoryIcon id={c.key} />}
        label={c.label}
        onPress={() => onPress?.(c.key)}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
});

export default CategoryRow;
