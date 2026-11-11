/**
 * IssueCard: one reported issue row in an area's list (on the page, no
 * box; the list draws hairline dividers between rows). Thumbnail (first photo /
 * video, or a warning tile when there is none), category, description,
 * attachment count and a remove button.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CloseIcon, WarningTriangleIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { InspectionIssue } from '../../types';
import { TILE_BORDER } from '../checkin/CheckInChecklist';
import { IssueMediaThumb } from './IssueMediaThumb';

interface Props {
  issue: InspectionIssue;
  categoryLabel: string;
  onRemove: () => void;
}

const THUMB = ms(56);

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export const IssueCard: React.FC<Props> = ({ issue, categoryLabel, onRemove }) => {
  const photos = issue.media.filter(m => m.type === 'photo').length;
  const videos = issue.media.length - photos;
  const attached = [photos ? plural(photos, 'photo') : '', videos ? plural(videos, 'video') : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.card}>
      {issue.media[0] ? (
        <IssueMediaThumb media={issue.media[0]} size={THUMB} />
      ) : (
        <View style={styles.noMedia}>
          <WarningTriangleIcon size={ms(18)} color={colors.navy} />
        </View>
      )}
      <View style={styles.copy}>
        <Text style={styles.category} numberOfLines={1}>
          {categoryLabel}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {issue.description}
        </Text>
        {attached ? <Text style={styles.attached}>{attached}</Text> : null}
      </View>
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${categoryLabel} issue`}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
      >
        <CloseIcon size={ms(10)} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  noMedia: {
    width: THUMB,
    height: THUMB,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  copy: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  category: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  description: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  attached: {
    ...typographyPresets.caption,
    marginTop: spacing.xs,
  },
  remove: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default IssueCard;
