import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { Category, CategoryKey } from '../types';
import { ApartmentsIcon, BuildingIcon, LayersIcon } from './GuestIcons';

const CategoryIcon: React.FC<{ id: CategoryKey }> = ({ id }) => {
  const size = ms(22);
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
      <Pressable
        key={c.key}
        style={styles.item}
        onPress={() => onPress?.(c.key)}
        accessibilityRole="button"
      >
        <View style={styles.tile}>
          <CategoryIcon id={c.key} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {c.label}
        </Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  tile: {
    width: ms(54),
    height: ms(54),
    borderRadius: borderRadius.xl,
    backgroundColor: colors.tileBlue,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(11),
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default CategoryRow;
