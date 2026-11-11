/**
 * Global Component: AppDialog
 * The app's pop-up for warnings, confirmations and short choices (use it
 * instead of the system Alert so every screen looks the same).
 *
 * Centered white card over a dimmed page: round icon (tone), title,
 * message, then full-width action buttons stacked top to bottom.
 * Action variants: brand (main), soft (other choice), danger (destructive,
 * e.g. "Remove"), link (quiet, e.g. "Cancel"). Every action closes the
 * dialog first; its onPress runs right after the close animation.
 * Backdrop tap / Android back close it like "Cancel".
 *
 * Usage:
 *   const dialog = useAppDialog();
 *   dialog.show({ tone: 'warning', title: 'Remove issues?', message: '…',
 *     actions: [{ label: 'Remove', variant: 'danger', onPress: remove },
 *               { label: 'Cancel', variant: 'link' }] });
 *   …
 *   <AppDialog {...dialog.props} />
 */

import React, { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { Button } from './Button';
import { WarningTriangleIcon } from './icons';

export type AppDialogTone = 'warning' | 'info';

export interface AppDialogAction {
  readonly label: string;
  readonly variant?: 'brand' | 'soft' | 'danger' | 'link';
  readonly onPress?: () => void;
}

export interface AppDialogConfig {
  readonly title: string;
  readonly message?: string;
  readonly tone?: AppDialogTone;
  /** Custom icon (overrides the tone's icon) */
  readonly icon?: React.ReactNode;
  readonly actions: readonly AppDialogAction[];
}

interface Props {
  readonly config: AppDialogConfig | null;
  readonly onClose: () => void;
}

/** Lets the dialog finish closing before e.g. the photo picker opens */
const AFTER_CLOSE_MS = 320;

const TONES: Record<AppDialogTone, { bg: string; fg: string }> = {
  warning: { bg: colors.warningLight, fg: colors.warningDark },
  info: { bg: colors.chipBlue, fg: colors.navy },
};

export const AppDialog: React.FC<Props> = ({ config, onClose }) => {
  const { width } = useWindowDimensions();
  const tone = TONES[config?.tone ?? 'info'];

  const run = (action: AppDialogAction) => {
    onClose();
    if (action.onPress) {
      setTimeout(action.onPress, AFTER_CLOSE_MS);
    }
  };

  return (
    <Modal visible={config !== null} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.center}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
        {config ? (
          <View
            style={[styles.card, { width: Math.min(width - spacing.screenHorizontal * 2, ms(340)) }]}
            accessibilityViewIsModal
          >
            {/* Warnings get a triangle; info shows an icon only if given */}
            {config.icon || config.tone === 'warning' ? (
              <View style={[styles.icon, { backgroundColor: tone.bg }]}>
                {config.icon ?? <WarningTriangleIcon size={ms(22)} color={tone.fg} />}
              </View>
            ) : null}
            <Text style={[styles.title, !(config.icon || config.tone === 'warning') && styles.titleTop]}>
              {config.title}
            </Text>
            {config.message ? <Text style={styles.message}>{config.message}</Text> : null}

            <View style={styles.actions}>
              {config.actions.map(action =>
                action.variant === 'link' ? (
                  <Pressable
                    key={action.label}
                    onPress={() => run(action)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={action.label}
                    style={styles.linkAction}
                  >
                    <Text style={styles.linkText}>{action.label}</Text>
                  </Pressable>
                ) : action.variant === 'danger' ? (
                  <Pressable
                    key={action.label}
                    onPress={() => run(action)}
                    accessibilityRole="button"
                    accessibilityLabel={action.label}
                    style={({ pressed }) => [styles.danger, pressed && styles.pressed]}
                  >
                    <Text style={styles.dangerText}>{action.label}</Text>
                  </Pressable>
                ) : (
                  <Button
                    key={action.label}
                    title={action.label}
                    variant={action.variant ?? 'brand'}
                    size="md"
                    onPress={() => run(action)}
                  />
                ),
              )}
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

/** Holds one dialog at a time: show(config) opens it, props go to <AppDialog /> */
export function useAppDialog() {
  const [config, setConfig] = useState<AppDialogConfig | null>(null);
  const show = useCallback((next: AppDialogConfig) => setConfig(next), []);
  const close = useCallback(() => setConfig(null), []);
  return { show, close, props: { config, onClose: close } };
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.45)',
  },
  card: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.white,
  },
  icon: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typographyPresets.displayTitle,
    marginTop: spacing.lg,
  },
  titleTop: {
    marginTop: 0,
  },
  message: {
    ...typographyPresets.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  // Destructive: soft red fill, red text (same size as the md buttons)
  danger: {
    height: ms(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button,
    backgroundColor: colors.errorLight,
  },
  dangerText: {
    ...typographyPresets.button,
    color: colors.error,
  },
  linkAction: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    ...typographyPresets.sectionLink,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default AppDialog;
