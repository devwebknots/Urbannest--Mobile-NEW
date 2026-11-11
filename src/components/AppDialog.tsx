/**
 * Global Component: AppDialog
 * The app's pop-up for warnings, confirmations, short choices and success
 * messages (use it instead of the system Alert so every screen looks the
 * same).
 *
 * Centered white card over a navy-dimmed page: round icon (tone), title,
 * message, then full-width action buttons stacked top to bottom.
 * Tones:
 *  - warning: amber triangle
 *  - info:    icon only if one is given
 *  - success: animated SuccessBadge (circle springs in, tick pops, soft
 *             rings ripple); add `reference` (e.g. "Request #RE-5201")
 *             and `details` (summary rows) for a receipt-like confirmation
 * Motion: the backdrop fades and the card springs up into place; closing
 * plays it back quickly. No motion in tests.
 * Action variants: brand (main), soft (other choice), danger (destructive,
 * e.g. "Remove"), link (quiet, e.g. "Cancel"). Every action closes the
 * dialog first; its onPress runs right after the close animation.
 * Backdrop tap / Android back close it like "Cancel", unless
 * `dismissible: false` (success dialogs use it so "Done" is pressed).
 *
 * Usage:
 *   const dialog = useAppDialog();
 *   dialog.show({ tone: 'warning', title: 'Remove issues?', message: '…',
 *     actions: [{ label: 'Remove', variant: 'danger', onPress: remove },
 *               { label: 'Cancel', variant: 'link' }] });
 *   …
 *   <AppDialog {...dialog.props} />
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { Button } from './Button';
import { WarningTriangleIcon } from './icons';
import { SuccessBadge } from './SuccessBadge';

export type AppDialogTone = 'warning' | 'info' | 'success';

export interface AppDialogAction {
  readonly label: string;
  readonly variant?: 'brand' | 'soft' | 'danger' | 'link';
  readonly onPress?: () => void;
}

/** One summary row in a success dialog, e.g. Category: Plumbing */
export interface AppDialogDetail {
  readonly label: string;
  readonly value: string;
}

export interface AppDialogConfig {
  readonly title: string;
  readonly message?: string;
  readonly tone?: AppDialogTone;
  /** Custom icon (overrides the tone's icon) */
  readonly icon?: React.ReactNode;
  /** Small chip under the title, e.g. "Request #RE-5201" */
  readonly reference?: string;
  /** Summary rows in a pale box under the message */
  readonly details?: readonly AppDialogDetail[];
  /** Backdrop tap / Android back close it (default true) */
  readonly dismissible?: boolean;
  readonly actions: readonly AppDialogAction[];
}

interface Props {
  readonly config: AppDialogConfig | null;
  readonly onClose: () => void;
}

/** Lets the dialog finish closing before e.g. the photo picker opens */
const AFTER_CLOSE_MS = 320;
declare const process: { env: { NODE_ENV?: string } };
const NO_MOTION = process.env.NODE_ENV === 'test';

const TONES: Record<AppDialogTone, { bg: string; fg: string }> = {
  warning: { bg: colors.warningLight, fg: colors.warningDark },
  info: { bg: colors.chipBlue, fg: colors.navy },
  success: { bg: colors.chipBlue, fg: colors.navy },
};

export const AppDialog: React.FC<Props> = ({ config, onClose }) => {
  const { width } = useWindowDimensions();
  // Keeps the last config on screen while the close animation plays
  const [shown, setShown] = useState<AppDialogConfig | null>(config);
  const progress = useRef(new Animated.Value(config ? 1 : 0)).current;

  useEffect(() => {
    if (config) {
      setShown(config);
      if (NO_MOTION) {
        progress.setValue(1);
        return;
      }
      progress.setValue(0);
      Animated.spring(progress, {
        toValue: 1,
        damping: 18,
        stiffness: 210,
        mass: 0.9,
        useNativeDriver: true,
      }).start();
    } else {
      if (NO_MOTION) {
        setShown(null);
        return;
      }
      Animated.timing(progress, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => finished && setShown(null));
    }
  }, [config, progress]);

  const run = (action: AppDialogAction) => {
    onClose();
    if (action.onPress) {
      setTimeout(action.onPress, AFTER_CLOSE_MS);
    }
  };

  const dialog = shown;
  const toneKey = dialog?.tone ?? 'info';
  const tone = TONES[toneKey];
  const dismissible = dialog?.dismissible ?? true;
  const dismiss = () => {
    if (dismissible) {
      onClose();
    }
  };
  const hasIcon = !!dialog && (!!dialog.icon || toneKey === 'warning' || toneKey === 'success');

  const backdropStyle = {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' }),
  };
  const cardStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [0, 1, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [ms(24), 0] }) },
      { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
    ],
  };

  return (
    <Modal
      visible={dialog !== null}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismiss}
    >
      <View style={styles.center}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismiss}
            accessibilityLabel="Close"
            disabled={!dismissible}
          />
        </Animated.View>
        {dialog ? (
          <Animated.View
            style={[
              styles.card,
              toneKey === 'success' && styles.cardSuccess,
              { width: Math.min(width - spacing.screenHorizontal * 2, ms(340)) },
              cardStyle,
            ]}
            accessibilityViewIsModal
          >
            {/* Success: animated badge; warning: triangle; info: icon if given */}
            {toneKey === 'success' && !dialog.icon ? (
              <View style={styles.badge}>
                <SuccessBadge />
              </View>
            ) : hasIcon ? (
              <View style={[styles.icon, { backgroundColor: tone.bg }]}>
                {dialog.icon ?? <WarningTriangleIcon size={ms(22)} color={tone.fg} />}
              </View>
            ) : null}

            <Text
              style={[
                styles.title,
                !hasIcon && styles.titleTop,
                toneKey === 'success' && styles.titleSuccess,
              ]}
              accessibilityRole="header"
            >
              {dialog.title}
            </Text>

            {dialog.reference ? (
              <View style={styles.reference}>
                <Text style={styles.referenceText}>{dialog.reference}</Text>
              </View>
            ) : null}

            {dialog.message ? <Text style={styles.message}>{dialog.message}</Text> : null}

            {dialog.details?.length ? (
              <View style={styles.details}>
                {dialog.details.map((row, i) => (
                  <View key={row.label} style={[styles.detailRow, i > 0 && styles.detailDivider]}>
                    <Text style={styles.detailLabel}>{row.label}</Text>
                    <Text style={styles.detailValue} numberOfLines={2}>
                      {row.value}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.actions}>
              {dialog.actions.map(action =>
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
          </Animated.View>
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
    boxShadow: '0px 24px 48px rgba(11,29,58,0.22)',
  },
  // Success: soft blue wash at the top behind the badge
  cardSuccess: {
    paddingTop: spacing.lg,
    backgroundImage: `linear-gradient(180deg, ${colors.chipBlue} 0%, rgba(255,255,255,1) 42%)`,
  },
  icon: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    // The badge leaves room for its rings; pull the title up a little
    marginBottom: -spacing.sm,
  },
  title: {
    ...typographyPresets.displayTitle,
    marginTop: spacing.lg,
  },
  titleTop: {
    marginTop: 0,
  },
  titleSuccess: {
    color: colors.navy,
  },
  reference: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  referenceText: {
    ...typographyPresets.badge,
    color: colors.navy,
    letterSpacing: 0.4,
  },
  message: {
    ...typographyPresets.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  // Receipt-like summary: pale box, label left, value right
  details: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.pageTint,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  detailDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailLabel: {
    ...typographyPresets.cardSubtitle,
  },
  detailValue: {
    ...typographyPresets.bodyBold,
    flex: 1,
    textAlign: 'right',
    color: colors.navy,
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
