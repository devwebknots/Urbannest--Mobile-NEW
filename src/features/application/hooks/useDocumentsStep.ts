/**
 * useDocumentsStep: state for step 3 of the rental application, "Property
 * Requirements & Documents" (used inside useRentalApplication).
 *  - Documents: four slots (ID and proof of income required). "Upload"
 *    takes a photo or picks one from the library; an uploaded slot's ⋮
 *    menu replaces or removes the file. Progress = uploaded / total.
 *  - Lifestyle & Logistics: pets (Yes / No + list), vehicles (list) and
 *    storage (Yes / No). Pets and vehicles are added / edited in a sheet.
 * `check()` runs on Continue: required documents, at least one pet when
 * "Yes", and a storage answer.
 */

import { createElement, useCallback, useState } from 'react';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import type { AppDialogConfig } from '@/components/AppDialog';
import { UploadIcon } from '@/components/icons';
import { colors } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import {
  APPLICATION_DOCUMENTS,
  APPLICATION_PETS,
  APPLICATION_VEHICLES,
  STORAGE_OPTIONS,
} from '../constants';
import type { ApplicationDocument, LifestyleSheetState, Pet, Vehicle } from '../types';

const PHOTO = { mediaType: 'photo' as const, quality: 0.8 as const, maxWidth: 2000, maxHeight: 2000 };

let nextId = 0;
const newId = (prefix: string) => `${prefix}-${Date.now()}-${nextId++}`;

/** "Dog – Labrador, 30 kg" */
export const petSummary = (p: Pet) =>
  [p.type, [p.breed.trim(), p.weight.trim() ? `${p.weight.trim()} kg` : ''].filter(Boolean).join(', ')]
    .filter(Boolean)
    .join(' – ');

export function useDocumentsStep(showDialog: (config: AppDialogConfig) => void) {
  const [documents, setDocuments] = useState<ApplicationDocument[]>(() => [
    ...APPLICATION_DOCUMENTS,
  ]);
  const [hasPets, setHasPets] = useState(true);
  const [pets, setPets] = useState<Pet[]>(() => [...APPLICATION_PETS]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => [...APPLICATION_VEHICLES]);
  const [storage, setStorage] = useState('yes');
  const [storageOpen, setStorageOpen] = useState(false);
  const [sheet, setSheet] = useState<LifestyleSheetState>(null);
  const [showErrors, setShowErrors] = useState(false);

  const uploaded = documents.filter(d => d.fileName).length;

  const setFile = useCallback((docId: string, asset?: Asset) => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === docId
          ? asset
            ? {
                ...d,
                uri: asset.uri,
                fileName: asset.fileName ?? `${d.title.replace(/\W+/g, '_')}.jpg`,
              }
            : { ...d, uri: undefined, fileName: undefined }
          : d,
      ),
    );
  }, []);

  const upload = useCallback(
    (docId: string) => {
      const doc = documents.find(d => d.id === docId);
      const handle = (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        const asset = response.assets?.[0];
        if (response.errorCode || !asset?.uri) {
          showDialog({
            tone: 'warning',
            title: 'Could not add file',
            message: response.errorMessage ?? 'Please try again.',
            actions: [{ label: 'OK' }],
          });
          return;
        }
        setFile(docId, asset);
      };
      showDialog({
        tone: 'info',
        icon: createElement(UploadIcon, { size: ms(22), color: colors.navy }),
        title: `Upload ${doc?.title ?? 'document'}`,
        message: 'Take a clear photo of the document or pick one from your library.',
        actions: [
          { label: 'Take Photo', onPress: () => launchCamera(PHOTO).then(handle) },
          {
            label: 'Choose from Library',
            variant: 'soft',
            onPress: () => launchImageLibrary({ ...PHOTO, selectionLimit: 1 }).then(handle),
          },
          { label: 'Cancel', variant: 'link' },
        ],
      });
    },
    [documents, setFile, showDialog],
  );

  /** ⋮ on an uploaded document */
  const openDocumentMenu = useCallback(
    (docId: string) => {
      const doc = documents.find(d => d.id === docId);
      if (!doc) {
        return;
      }
      showDialog({
        tone: 'info',
        title: doc.title,
        reference: doc.fileName,
        actions: [
          { label: 'Replace File', onPress: () => upload(docId) },
          { label: 'Remove File', variant: 'danger', onPress: () => setFile(docId) },
          { label: 'Cancel', variant: 'link' },
        ],
      });
    },
    [documents, setFile, showDialog, upload],
  );

  // Pets / vehicles sheet
  const editingPet =
    sheet?.kind === 'pet' && sheet.editId ? pets.find(p => p.id === sheet.editId) : undefined;
  const editingVehicle =
    sheet?.kind === 'vehicle' && sheet.editId
      ? vehicles.find(v => v.id === sheet.editId)
      : undefined;

  const savePet = useCallback(
    (type: string, breed: string, weight: string) => {
      const editId = sheet?.kind === 'pet' ? sheet.editId : undefined;
      setPets(prev =>
        editId
          ? prev.map(p => (p.id === editId ? { ...p, type, breed, weight } : p))
          : [...prev, { id: newId('pet'), type, breed, weight }],
      );
      setSheet(null);
    },
    [sheet],
  );

  const saveVehicle = useCallback(
    (model: string, plate: string) => {
      const editId = sheet?.kind === 'vehicle' ? sheet.editId : undefined;
      setVehicles(prev =>
        editId
          ? prev.map(v => (v.id === editId ? { ...v, model, plate } : v))
          : [...prev, { id: newId('car'), model, plate }],
      );
      setSheet(null);
    },
    [sheet],
  );

  const removeFromSheet = useCallback(() => {
    if (!sheet?.editId) {
      return;
    }
    const { kind, editId } = sheet;
    const name =
      kind === 'pet'
        ? editingPet
          ? petSummary(editingPet)
          : 'This pet'
        : editingVehicle?.model ?? 'This vehicle';
    setSheet(null);
    showDialog({
      tone: 'warning',
      title: kind === 'pet' ? 'Remove pet?' : 'Remove vehicle?',
      message: `${name} will be taken off the application.`,
      actions: [
        {
          label: 'Remove',
          variant: 'danger',
          onPress: () =>
            kind === 'pet'
              ? setPets(prev => prev.filter(p => p.id !== editId))
              : setVehicles(prev => prev.filter(v => v.id !== editId)),
        },
        { label: 'Keep', variant: 'link' },
      ],
    });
  }, [editingPet, editingVehicle, sheet, showDialog]);

  const missingDocs = documents.filter(d => d.required && !d.fileName);
  const petsMissing = hasPets && pets.length === 0;

  const check = useCallback((): boolean => {
    const problems: string[] = missingDocs.map(d => d.title);
    if (petsMissing) {
      problems.push('your pet details');
    }
    if (!storage) {
      problems.push('storage');
    }
    if (problems.length === 0) {
      return true;
    }
    setShowErrors(true);
    showDialog({
      tone: 'info',
      title: 'A few things missing',
      message: `Please add ${problems.join(', ')} before you continue.`,
      actions: [{ label: 'OK', variant: 'brand' }],
    });
    return false;
  }, [missingDocs, petsMissing, showDialog, storage]);

  return {
    isComplete: missingDocs.length === 0 && !petsMissing && !!storage,
    documents,
    uploaded,
    total: documents.length,
    upload,
    openDocumentMenu,
    showErrors,
    petsMissing,
    hasPets,
    setHasPets,
    pets,
    vehicles,
    storage,
    storageLabel: STORAGE_OPTIONS.find(o => o.id === storage)?.label,
    storageOptions: STORAGE_OPTIONS,
    storageOpen,
    openStorage: () => setStorageOpen(true),
    closeStorage: () => setStorageOpen(false),
    pickStorage: (id: string) => {
      setStorage(id);
      setStorageOpen(false);
    },
    sheet,
    editingPet,
    editingVehicle,
    addPet: () => setSheet({ kind: 'pet' }),
    editPet: (id: string) => setSheet({ kind: 'pet', editId: id }),
    addVehicle: () => setSheet({ kind: 'vehicle' }),
    editVehicle: (id: string) => setSheet({ kind: 'vehicle', editId: id }),
    closeSheet: () => setSheet(null),
    savePet,
    saveVehicle,
    removeFromSheet,
    check,
  };
}

export type DocumentsStepModel = ReturnType<typeof useDocumentsStep>;
