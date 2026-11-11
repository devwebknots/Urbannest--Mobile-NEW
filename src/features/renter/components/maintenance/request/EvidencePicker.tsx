/**
 * EvidencePicker: "Add Evidence" on the request form. Two dashed tiles
 * ("Upload Photos", "Upload Video") side by side; added files show as
 * thumbnails underneath with a remove button (shared IssueMediaThumb).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CloseIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RenterIcon } from '../../dashboard/RenterIcon';
import { IssueMediaThumb } from '../../inspection/IssueMediaThumb';
import type { IssueMedia } from '../../../types';

interface Props {
  media: readonly IssueMedia[];
  max: number;
  onAdd: (type: 'photo' | 'video') => void;
  onRemove: (index: number) => void;
}

const THUMB = ms(64);

export const EvidencePicker: React.FC<Props> = ({ media, max, onAdd, onRemove }) => (
  <View>
    <View style={styles.tiles}>
      <Pressable
        onPress={() => onAdd('photo')}
        accessibilityRole="button"
        accessibilityLabel="Upload photos"
        style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      >
        <RenterIcon name="lineImagePlus" size={ms(30)} color={colors.navy} />
        <Text style={styles.tileText}>Upload Photos</Text>
      </Pressable>
      <Pressable
        onPress={() => onAdd('video')}
        accessibilityRole="button"
        accessibilityLabel="Upload video"
        style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      >
        <RenterIcon name="lineVideoPlus" size={ms(30)} color={colors.navy} />
        <Text style={styles.tileText}>Upload Video</Text>
      </Pressable>
    </View>

    {media.length > 0 ? (
      <>
        <View style={styles.thumbs}>
          {media.map((m, i) => (
            <View key={`${m.uri}-${i}`}>
              <IssueMediaThumb media={m} size={THUMB} />
              <Pressable
                onPress={() => onRemove(i)}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${m.type} ${i + 1}`}
                style={styles.remove}
              >
                <CloseIcon size={ms(9)} color={colors.white} />
              </Pressable>
            </View>
          ))}
        </View>
        <Text style={styles.count}>
          {media.length} of {max} added
        </Text>
      </>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  tiles: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tile: {
    flex: 1,
    height: ms(96),
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.textSubtle,
  },
  pressed: {
    opacity: 0.7,
  },
  tileText: {
    ...typographyPresets.bodyMedium,
    color: colors.navy,
  },
  thumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  remove: {
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
  count: {
    ...typographyPresets.caption,
    marginTop: spacing.sm,
  },
});

export default EvidencePicker;
