/**
 * IssueForm: new-issue fields laid out on the page (no outer box; the
 * screen's section header gives the title).
 *  1. Category: dropdown field (opens CategorySheet)
 *  2. Description: multi-line text
 *  3. Photos & videos: optional; thumbnails with remove + "Photo" / "Video"
 *     add tiles (camera or library)
 * "Add Issue" is enabled once a category and description are given.
 * "Cancel" shows only when there is already an issue in the list.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/Button';
import { ChevronDownIcon, CloseIcon, PlusIcon, VideoCameraIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { IssueMedia } from '../../types';
import { TILE_BORDER } from '../checkin/CheckInChecklist';
import { IssueMediaThumb } from './IssueMediaThumb';

interface Props {
  categoryLabel?: string;
  description: string;
  media: readonly IssueMedia[];
  maxMedia: number;
  canAdd: boolean;
  canCancel: boolean;
  onOpenCategory: () => void;
  onChangeDescription: (text: string) => void;
  onAddMedia: (type: 'photo' | 'video') => void;
  onRemoveMedia: (index: number) => void;
  onAdd: () => void;
  onCancel: () => void;
}

const THUMB = ms(64);

export const IssueForm: React.FC<Props> = ({
  categoryLabel,
  description,
  media,
  maxMedia,
  canAdd,
  canCancel,
  onOpenCategory,
  onChangeDescription,
  onAddMedia,
  onRemoveMedia,
  onAdd,
  onCancel,
}) => (
  <View style={styles.wrap}>
    {/* 1. Category */}
    <Text style={[styles.label, styles.firstLabel]}>Category</Text>
    <Pressable
      onPress={onOpenCategory}
      accessibilityRole="button"
      accessibilityLabel={categoryLabel ? `Category, ${categoryLabel}` : 'Choose a category'}
      style={({ pressed }) => [styles.field, styles.select, pressed && styles.pressed]}
    >
      <Text
        style={[styles.fieldText, !categoryLabel && styles.placeholder]}
        numberOfLines={1}
      >
        {categoryLabel ?? 'Choose a category'}
      </Text>
      <ChevronDownIcon size={ms(14)} color={colors.navy} />
    </Pressable>

    {/* 2. Description */}
    <Text style={styles.label}>Description</Text>
    <TextInput
      value={description}
      onChangeText={onChangeDescription}
      placeholder="What's wrong? e.g. Crack in the wall near the window"
      placeholderTextColor={colors.textMuted}
      multiline
      textAlignVertical="top"
      maxLength={500}
      accessibilityLabel="Description"
      style={[styles.field, styles.textArea, styles.fieldText]}
    />

    {/* 3. Photos & videos (optional) */}
    <Text style={styles.label}>
      Photos & videos <Text style={styles.optional}>(optional)</Text>
    </Text>
    <View style={styles.mediaRow}>
      {media.map((m, i) => (
        <View key={`${m.uri}-${i}`}>
          <IssueMediaThumb media={m} size={THUMB} />
          <Pressable
            onPress={() => onRemoveMedia(i)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${m.type} ${i + 1}`}
            style={styles.mediaRemove}
          >
            <CloseIcon size={ms(9)} color={colors.white} />
          </Pressable>
        </View>
      ))}
      {media.length < maxMedia ? (
        <>
          <Pressable
            onPress={() => onAddMedia('photo')}
            accessibilityRole="button"
            accessibilityLabel="Add photo"
            style={({ pressed }) => [styles.addTile, pressed && styles.pressed]}
          >
            <PlusIcon size={ms(16)} color={colors.navy} />
            <Text style={styles.addText}>Photo</Text>
          </Pressable>
          <Pressable
            onPress={() => onAddMedia('video')}
            accessibilityRole="button"
            accessibilityLabel="Add video"
            style={({ pressed }) => [styles.addTile, pressed && styles.pressed]}
          >
            <VideoCameraIcon size={ms(16)} color={colors.navy} />
            <Text style={styles.addText}>Video</Text>
          </Pressable>
        </>
      ) : null}
    </View>

    <Button
      title="Add Issue"
      variant="soft"
      size="md"
      onPress={onAdd}
      disabled={!canAdd}
      leftIcon={<PlusIcon size={ms(14)} color={colors.navy} />}
      style={styles.add}
    />
    {canCancel ? (
      <Pressable onPress={onCancel} hitSlop={8} accessibilityRole="button" style={styles.cancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  label: {
    ...typographyPresets.bodyMedium,
    color: colors.navy,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  firstLabel: {
    marginTop: 0,
  },
  optional: {
    ...typographyPresets.cardSubtitle,
  },
  field: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    paddingHorizontal: spacing.md,
  },
  select: {
    height: ms(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  fieldText: {
    ...typographyPresets.body,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  placeholder: {
    color: colors.textMuted,
  },
  textArea: {
    minHeight: ms(96),
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  mediaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  mediaRemove: {
    position: 'absolute',
    top: -ms(6),
    right: -ms(6),
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
    borderWidth: 2,
    borderColor: colors.white,
  },
  addTile: {
    width: THUMB,
    height: THUMB,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.headerGradientEnd,
  },
  addText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  add: {
    marginTop: spacing.xl,
  },
  cancel: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  cancelText: {
    ...typographyPresets.sectionLink,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default IssueForm;
