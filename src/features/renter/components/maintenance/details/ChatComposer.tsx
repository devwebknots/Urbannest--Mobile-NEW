/**
 * ChatComposer: message box pinned under the ticket chat. App form field
 * (formStyles) that grows to a few lines, and a navy send button that is
 * faded until there is text.
 */

import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { borderRadius, colors, gradients, spacing } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import { formStyles } from '../../form/formStyles';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  canSend: boolean;
  bottomInset: number;
  placeholder?: string;
}

export const ChatComposer: React.FC<Props> = ({
  value,
  onChange,
  onSend,
  canSend,
  bottomInset,
  placeholder = 'Type a message...',
}) => (
  <View style={[styles.bar, { paddingBottom: Math.max(bottomInset, spacing.md) }]}>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      multiline
      maxLength={1000}
      accessibilityLabel="Message"
      style={[formStyles.field, formStyles.input, styles.input]}
    />
    <Pressable
      onPress={onSend}
      disabled={!canSend}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel="Send message"
      accessibilityState={{ disabled: !canSend }}
      style={({ pressed }) => [styles.send, !canSend && styles.sendOff, pressed && styles.pressed]}
    >
      <ArrowRightIcon size={ms(18)} color={colors.white} />
    </Pressable>
  </View>
);

const SEND = ms(48);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    boxShadow: '0px -6px 16px rgba(11,29,58,0.05)',
  },
  input: {
    flex: 1,
    minHeight: SEND,
    maxHeight: ms(120),
    paddingTop: ms(13),
    paddingBottom: ms(13),
  },
  send: {
    width: SEND,
    height: SEND,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(135deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
  },
  sendOff: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});

export default ChatComposer;
