/**
 * useHistoryStep: state for step 2 of the rental application, "Rental &
 * Financial History" (used inside useRentalApplication).
 *  - Residences: an inline form ("Add Residence" / "Cancel") adds a
 *    residence to the list; rows can be edited or removed; "+ Add Another
 *    Residence" opens the form again.
 *  - Employment & Income: status, annual income, and (for employed /
 *    self-employed) employer, job title and dates.
 * `check()` runs on Save & Continue: saves a filled-in open residence form,
 * needs at least one residence and a complete employment block, shows the
 * errors and an info dialog otherwise.
 */

import { useCallback, useMemo, useState } from 'react';
import type { AppDialogConfig } from '@/components/AppDialog';
import {
  EMPLOYED_STATUS_IDS,
  EMPLOYMENT_STATUSES,
  EMPTY_EMPLOYMENT,
  EMPTY_RESIDENCE,
  RESIDENCE_HOLD_TYPES,
  US_STATES,
} from '../constants';
import type {
  EmploymentField,
  EmploymentForm,
  Residence,
  ResidenceField,
  ResidenceForm,
} from '../types';
import { formatDateInput, formatMoneyInput, monthYear, moneyValue, parseDate } from '../utils';

export type HistoryPicker = 'holdType' | 'state' | 'status' | null;

type Errors<K extends string> = Partial<Record<K, string>>;

const REQUIRED = 'Required';
const DATE_FIELDS = ['startDate', 'endDate'];

/** Start / end dates: real dates, not in the future, end after start */
const checkDates = <K extends string>(
  errors: Errors<K>,
  startKey: K,
  endKey: K,
  start: string,
  end: string,
  startRequired: boolean,
) => {
  const today = new Date();
  const s = parseDate(start);
  if (!start) {
    if (startRequired) {
      errors[startKey] = REQUIRED;
    }
  } else if (!s) {
    errors[startKey] = 'Use DD/MM/YYYY';
  } else if (s > today) {
    errors[startKey] = "Can't be in the future";
  }
  if (end) {
    const e = parseDate(end);
    if (!e) {
      errors[endKey] = 'Use DD/MM/YYYY';
    } else if (s && e < s) {
      errors[endKey] = 'Must be after the start date';
    }
  }
};

const validateResidence = (f: ResidenceForm): Errors<ResidenceField> => {
  const errors: Errors<ResidenceField> = {};
  (['holdType', 'street1', 'city', 'stateId', 'zip'] as const).forEach(k => {
    if (!f[k].trim()) {
      errors[k] = REQUIRED;
    }
  });
  if (!errors.zip && !/^\d{5}$/.test(f.zip.trim())) {
    errors.zip = '5 digits';
  }
  if (f.holdType === 'rented' && moneyValue(f.rent) === 0) {
    errors.rent = REQUIRED;
  }
  checkDates(errors, 'startDate', 'endDate', f.startDate, f.endDate, true);
  return errors;
};

export const isEmployed = (status: string) => EMPLOYED_STATUS_IDS.includes(status);

const validateEmployment = (f: EmploymentForm): Errors<EmploymentField> => {
  const errors: Errors<EmploymentField> = {};
  if (!f.status) {
    errors.status = REQUIRED;
  }
  if (moneyValue(f.income) === 0) {
    errors.income = REQUIRED;
  }
  if (isEmployed(f.status)) {
    if (!f.employer.trim()) {
      errors.employer = REQUIRED;
    }
    if (!f.jobTitle.trim()) {
      errors.jobTitle = REQUIRED;
    }
    checkDates(errors, 'startDate', 'endDate', f.startDate, f.endDate, true);
  }
  return errors;
};

const labelOf = (list: readonly { id: string; label: string }[], id: string) =>
  list.find(o => o.id === id)?.label;

/** Row text for a saved residence */
export const residenceSummary = (r: ResidenceForm) => ({
  title: [r.street1.trim(), r.street2.trim()].filter(Boolean).join(', '),
  detail: [
    labelOf(RESIDENCE_HOLD_TYPES, r.holdType),
    `${monthYear(r.startDate)} – ${r.endDate ? monthYear(r.endDate) : 'Present'}`,
    moneyValue(r.rent) > 0 ? `$${r.rent}/mo` : undefined,
  ]
    .filter(Boolean)
    .join(' · '),
  place: `${r.city.trim()}, ${r.stateId} ${r.zip.trim()}`,
});

let nextId = 0;

export function useHistoryStep(showDialog: (config: AppDialogConfig) => void) {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [residence, setResidence] = useState<ResidenceForm>(EMPTY_RESIDENCE);
  const [formOpen, setFormOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showResidenceErrors, setShowResidenceErrors] = useState(false);

  const [employment, setEmployment] = useState<EmploymentForm>(EMPTY_EMPLOYMENT);
  const [showEmploymentErrors, setShowEmploymentErrors] = useState(false);

  const [picker, setPicker] = useState<HistoryPicker>(null);

  const setResidenceField = useCallback((key: ResidenceField, value: string) => {
    const v = DATE_FIELDS.includes(key)
      ? formatDateInput(value)
      : key === 'rent'
        ? formatMoneyInput(value)
        : value;
    setResidence(prev => ({ ...prev, [key]: v }));
  }, []);

  const setEmploymentField = useCallback((key: EmploymentField, value: string) => {
    const v = DATE_FIELDS.includes(key)
      ? formatDateInput(value)
      : key === 'income'
        ? formatMoneyInput(value)
        : value;
    setEmployment(prev => ({ ...prev, [key]: v }));
  }, []);

  const residenceErrors = useMemo(
    () => (showResidenceErrors ? validateResidence(residence) : {}),
    [residence, showResidenceErrors],
  );
  const employmentErrors = useMemo(
    () => (showEmploymentErrors ? validateEmployment(employment) : {}),
    [employment, showEmploymentErrors],
  );

  const resetForm = useCallback(() => {
    setResidence(EMPTY_RESIDENCE);
    setEditingId(null);
    setShowResidenceErrors(false);
  }, []);

  /** Adds / updates the open residence; false (and errors shown) if incomplete */
  const commitResidence = useCallback((): boolean => {
    if (Object.keys(validateResidence(residence)).length > 0) {
      setShowResidenceErrors(true);
      return false;
    }
    setResidences(prev =>
      editingId
        ? prev.map(r => (r.id === editingId ? { ...residence, id: editingId } : r))
        : [...prev, { ...residence, id: `res-${Date.now()}-${nextId++}` }],
    );
    resetForm();
    setFormOpen(false);
    return true;
  }, [editingId, residence, resetForm]);

  const cancelResidence = useCallback(() => {
    resetForm();
    // With nothing saved yet the form stays, just cleared
    setFormOpen(residences.length === 0);
  }, [residences.length, resetForm]);

  const addAnother = useCallback(() => {
    resetForm();
    setFormOpen(true);
  }, [resetForm]);

  const editResidence = useCallback(
    (id: string) => {
      const r = residences.find(x => x.id === id);
      if (!r) {
        return;
      }
      setResidence({
        holdType: r.holdType,
        street1: r.street1,
        street2: r.street2,
        city: r.city,
        stateId: r.stateId,
        zip: r.zip,
        landlordName: r.landlordName,
        landlordContact: r.landlordContact,
        startDate: r.startDate,
        endDate: r.endDate,
        rent: r.rent,
        reason: r.reason,
      });
      setEditingId(id);
      setShowResidenceErrors(false);
      setFormOpen(true);
    },
    [residences],
  );

  const removeResidence = useCallback(
    (id: string) => {
      const r = residences.find(x => x.id === id);
      showDialog({
        tone: 'warning',
        title: 'Remove residence?',
        message: `${r ? residenceSummary(r).title : 'This residence'} will be taken off your history.`,
        actions: [
          {
            label: 'Remove',
            variant: 'danger',
            onPress: () => {
              const left = residences.length - 1;
              setResidences(prev => prev.filter(x => x.id !== id));
              if (editingId === id) {
                resetForm();
              }
              // Nothing left: show the empty form again
              if (left === 0) {
                setFormOpen(true);
              } else if (editingId === id) {
                setFormOpen(false);
              }
            },
          },
          { label: 'Keep', variant: 'link' },
        ],
      });
    },
    [editingId, residences, resetForm, showDialog],
  );

  /** Save & Continue */
  const check = useCallback((): boolean => {
    let problems = 0;
    let saved = residences.length;
    const hasInput = Object.values(residence).some(v => v.trim().length > 0);
    if (formOpen && (hasInput || saved === 0)) {
      if (commitResidence()) {
        saved += 1;
      } else {
        problems += Object.keys(validateResidence(residence)).length;
      }
    }
    const empErrors = Object.keys(validateEmployment(employment)).length;
    if (empErrors > 0) {
      setShowEmploymentErrors(true);
      problems += empErrors;
    }
    if (problems === 0 && saved > 0) {
      return true;
    }
    showDialog({
      tone: 'info',
      title: saved === 0 ? 'Add your residence' : 'A few details missing',
      message:
        saved === 0
          ? 'Add at least your current home, then check the highlighted fields.'
          : `Please check the ${problems === 1 ? 'highlighted field' : `${problems} highlighted fields`} before you continue.`,
      actions: [{ label: 'OK', variant: 'brand' }],
    });
    return false;
  }, [commitResidence, employment, formOpen, residence, residences.length, showDialog]);

  const pick = useCallback(
    (id: string) => {
      if (picker === 'holdType') {
        setResidence(prev => ({ ...prev, holdType: id }));
      } else if (picker === 'state') {
        setResidence(prev => ({ ...prev, stateId: id }));
      } else if (picker === 'status') {
        setEmployment(prev => ({ ...prev, status: id }));
      }
      setPicker(null);
    },
    [picker],
  );

  const pickerProps = useMemo(() => {
    switch (picker) {
      case 'holdType':
        return {
          title: 'How did you hold this residence?',
          options: RESIDENCE_HOLD_TYPES,
          selectedId: residence.holdType,
        };
      case 'state':
        return { title: 'Choose a state', options: US_STATES, selectedId: residence.stateId };
      case 'status':
        return {
          title: 'Employment status',
          options: EMPLOYMENT_STATUSES,
          selectedId: employment.status,
        };
      default:
        return { title: '', options: [], selectedId: undefined };
    }
  }, [picker, residence.holdType, residence.stateId, employment.status]);

  const isComplete =
    residences.length > 0 && Object.keys(validateEmployment(employment)).length === 0;
  const hasData =
    residences.length > 0 ||
    Object.values(residence).some(v => v.trim().length > 0) ||
    Object.values(employment).some(v => v.trim().length > 0);

  return {
    isComplete,
    hasData,
    residences,
    residence,
    setResidenceField,
    residenceErrors,
    holdTypeLabel: labelOf(RESIDENCE_HOLD_TYPES, residence.holdType),
    rentRequired: residence.holdType === 'rented',
    formOpen,
    editing: editingId !== null,
    saveResidence: commitResidence,
    cancelResidence,
    addAnother,
    editResidence,
    removeResidence,
    employment,
    setEmploymentField,
    employmentErrors,
    statusLabel: labelOf(EMPLOYMENT_STATUSES, employment.status),
    employed: isEmployed(employment.status),
    picker,
    pickerProps,
    openPicker: setPicker,
    closePicker: () => setPicker(null),
    pick,
    check,
  };
}

export type HistoryStepModel = ReturnType<typeof useHistoryStep>;
