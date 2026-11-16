/**
 * useAddUnit: ViewModel for Add New Property → Unit ("Unit / Home
 * Information"). Opened after the property is saved.
 *  - several units: "Units Added So Far" switcher + "Add Unit" (new blank
 *    unit); each keeps its own form, amenities, photos and floor plans
 *  - sub tabs: Unit/Home Info → Amenities → Gallery (footer "Next" walks
 *    through them, then "Save Unit")
 *  - Unit/Home Info sections (collapsible): Unit Basics, Unit Summary
 *    (read-only, from the form), Size & Configuration (+ student housing
 *    switch), Financials, Floor Plan (upload area + 3 slots), Unit Types Guide
 *  - student housing: switch, rooms per unit, Add Room / view room sheet
 *  - pickers: unit type, ownership, lease type, management model, unit
 * The page's dialog / photo picker come from useAddProperty.
 */

import { useCallback, useMemo, useState } from 'react';
import type { Asset } from 'react-native-image-picker';
import type { AppDialogConfig } from '@/components/AppDialog';
import {
  LEASE_TYPES,
  MANAGEMENT_MODELS,
  MAX_FLOOR_PLANS,
  MAX_PROPERTY_IMAGES,
  OWNERSHIP_TYPES,
  UNIT_TYPES,
} from './constants';
import { type StudentRoom, roomTypeLabel } from './RoomSheet';
import type { PickedMedia } from './useAddProperty';

/** Screens-only phase: skip required-field checks (set false to turn on) */
const BYPASS_VALIDATION = true;

export type UnitSubTab = 'info' | 'amenities' | 'gallery';

export type UnitSection = 'basics' | 'summary' | 'size' | 'financials' | 'floorPlan' | 'guide';

export interface UnitForm {
  unitNumber: string;
  tower: string;
  typeId: string;
  floor: string;
  ownershipId: string;
  leaseTypeId: string;
  managementId: string;
  description: string;
  carpetArea: string;
  totalArea: string;
  rooms: string;
  bathrooms: string;
  rent: string;
  deposit: string;
}

export type UnitField = keyof UnitForm;

interface UnitDraft {
  form: UnitForm;
  studentHousing: boolean;
  rooms: StudentRoom[];
  amenities: string[];
  photos: PickedMedia[];
  floorPlans: PickedMedia[];
  saved: boolean;
}

type UnitPicker = 'type' | 'ownership' | 'lease' | 'management' | 'unit' | null;
type Errors = Partial<Record<UnitField, string>>;

const EMPTY_FORM: UnitForm = {
  unitNumber: '',
  tower: '',
  typeId: '',
  floor: '',
  ownershipId: '',
  leaseTypeId: '',
  managementId: '',
  description: '',
  carpetArea: '',
  totalArea: '',
  rooms: '',
  bathrooms: '',
  rent: '',
  deposit: '',
};

const newUnit = (): UnitDraft => ({
  form: EMPTY_FORM,
  studentHousing: false,
  rooms: [],
  amenities: [],
  photos: [],
  floorPlans: [],
  saved: false,
});

const SUB_ORDER: readonly UnitSubTab[] = ['info', 'amenities', 'gallery'];

const labelOf = (list: readonly { id: string; label: string }[], id: string) =>
  list.find(o => o.id === id)?.label;

export function useAddUnit(
  show: (config: AppDialogConfig) => void,
  pickMedia: (
    title: string,
    kind: 'photo' | 'video',
    onPicked: (assets: Asset[]) => void,
    limit?: number,
  ) => void,
) {
  const [units, setUnits] = useState<UnitDraft[]>([newUnit()]);
  const [active, setActive] = useState(0);
  const [subTab, setSubTab] = useState<UnitSubTab>('info');
  const [errors, setErrors] = useState<Errors>({});
  const [picker, setPicker] = useState<UnitPicker>(null);
  const [closed, setClosed] = useState<UnitSection[]>([]);
  const [amenityQuery, setAmenityQuery] = useState('');
  /** Room sheet: 'new' to add, a room index to view / edit, null closed */
  const [roomSheet, setRoomSheet] = useState<'new' | number | null>(null);

  const unit = units[active];
  const { form } = unit;

  const update = useCallback(
    (change: (u: UnitDraft) => UnitDraft) =>
      setUnits(prev => prev.map((u, i) => (i === active ? change(u) : u))),
    [active],
  );

  const setField = useCallback(
    (key: UnitField, value: string) => {
      update(u => ({ ...u, form: { ...u.form, [key]: value } }));
      setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
    },
    [update],
  );

  const toggleSection = useCallback(
    (s: UnitSection) =>
      setClosed(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])),
    [],
  );

  const toggleStudentHousing = useCallback(
    () => update(u => ({ ...u, studentHousing: !u.studentHousing })),
    [update],
  );

  const saveRoom = useCallback(
    (room: StudentRoom) => {
      update(u => ({
        ...u,
        rooms:
          typeof roomSheet === 'number'
            ? u.rooms.map((r, i) => (i === roomSheet ? room : r))
            : [...u.rooms, room],
      }));
      setRoomSheet(null);
    },
    [roomSheet, update],
  );

  const toggleAmenity = useCallback(
    (id: string) =>
      update(u => ({
        ...u,
        amenities: u.amenities.includes(id)
          ? u.amenities.filter(x => x !== id)
          : [...u.amenities, id],
      })),
    [update],
  );

  const toMedia = (a: Asset, fallback: string): PickedMedia => ({
    uri: a.uri!,
    name: a.fileName ?? fallback,
  });

  /** Upload area / empty slot: add drawings into the free slots */
  const uploadFloorPlan = useCallback(() => {
    const left = MAX_FLOOR_PLANS - unit.floorPlans.length;
    if (left <= 0) {
      show({
        tone: 'warning',
        title: 'Floor plan slots are full',
        message: `You can add up to ${MAX_FLOOR_PLANS} drawings. Remove one to add another.`,
        actions: [{ label: 'OK' }],
      });
      return;
    }
    pickMedia(
      'Upload technical drawings',
      'photo',
      assets =>
        update(u => ({
          ...u,
          floorPlans: [
            ...u.floorPlans,
            ...assets.map((a, i) => toMedia(a, `floor_plan_${u.floorPlans.length + i + 1}.jpg`)),
          ].slice(0, MAX_FLOOR_PLANS),
        })),
      left,
    );
  }, [unit.floorPlans.length, pickMedia, show, update]);

  const removeFloorPlan = useCallback(
    (uri: string) => update(u => ({ ...u, floorPlans: u.floorPlans.filter(m => m.uri !== uri) })),
    [update],
  );

  const uploadPhotos = useCallback(() => {
    const left = MAX_PROPERTY_IMAGES - unit.photos.length;
    if (left <= 0) {
      show({
        tone: 'warning',
        title: 'Photo limit reached',
        message: `You can add up to ${MAX_PROPERTY_IMAGES} photos. Remove one to add another.`,
        actions: [{ label: 'OK' }],
      });
      return;
    }
    pickMedia(
      'Upload unit photos',
      'photo',
      assets =>
        update(u => ({
          ...u,
          photos: [
            ...u.photos,
            ...assets.map((a, i) => toMedia(a, `unit_${u.photos.length + i + 1}.jpg`)),
          ].slice(0, MAX_PROPERTY_IMAGES),
        })),
      left,
    );
  }, [unit.photos.length, pickMedia, show, update]);

  const removePhoto = useCallback(
    (uri: string) => update(u => ({ ...u, photos: u.photos.filter(m => m.uri !== uri) })),
    [update],
  );

  const unitName = useCallback(
    (u: UnitDraft, i: number) =>
      u.form.unitNumber.trim() ? `Unit ${u.form.unitNumber.trim()}` : `Unit ${i + 1}`,
    [],
  );

  /** "Add Unit": a new blank unit, opened on Unit/Home Info */
  const addUnit = useCallback(() => {
    setRoomSheet(null);
    setUnits(prev => [...prev, newUnit()]);
    setActive(units.length);
    setSubTab('info');
    setErrors({});
  }, [units.length]);

  const check = useCallback((): Errors => {
    const e: Errors = {};
    if (BYPASS_VALIDATION) {
      return e;
    }
    (['unitNumber', 'typeId', 'ownershipId', 'rent'] as const).forEach(key => {
      if (!form[key].trim()) {
        e[key] = 'Required';
      }
    });
    return e;
  }, [form]);

  /** Footer: Next through the sub tabs, then save the unit */
  const next = useCallback(() => {
    if (subTab === 'info') {
      const e = check();
      setErrors(e);
      if (Object.keys(e).length > 0) {
        return;
      }
    }
    const at = SUB_ORDER.indexOf(subTab);
    if (at < SUB_ORDER.length - 1) {
      setSubTab(SUB_ORDER[at + 1]);
      return;
    }
    update(u => ({ ...u, saved: true }));
    show({
      tone: 'success',
      title: 'Unit saved',
      message: 'Add another unit to this property, or keep editing this one.',
      details: [{ label: 'Unit', value: unitName(unit, active) }],
      actions: [
        { label: 'Add Another Unit', variant: 'brand', onPress: addUnit },
        { label: 'Done', variant: 'link' },
      ],
    });
  }, [subTab, check, update, show, unitName, unit, active, addUnit]);

  const pick = useCallback(
    (id: string) => {
      if (picker === 'unit') {
        setActive(Number(id));
        setErrors({});
      } else if (picker === 'type') {
        setField('typeId', id);
      } else if (picker === 'ownership') {
        setField('ownershipId', id);
      } else if (picker === 'lease') {
        setField('leaseTypeId', id);
      } else if (picker === 'management') {
        setField('managementId', id);
      }
      setPicker(null);
    },
    [picker, setField],
  );

  const unitOptions = useMemo(
    () => units.map((u, i) => ({ id: String(i), label: unitName(u, i) })),
    [units, unitName],
  );

  const pickerProps = useMemo(() => {
    switch (picker) {
      case 'unit':
        return { title: 'Units Added So Far', options: unitOptions, selectedId: String(active) };
      case 'type':
        return { title: 'Unit Type', options: UNIT_TYPES, selectedId: form.typeId };
      case 'ownership':
        return { title: 'Ownership Type', options: OWNERSHIP_TYPES, selectedId: form.ownershipId };
      case 'lease':
        return { title: 'Lease Type', options: LEASE_TYPES, selectedId: form.leaseTypeId };
      case 'management':
        return { title: 'Management Model', options: MANAGEMENT_MODELS, selectedId: form.managementId };
      default:
        return { title: '', options: [], selectedId: undefined };
    }
  }, [picker, unitOptions, active, form]);

  const typeLabel = labelOf(UNIT_TYPES, form.typeId);

  return {
    subTab,
    setSubTab,
    isLastStep: subTab === 'gallery',
    form,
    errors,
    setField,
    unitLabel: unitName(unit, active),
    savedCount: units.filter(u => u.saved).length,
    addUnit,
    typeLabel,
    ownershipLabel: labelOf(OWNERSHIP_TYPES, form.ownershipId),
    leaseLabel: labelOf(LEASE_TYPES, form.leaseTypeId),
    managementLabel: labelOf(MANAGEMENT_MODELS, form.managementId),
    summary: {
      unitNo: form.unitNumber.trim(),
      type: typeLabel,
      floor: form.floor.trim(),
      area: form.totalArea.trim() || form.carpetArea.trim(),
      rent: form.rent.trim(),
      saved: unit.saved,
    },
    isOpen: (s: UnitSection) => !closed.includes(s),
    toggleSection,
    studentHousing: unit.studentHousing,
    toggleStudentHousing,
    rooms: unit.rooms.map(r => ({ roomNo: r.roomNo.trim(), type: roomTypeLabel(r.typeId) })),
    openAddRoom: () => setRoomSheet('new'),
    openRoom: (i: number) => setRoomSheet(i),
    roomSheet: {
      visible: roomSheet !== null,
      room: typeof roomSheet === 'number' ? unit.rooms[roomSheet] ?? null : null,
      onClose: () => setRoomSheet(null),
      onSave: saveRoom,
    },
    floorPlans: unit.floorPlans,
    uploadFloorPlan,
    removeFloorPlan,
    amenities: unit.amenities,
    toggleAmenity,
    amenityQuery,
    setAmenityQuery,
    photos: unit.photos,
    uploadPhotos,
    removePhoto,
    next,
    picker,
    pickerProps,
    openPicker: setPicker,
    closePicker: () => setPicker(null),
    pick,
  };
}

export type AddUnitVM = ReturnType<typeof useAddUnit>;
