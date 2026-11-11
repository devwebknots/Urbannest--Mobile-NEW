/**
 * CollapsibleSection: page section with the blue-bar title
 * (AccentSectionHeader) that opens and closes. The whole header row and
 * the round chevron button toggle it; the chevron points down when open
 * and right when closed. Content is only drawn while open.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronDownIcon, ChevronRightIcon } from '@/components/icons';
import { colors, spacing } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { AccentSectionHeader } from './AccentSectionHeader';
import { CircleIconButton } from './CircleIconButton';

interface Props {
  title: string;
  open: boolean;
  onToggle: () => void;
  /** Shown before the chevron, e.g. a "Completed" pill */
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<Props> = ({
  title,
  open,
  onToggle,
  badge,
  children,
}) => (
  <View>
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ expanded: open }}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <AccentSectionHeader
        title={title}
        right={
          <View style={styles.right}>
            {badge}
            <CircleIconButton
              onPress={onToggle}
              accessibilityLabel={open ? `Collapse ${title}` : `Expand ${title}`}
              icon={
                open ? (
                  <ChevronDownIcon size={ms(12)} color={colors.navy} />
                ) : (
                  <ChevronRightIcon size={ms(12)} color={colors.navy} />
                )
              }
            />
          </View>
        }
      />
    </Pressable>
    {open ? <View style={styles.content}>{children}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    marginTop: spacing.lg,
  },
});

export default CollapsibleSection;
