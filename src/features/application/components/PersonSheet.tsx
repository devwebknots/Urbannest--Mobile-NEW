/**
 * PersonSheet: bottom sheet to add a co-applicant (name + email, "Send
 * Invite") or add / edit a dependent (name + relationship chips, "Save";
 * "Remove" when editing). Same sheet shell as `CategorySheet` (white,
 * 28 top corners, handle, `sectionHeading` title, navy-dimmed backdrop).
 * Relationship chips: picked = soft secondary-blue tick only (no stroke /
 * fill change, per the app's selection rule).
 */

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { DONE_BLUE } from '@/features/renter/components/checkin/CompletedBadge';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { isValidEmail } from '@/utils/validators';
import { moderateScale as ms } from '@/utils/responsive';
import { FieldInput, LabeledField } from './ApplicationFields';

interface Props {
  visible: boolean;
  kind: 'coApplicant' | 'dependent';
  /** Dependent being edited */
  initialName?: string;
  initialRelationship?: string;
  relationships: readonly string[];
  onSaveCoApplicant: (name: string, email: string) => void;
  onSaveDependent: (name: string, relationship: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}

export const PersonSheet: React.FC<Props> = ({
  visible,
  kind,
  initialName,
  initialRelationship,
  relationships,
  onSaveCoApplicant,
  onSaveDependent,
  onRemove,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState<string | undefined>();

  // Fresh fields each time the sheet opens
  useEffect(() => {
    if (visible) {
      setName(initialName ?? '');
      setEmail('');
      setRelationship(initialRelationship);
    }
  }, [visible, initialName, initialRelationship]);

  const isCo = kind === 'coApplicant';
  const editing = !isCo && initialName !== undefined;
  const canSave = isCo
    ? name.trim().length > 0 && isValidEmail(email)
    : name.trim().length > 0 && relationship !== undefined;

  const save = () => {
    if (!canSave) {
      return;
    }
    if (isCo) {
      onSaveCoApplicant(name, email);
    } else if (relationship) {
      onSaveDependent(name, relationship);
    }
  };

  const title = isCo ? 'Add Co-Applicant' : editing ? 'Edit Dependent' : 'Add a Dependent';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView
        style={styles.avoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        pointerEvents="box-none"
      >
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {isCo
              ? "We'll email them a link to fill in their part of the application."
              : 'Family members who will live with you.'}
          </Text>

          <ScrollView bounces={false} keyboardShouldPersistTaps="handled" style={styles.body}>
            <LabeledField label="Full Name" required>
              <FieldInput
                value={name}
                onChangeText={setName}
                placeholder={isCo ? 'e.g. Anju Mathew' : 'e.g. Nan'}
                leftIcon="user"
                autoCapitalize="words"
                maxLength={60}
                accessibilityLabel="Full name"
              />
            </LabeledField>

            {isCo ? (
              <LabeledField label="Email Address" required style={styles.field}>
                <FieldInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@email.com"
                  leftIcon="mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  maxLength={80}
                  accessibilityLabel="Co-applicant email"
                />
              </LabeledField>
            ) : (
              <LabeledField label="Relationship" required style={styles.field}>
                <View style={styles.chips}>
                  {relationships.map(r => {
                    const on = r === relationship;
                    return (
                      <Pressable
                        key={r}
                        onPress={() => setRelationship(r)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: on }}
                        accessibilityLabel={r}
                        style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                      >
                        {on ? (
                          <View style={styles.tick}>
                            <RenterIcon name="check" size={ms(9)} color={colors.white} />
                          </View>
                        ) : null}
                        <Text style={styles.chipText}>{r}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </LabeledField>
            )}
          </ScrollView>

          <Button
            title={isCo ? 'Send Invite' : editing ? 'Save Changes' : 'Add Dependent'}
            variant="brand"
            onPress={save}
            disabled={!canSave}
            style={styles.save}
          />
          {editing && onRemove ? (
            <Button
              title="Remove Dependent"
              variant="link"
              onPress={onRemove}
              textStyle={styles.remove}
              style={styles.removeButton}
            />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const TICK = ms(16);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.45)',
  },
  avoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '85%',
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
    color: colors.navy,
  },
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  body: {
    flexGrow: 0,
    marginTop: spacing.lg,
  },
  field: {
    marginTop: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    minHeight: ms(38),
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  chipText: {
    ...typographyPresets.bodyMedium,
    color: colors.navy,
  },
  tick: {
    width: TICK,
    height: TICK,
    borderRadius: TICK / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DONE_BLUE,
  },
  save: {
    marginTop: spacing.xl,
  },
  removeButton: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  remove: {
    color: colors.error,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default PersonSheet;
