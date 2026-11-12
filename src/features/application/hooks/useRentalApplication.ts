/**
 * useRentalApplication: state and actions for the rental application,
 * step 1 "Applicant & Household" (opened by Apply Now on a listing).
 * Holds the form fields, co-applicants, dependents, the pickers and the
 * add / edit sheet, checks the required fields on Continue, and asks
 * before throwing away changes on back.
 */

import { useCallback, useMemo, useState } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack } from '@/navigation/navigationRef';
import { GUEST_LISTINGS } from '@/features/guest/hooks/usePropertyDetails';
import { isValidEmail } from '@/utils/validators';
import {
  APPLICATION_CO_APPLICANTS,
  APPLICATION_DEPENDENTS,
  APPLICATION_PREFILL,
  APPLICATION_STEPS,
  DEPENDENT_RELATIONSHIPS,
  OCCUPANT_OPTIONS,
  PHONE_COUNTRIES,
  US_STATES,
} from '../constants';
import type {
  ApplicantField,
  ApplicantForm,
  CoApplicant,
  Dependent,
  PersonSheetState,
} from '../types';
import { formatDateInput, isValidDate } from '../utils';
import { useHistoryStep } from './useHistoryStep';

export interface RentalApplicationNavigation {
  goBack: () => void;
}

export type ApplicationPicker = 'country' | 'state' | 'occupants' | null;

const REQUIRED_MESSAGE = 'Required';

/** Error text per field (only the fields that fail) */
const validate = (form: ApplicantForm): Partial<Record<ApplicantField, string>> => {
  const errors: Partial<Record<ApplicantField, string>> = {};
  const required: ApplicantField[] = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'email',
    'phone',
    'street1',
    'city',
    'stateId',
    'zip',
    'moveInDate',
    'occupants',
  ];
  for (const key of required) {
    if (!form[key].trim()) {
      errors[key] = REQUIRED_MESSAGE;
    }
  }
  if (!errors.dateOfBirth && !isValidDate(form.dateOfBirth)) {
    errors.dateOfBirth = 'Use DD/MM/YYYY';
  }
  if (!errors.moveInDate && !isValidDate(form.moveInDate)) {
    errors.moveInDate = 'Use DD/MM/YYYY';
  }
  if (!errors.email && !isValidEmail(form.email)) {
    errors.email = 'Enter a valid email';
  }
  if (!errors.phone && form.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Enter a valid number';
  }
  if (!errors.zip && !/^\d{5}$/.test(form.zip.trim())) {
    errors.zip = '5 digits';
  }
  return errors;
};

let nextId = 0;
const newId = (prefix: string) => `${prefix}-${Date.now()}-${nextId++}`;

export function useRentalApplication(propertyId?: string, navigation?: RentalApplicationNavigation) {
  const property = useMemo(
    () => GUEST_LISTINGS.find(l => l.id === propertyId) ?? GUEST_LISTINGS[0],
    [propertyId],
  );

  const dialog = useAppDialog();
  const showDialog = dialog.show;

  const [form, setForm] = useState<ApplicantForm>(APPLICATION_PREFILL);
  const [coApplicants, setCoApplicants] = useState<CoApplicant[]>(() => [
    ...APPLICATION_CO_APPLICANTS,
  ]);
  const [dependents, setDependents] = useState<Dependent[]>(() => [...APPLICATION_DEPENDENTS]);
  // Errors show only after the first Continue, then update as the user types
  const [showErrors, setShowErrors] = useState(false);
  const [picker, setPicker] = useState<ApplicationPicker>(null);
  const [sheet, setSheet] = useState<PersonSheetState>(null);

  const setField = useCallback((key: ApplicantField, value: string) => {
    const isDate = key === 'dateOfBirth' || key === 'moveInDate';
    setForm(prev => ({ ...prev, [key]: isDate ? formatDateInput(value) : value }));
  }, []);

  const errors = useMemo(() => (showErrors ? validate(form) : {}), [form, showErrors]);

  const country = PHONE_COUNTRIES.find(c => c.id === form.countryId) ?? PHONE_COUNTRIES[0];

  const pick = useCallback(
    (id: string) => {
      if (picker === 'country') {
        setForm(prev => ({ ...prev, countryId: id }));
      } else if (picker === 'state') {
        setForm(prev => ({ ...prev, stateId: id }));
      } else if (picker === 'occupants') {
        setForm(prev => ({ ...prev, occupants: id }));
      }
      setPicker(null);
    },
    [picker],
  );

  const pickerProps = useMemo(() => {
    switch (picker) {
      case 'country':
        return {
          title: 'Choose a country code',
          options: PHONE_COUNTRIES.map(c => ({ id: c.id, label: `${c.flag}  ${c.label}` })),
          selectedId: form.countryId,
        };
      case 'state':
        return { title: 'Choose a state', options: US_STATES, selectedId: form.stateId };
      case 'occupants':
        return {
          title: 'Number of occupants',
          options: OCCUPANT_OPTIONS,
          selectedId: form.occupants,
        };
      default:
        return { title: '', options: [], selectedId: undefined };
    }
  }, [picker, form.countryId, form.stateId, form.occupants]);

  // Add / edit sheet
  const editing =
    sheet?.kind === 'dependent' && sheet.editId
      ? dependents.find(d => d.id === sheet.editId)
      : undefined;

  const saveCoApplicant = useCallback((name: string, email: string) => {
    setCoApplicants(prev => [
      ...prev,
      { id: newId('co'), name: name.trim(), email: email.trim(), status: 'invited' },
    ]);
    setSheet(null);
  }, []);

  const saveDependent = useCallback(
    (name: string, relationship: string) => {
      const editId = sheet?.kind === 'dependent' ? sheet.editId : undefined;
      setDependents(prev =>
        editId
          ? prev.map(d => (d.id === editId ? { ...d, name: name.trim(), relationship } : d))
          : [...prev, { id: newId('dep'), name: name.trim(), relationship }],
      );
      setSheet(null);
    },
    [sheet],
  );

  const removeDependent = useCallback(
    (id: string) => {
      const dep = dependents.find(d => d.id === id);
      setSheet(null);
      showDialog({
        tone: 'warning',
        title: 'Remove dependent?',
        message: `${dep?.name ?? 'This person'} will be taken off the application.`,
        actions: [
          {
            label: 'Remove',
            variant: 'danger',
            onPress: () => setDependents(prev => prev.filter(d => d.id !== id)),
          },
          { label: 'Keep', variant: 'link' },
        ],
      });
    },
    [dependents, showDialog],
  );

  const leave = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  // Step 2 (Rental & Financial History)
  const history = useHistoryStep(showDialog);

  const dirty =
    JSON.stringify(form) !== JSON.stringify(APPLICATION_PREFILL) ||
    JSON.stringify(coApplicants) !== JSON.stringify(APPLICATION_CO_APPLICANTS) ||
    JSON.stringify(dependents) !== JSON.stringify(APPLICATION_DEPENDENTS) ||
    history.hasData;

  // Which step is open (0 = Applicant & Household)
  const [currentStep, setCurrentStep] = useState(0);
  const lastStep = APPLICATION_STEPS.length - 1;

  const back = useCallback(() => {
    // Inside the flow, back goes to the previous step
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      return;
    }
    if (!dirty) {
      leave();
      return;
    }
    showDialog({
      tone: 'warning',
      title: 'Leave application?',
      message: 'The changes you made on this step will be lost.',
      actions: [
        { label: 'Discard Changes', variant: 'danger', onPress: leave },
        { label: 'Keep Editing', variant: 'link' },
      ],
    });
  }, [currentStep, dirty, leave, showDialog]);

  /** Step 1 must be complete before moving on; shows the errors if not */
  const checkHousehold = useCallback(() => {
    const found = validate(form);
    const missing = Object.keys(found).length;
    if (missing === 0) {
      return true;
    }
    setShowErrors(true);
    if (currentStep !== 0) {
      setCurrentStep(0);
    }
    showDialog({
      tone: 'info',
      title: 'A few details missing',
      message: `Please check the ${missing === 1 ? 'highlighted field' : `${missing} highlighted fields`} before you continue.`,
      actions: [{ label: 'OK', variant: 'brand' }],
    });
    return false;
  }, [currentStep, form, showDialog]);

  const submit = useCallback(() => {
    showDialog({
      tone: 'success',
      title: 'Application Submitted',
      message: `Your application for ${property.name} has been sent. We'll let you know as soon as the landlord replies.`,
      details: [
        { label: 'Applicant', value: `${form.firstName} ${form.lastName}`.trim() },
        { label: 'Move-in', value: form.moveInDate },
        { label: 'Occupants', value: form.occupants },
      ],
      dismissible: false,
      actions: [{ label: 'Done', variant: 'brand', onPress: leave }],
    });
  }, [form, leave, property.name, showDialog]);

  /** Footer button: next step, or submit on the last one */
  const continueToNext = useCallback(() => {
    if (currentStep === 0 && !checkHousehold()) {
      return;
    }
    if (currentStep === 1 && !history.check()) {
      return;
    }
    if (currentStep < lastStep) {
      setCurrentStep(currentStep + 1);
    } else {
      submit();
    }
  }, [checkHousehold, currentStep, history, lastStep, submit]);

  /**
   * Tapping a step in the stepper: earlier steps open straight away; later
   * ones need every step before them complete (steps 1 and 2 have fields).
   */
  const goToStep = useCallback(
    (index: number) => {
      if (index === currentStep) {
        return;
      }
      for (let s = currentStep; s < index; s++) {
        if (s === 0 && !checkHousehold()) {
          return;
        }
        if (s === 1) {
          if (currentStep === 1) {
            if (!history.check()) {
              return;
            }
          } else if (!history.isComplete) {
            setCurrentStep(1);
            showDialog({
              tone: 'info',
              title: 'Complete your history first',
              message: 'Add your residence and employment details to unlock the next steps.',
              actions: [{ label: 'OK', variant: 'brand' }],
            });
            return;
          }
        }
      }
      setCurrentStep(index);
    },
    [checkHousehold, currentStep, history, showDialog],
  );

  const continueLabel =
    currentStep === 0
      ? `Continue to Stage ${currentStep + 2}`
      : currentStep === lastStep
        ? 'Submit Application'
        : 'Save & Continue';

  return {
    property,
    steps: APPLICATION_STEPS,
    currentStep,
    isLastStep: currentStep === lastStep,
    continueLabel,
    goToStep,
    history,
    form,
    setField,
    errors,
    country,
    stateLabel: form.stateId || undefined,
    picker,
    pickerProps,
    openPicker: setPicker,
    closePicker: () => setPicker(null),
    pick,
    coApplicants,
    dependents,
    relationships: DEPENDENT_RELATIONSHIPS,
    sheet,
    editing,
    addCoApplicant: () => setSheet({ kind: 'coApplicant' }),
    addDependent: () => setSheet({ kind: 'dependent' }),
    editDependent: (id: string) => setSheet({ kind: 'dependent', editId: id }),
    closeSheet: () => setSheet(null),
    saveCoApplicant,
    saveDependent,
    removeDependent,
    back,
    continueToNext,
    dialog: dialog.props,
  };
}
