/**
 * CategorySheet: bottom sheet listing the issue categories (the area page's
 * "Category" dropdown). The current choice shows a navy tick. Closes on
 * backdrop tap, Android back, or picking a category. Also used for other
 * single-choice lists (e.g. the maintenance request "Location") via `title`.
 * Long lists (more than 12, e.g. every country) get a search field.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { IssueCategory } from '../../types';
import { TILE_BORDER } from '../checkin/CheckInChecklist';
import { RenterIcon } from '../dashboard/RenterIcon';

/** Lists longer than this show a search field */
const SEARCH_MIN = 12;

interface Props {
  visible: boolean;
  categories: readonly IssueCategory[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  /** Sheet heading, default "Choose a category" */
  title?: string;
}

export const CategorySheet: React.FC<Props> = ({
  visible,
  categories,
  selectedId,
  onSelect,
  onClose,
  title = 'Choose a category',
}) => {
  const insets = useSafeAreaInsets();
  const searchable = categories.length > SEARCH_MIN;
  const [query, setQuery] = useState('');
  // Fresh search each time the sheet opens
  useEffect(() => {
    if (visible) {
      setQuery('');
    }
  }, [visible]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? categories.filter(c => c.label.toLowerCase().includes(q)) : categories;
  }, [categories, query]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView
        style={styles.avoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
      >
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          {searchable ? (
            <View style={styles.search}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={`Search ${title.toLowerCase()}`}
                placeholderTextColor={colors.textMuted}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                accessibilityLabel={`Search ${title}`}
                style={styles.searchInput}
              />
            </View>
          ) : null}
          <ScrollView style={styles.list} bounces={false} keyboardShouldPersistTaps="handled">
            {searchable && shown.length === 0 ? (
              <Text style={styles.empty}>No matches</Text>
            ) : null}
            {shown.map((c, i) => {
              const on = c.id === selectedId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => onSelect(c.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={c.label}
                  style={({ pressed }) => [
                    styles.row,
                    i > 0 && styles.rowDivider,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.rowText, on && styles.rowTextOn]}>{c.label}</Text>
                  {on ? (
                    <View style={styles.tick}>
                      <RenterIcon name="check" size={ms(10)} color={colors.white} />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.45)',
  },
  // Fills the screen so the sheet rises above the keyboard (iOS)
  avoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '75%',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.header,
    borderTopRightRadius: borderRadius.header,
  },
  handle: {
    alignSelf: 'center',
    width: ms(40),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: TILE_BORDER,
  },
  title: {
    ...typographyPresets.sectionHeading,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  search: {
    justifyContent: 'center',
    height: ms(44),
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.pageTint,
  },
  searchInput: {
    ...typographyPresets.body,
    paddingVertical: 0,
    color: colors.textPrimary,
  },
  empty: {
    ...typographyPresets.body,
    paddingVertical: spacing.lg,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ms(52),
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  rowText: {
    ...typographyPresets.body,
    color: colors.textPrimary,
  },
  rowTextOn: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  tick: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default CategorySheet;
