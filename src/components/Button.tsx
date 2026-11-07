/**
 * Global Dumb Component: Button
 * Pure presentation component for user actions. Uses TouchableOpacity so
 * every button fades when pressed.
 *
 * App button styles (use these for new screens):
 *  - brand: navy gradient, white text (main action, e.g. "Check-In Now")
 *  - soft:  light blue fill, navy text (secondary action, e.g. "Manage")
 *  - light: white fill, navy text, for dark / photo backgrounds
 *           (e.g. hero "Explore Homes")
 *  - link:  no fill, navy text, usually with an arrow (e.g. "Renew")
 * All share radius 10, the `button` text preset and optional icons.
 * Sizes: md = 44 high, lg = 48 high.
 *
 * Older variants (primary / secondary / outline / danger) are kept for the
 * login screen.
 */

import React from 'react';
import {
  ActivityIndicator,
  Insets,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import {
  colors,
  borderRadius,
  gradients,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'brand'
  | 'soft'
  | 'light'
  | 'link';

export type ButtonSize = 'md' | 'lg';

export interface ButtonProps {
  readonly title: string;
  readonly onPress?: () => void;
  readonly variant?: ButtonVariant;
  /** Height for brand / soft: md = 44, lg = 48 (default lg) */
  readonly size?: ButtonSize;
  /** Icon before the text */
  readonly leftIcon?: React.ReactNode;
  /** Icon after the text (e.g. an arrow) */
  readonly rightIcon?: React.ReactNode;
  readonly isLoading?: boolean;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly accessibilityLabel?: string;
  readonly hitSlop?: Insets | number;
  readonly testID?: string;
}

const APP_VARIANTS: readonly ButtonVariant[] = ['brand', 'soft', 'light', 'link'];

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  hitSlop,
  testID,
}) => {
  const isInteractionDisabled = disabled || isLoading;
  const isApp = APP_VARIANTS.includes(variant);

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'brand':
        return [styles.appContainer, styles[size]];
      case 'soft':
        return [styles.appContainer, styles[size], styles.softContainer];
      case 'light':
        return [styles.appContainer, styles[size], styles.lightContainer];
      case 'link':
        return styles.linkContainer;
      case 'secondary':
        return [styles.baseContainer, styles.secondaryContainer];
      case 'outline':
        return [styles.baseContainer, styles.outlineContainer];
      case 'danger':
        return [styles.baseContainer, styles.dangerContainer];
      case 'primary':
      default:
        return [styles.baseContainer, styles.primaryContainer];
    }
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    switch (variant) {
      case 'brand':
        return [styles.appText, styles.lightText];
      case 'soft':
      case 'light':
      case 'link':
        return styles.appText;
      case 'outline':
        return [styles.baseText, styles.outlineText];
      case 'primary':
      case 'secondary':
      case 'danger':
      default:
        return [styles.baseText, styles.solidText];
    }
  };

  const spinnerColor =
    variant === 'outline'
      ? colors.primary
      : variant === 'soft' || variant === 'light' || variant === 'link'
        ? colors.navy
        : colors.white;

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        getContainerStyle(),
        isInteractionDisabled && (isApp ? styles.appDisabled : styles.disabledContainer),
        style,
      ]}
      onPress={onPress}
      disabled={isInteractionDisabled}
      activeOpacity={0.7}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isInteractionDisabled, busy: isLoading }}
    >
      {variant === 'brand' ? (
        <LinearGradient
          colors={gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {isLoading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // App buttons (brand / soft)
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.button,
    overflow: 'hidden',
  },
  md: {
    height: ms(44),
  },
  lg: {
    height: ms(48),
  },
  softContainer: {
    backgroundColor: colors.chipBlue,
  },
  lightContainer: {
    backgroundColor: colors.white,
  },
  linkContainer: {
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  appText: {
    ...typographyPresets.button,
    color: colors.navy,
  },
  lightText: {
    color: colors.white,
  },
  appDisabled: {
    opacity: 0.45,
  },

  // Older variants (login)
  baseContainer: {
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dangerContainer: {
    backgroundColor: colors.error,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  baseText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  solidText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
});

export default Button;
