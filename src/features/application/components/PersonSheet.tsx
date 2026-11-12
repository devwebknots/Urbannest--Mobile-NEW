/**
 * PersonSheet: bottom sheet to add a co-applicant (name + email, "Send
 * Invite") or add / edit a dependent (name + relationship chips, "Save";
 * "Remove" when editing). Built on the shared `FormSheet` + `ChoiceChips`.
 */

import React, { useEffect, useState } from 'react';
import { isValidEmail } from '@/utils/validators';
import { FieldInput, LabeledField } from './ApplicationFields';
import { ChoiceChips } from './ChoiceChips';
import { FormSheet } from './FormSheet';

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

  return (
    <FormSheet
      visible={visible}
      title={isCo ? 'Add Co-Applicant' : editing ? 'Edit Dependent' : 'Add a Dependent'}
      subtitle={
        isCo
          ? "We'll email them a link to fill in their part of the application."
          : 'Family members who will live with you.'
      }
      saveLabel={isCo ? 'Send Invite' : editing ? 'Save Changes' : 'Add Dependent'}
      canSave={canSave}
      onSave={save}
      removeLabel={editing ? 'Remove Dependent' : undefined}
      onRemove={onRemove}
      onClose={onClose}
    >
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
        <LabeledField label="Email Address" required>
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
        <LabeledField label="Relationship" required>
          <ChoiceChips options={relationships} value={relationship} onChange={setRelationship} />
        </LabeledField>
      )}
    </FormSheet>
  );
};

export default PersonSheet;
