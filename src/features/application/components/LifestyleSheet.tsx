/**
 * LifestyleSheet: add / edit a pet (type chips, breed, weight in kg) or a
 * vehicle (make & model, licence plate) on step 3. Built on `FormSheet`.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FieldInput, FieldRow, LabeledField } from './ApplicationFields';
import { ChoiceChips } from './ChoiceChips';
import { FormSheet } from './FormSheet';
import type { Pet, Vehicle } from '../types';

interface Props {
  kind: 'pet' | 'vehicle' | null;
  pet?: Pet;
  vehicle?: Vehicle;
  petTypes: readonly string[];
  onSavePet: (type: string, breed: string, weight: string) => void;
  onSaveVehicle: (model: string, plate: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export const LifestyleSheet: React.FC<Props> = ({
  kind,
  pet,
  vehicle,
  petTypes,
  onSavePet,
  onSaveVehicle,
  onRemove,
  onClose,
}) => {
  const visible = kind !== null;
  const isPet = kind === 'pet';
  const editing = isPet ? !!pet : !!vehicle;

  const [type, setType] = useState<string | undefined>();
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');

  // Fresh fields each time the sheet opens
  useEffect(() => {
    if (visible) {
      setType(pet?.type);
      setBreed(pet?.breed ?? '');
      setWeight(pet?.weight ?? '');
      setModel(vehicle?.model ?? '');
      setPlate(vehicle?.plate ?? '');
    }
  }, [visible, pet, vehicle]);

  const canSave = isPet ? !!type && breed.trim().length > 0 : model.trim().length > 0;

  const save = () => {
    if (!canSave) {
      return;
    }
    if (isPet && type) {
      onSavePet(type, breed.trim(), weight.trim());
    } else if (!isPet) {
      onSaveVehicle(model.trim(), plate.trim().toUpperCase());
    }
  };

  return (
    <FormSheet
      visible={visible}
      title={isPet ? (editing ? 'Edit Pet' : 'Add a Pet') : editing ? 'Edit Vehicle' : 'Add a Vehicle'}
      subtitle={
        isPet
          ? 'Every animal that will live in the home.'
          : 'Each vehicle you will park at the property.'
      }
      saveLabel={editing ? 'Save Changes' : isPet ? 'Add Pet' : 'Add Vehicle'}
      canSave={canSave}
      onSave={save}
      removeLabel={editing ? (isPet ? 'Remove Pet' : 'Remove Vehicle') : undefined}
      onRemove={onRemove}
      onClose={onClose}
    >
      {isPet ? (
        <>
          <LabeledField label="Type" required>
            <ChoiceChips options={petTypes} value={type} onChange={setType} />
          </LabeledField>
          <FieldRow>
            <LabeledField label="Breed" required style={styles.breed}>
              <FieldInput
                value={breed}
                onChangeText={setBreed}
                placeholder="e.g. Labrador"
                autoCapitalize="words"
                maxLength={40}
                accessibilityLabel="Pet breed"
              />
            </LabeledField>
            <LabeledField label="Weight" hint="(kg)" style={styles.weight}>
              <FieldInput
                value={weight}
                onChangeText={t => setWeight(t.replace(/[^\d.]/g, '').slice(0, 5))}
                placeholder="e.g. 30"
                keyboardType="decimal-pad"
                maxLength={5}
                accessibilityLabel="Pet weight in kilograms"
              />
            </LabeledField>
          </FieldRow>
        </>
      ) : (
        <>
          <LabeledField label="Make & Model" required>
            <FieldInput
              value={model}
              onChangeText={setModel}
              placeholder="e.g. Toyota Camry"
              leftIcon="car"
              autoCapitalize="words"
              maxLength={50}
              accessibilityLabel="Vehicle make and model"
            />
          </LabeledField>
          <LabeledField label="Licence Plate">
            <FieldInput
              value={plate}
              onChangeText={setPlate}
              placeholder="e.g. MO-1234"
              autoCapitalize="characters"
              maxLength={12}
              accessibilityLabel="Licence plate"
            />
          </LabeledField>
        </>
      )}
    </FormSheet>
  );
};

export default LifestyleSheet;

const styles = StyleSheet.create({
  breed: {
    flex: 1.4,
  },
  weight: {
    flex: 1,
  },
});
