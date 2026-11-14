/**
 * Landlord onboarding pieces (app form look: TILE_BG / TILE_BORDER,
 * typography presets, soft buttons):
 *  - ProfilePhotoField: round avatar (or picked photo) + "Upload photo"
 *  - DocumentDropZone: dashed upload box for ID files + the picked files
 *  - ActivationNote: green note about instant activation
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { UserIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ApplicationIcon } from '@/features/application/components/ApplicationIcon';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import type { OnboardingFile } from './useLandlordOnboarding';

const AVATAR = ms(76);

export const ProfilePhotoField: React.FC<{
  photo: OnboardingFile | null;
  onUpload: () => void;
}> = ({ photo, onUpload }) => (
  <View style={styles.photoRow}>
    <View style={styles.avatar}>
      {photo ? (
        <Image source={{ uri: photo.uri }} style={styles.avatarImage} />
      ) : (
        <UserIcon size={ms(30)} color={colors.textMuted} />
      )}
    </View>
    <View style={styles.photoSide}>
      <Button
        title={photo ? 'Change photo' : 'Upload photo'}
        variant="soft"
        size="md"
        onPress={onUpload}
        leftIcon={<ApplicationIcon name="upload" size={ms(16)} color={colors.navy} />}
        style={styles.photoButton}
      />
      <Text style={styles.hint}>JPG or PNG, max 5MB. Optional.</Text>
    </View>
  </View>
);

export const DocumentDropZone: React.FC<{
  documents: readonly OnboardingFile[];
  onUpload: () => void;
  onRemove: (uri: string) => void;
  invalid?: boolean;
}> = ({ documents, onUpload, onRemove, invalid }) => (
  <View style={styles.docs}>
    <Pressable
      onPress={onUpload}
      accessibilityRole="button"
      accessibilityLabel="Upload document(s)"
      style={({ pressed }) => [styles.drop, invalid && styles.dropInvalid, pressed && styles.pressed]}
    >
      <ApplicationIcon name="upload" size={ms(24)} color={colors.navy} />
      <Text style={styles.dropTitle}>Upload document(s)</Text>
      <Text style={styles.hint}>JPG or PNG. Max 10MB each.</Text>
    </Pressable>

    {documents.map(doc => (
      <View key={doc.uri} style={styles.file}>
        <Image source={{ uri: doc.uri }} style={styles.thumb} />
        <Text style={styles.fileName} numberOfLines={1}>
          {doc.name}
        </Text>
        <Pressable
          onPress={() => onRemove(doc.uri)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${doc.name}`}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <ApplicationIcon name="circleX" size={ms(18)} color={colors.textMuted} />
        </Pressable>
      </View>
    ))}
  </View>
);

export const ActivationNote: React.FC = () => (
  <View style={styles.note}>
    <ApplicationIcon name="circleCheck" size={ms(18)} color={colors.successDark} />
    <Text style={styles.noteText}>
      Your account activates immediately after submitting — no waiting period. You can
      add your first property right away.
    </Text>
  </View>
);


const styles = StyleSheet.create({
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  photoSide: {
    flex: 1,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  photoButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
  },
  hint: {
    ...typographyPresets.cardSubtitle,
  },
  docs: {
    gap: spacing.md,
  },
  drop: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TILE_BORDER,
    backgroundColor: TILE_BG,
  },
  dropInvalid: {
    borderColor: colors.error,
  },
  dropTitle: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  file: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    paddingRight: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  thumb: {
    width: ms(40),
    height: ms(40),
    borderRadius: borderRadius.md,
  },
  fileName: {
    ...typographyPresets.bodyMedium,
    flex: 1,
  },
  note: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.successLight,
  },
  noteText: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.successDark,
  },
  pressed: {
    opacity: 0.7,
  },
});
