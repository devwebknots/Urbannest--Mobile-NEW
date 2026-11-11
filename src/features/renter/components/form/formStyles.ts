/**
 * Shared look for form fields on the light renter pages: soft blue-white
 * fill, pale blue edge, rounded 12. Used by text inputs, text areas and
 * select fields (FormSelect).
 */

import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { TILE_BG, TILE_BORDER } from '../checkin/CheckInChecklist';

export const formStyles = StyleSheet.create({
  field: {
    minHeight: ms(50),
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  // Text typed into a field
  input: {
    ...typographyPresets.body,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textMuted,
  },
  textArea: {
    minHeight: ms(110),
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  // "0 / 500" in the bottom-right of a text area
  counter: {
    ...typographyPresets.caption,
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.sm,
  },
});

export default formStyles;
