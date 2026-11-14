/**
 * useLandlordOnboarding: ViewModel for the 3-step "Independent Landlord"
 * registration (Personal Details, Residential Address, Identity
 * Verification). Holds the form, checks each step before moving on, picks
 * the profile photo / ID files (camera or library, like the rental
 * application documents) and, on "Activate", shows the success
 * dialog and opens the landlord's Properties page (dashboard underneath).
 */

import { createElement, useCallback, useMemo, useState } from 'react';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useAppDialog } from '@/components/AppDialog';
import { UploadIcon } from '@/components/icons';
import { colors } from '@/config/theme';
import { PHONE_COUNTRIES, US_STATES } from '@/features/application/constants';
import { navigationRef } from '@/navigation/navigationRef';
import { moderateScale as ms } from '@/utils/responsive';
import {
  ID_TYPES,
  MAX_ID_DOCUMENTS,
  ONBOARDING_COUNTRIES,
  ONBOARDING_STEPS,
} from './constants';

export interface LandlordOnboardingNavigation {
  replace: (route: 'LandlordProperties') => void;
  goBack: () => void;
}

export interface OnboardingForm {
  firstName: string;
  lastName: string;
  phone: string;
  occupation: string;
  countryId: string;
  stateId: string;
  /** Typed state / region when the country has no list */
  region: string;
  street1: string;
  street2: string;
  city: string;
  zip: string;
  landmark: string;
  idTypeId: string;
  idNumber: string;
}

export interface OnboardingFile {
  readonly uri: string;
  readonly name: string;
}

type Picker = 'phoneCountry' | 'country' | 'state' | 'idType' | null;
type Errors = Partial<Record<keyof OnboardingForm | 'documents', string>>;

const EMPTY_FORM: OnboardingForm = {
  firstName: '',
  lastName: '',
  phone: '',
  occupation: '',
  countryId: 'us',
  stateId: '',
  region: '',
  street1: '',
  street2: '',
  city: '',
  zip: '',
  landmark: '',
  idTypeId: '',
  idNumber: '',
};

/**
 * Screens-only phase: skip the required-field checks so every step can be
 * reached with empty fields. Set to false to turn validation back on.
 */
const BYPASS_VALIDATION = true;

const PHOTO = { mediaType: 'photo' as const, quality: 0.8 as const, maxWidth: 2000, maxHeight: 2000 };
const REQUIRED = 'Required';

export function useLandlordOnboarding(navigation?: LandlordOnboardingNavigation) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingForm>(EMPTY_FORM);
  const [phoneCountryId, setPhoneCountryId] = useState('us');
  const [photo, setPhoto] = useState<OnboardingFile | null>(null);
  const [documents, setDocuments] = useState<OnboardingFile[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [picker, setPicker] = useState<Picker>(null);
  const dialog = useAppDialog();
  const { show } = dialog;

  const hasStateList = form.countryId === 'us';

  const setField = useCallback((key: keyof OnboardingForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  /** Errors of one step (empty object = step is fine) */
  const check = useCallback(
    (index: number): Errors => {
      const e: Errors = {};
      if (BYPASS_VALIDATION) {
        return e;
      }
      const need = (key: keyof OnboardingForm) => {
        if (!form[key].trim()) {
          e[key] = REQUIRED;
        }
      };
      if (index === 0) {
        need('firstName');
        need('lastName');
        if (form.phone.replace(/\D/g, '').length < 7) {
          e.phone = 'Enter a valid phone number';
        }
      } else if (index === 1) {
        need('countryId');
        need(hasStateList ? 'stateId' : 'region');
        need('street1');
        need('city');
        need('zip');
      } else {
        need('idTypeId');
        need('idNumber');
        if (documents.length === 0) {
          e.documents = 'Add at least one photo of your ID';
        }
      }
      return e;
    },
    [form, hasStateList, documents.length],
  );

  const goBack = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }, [navigation]);

  /** Top bar / footer back: previous step, or leave on step 1 */
  const back = useCallback(() => {
    if (step > 0) {
      setErrors({});
      setStep(step - 1);
    } else {
      goBack();
    }
  }, [step, goBack]);

  /**
   * After activation: Properties, with the dashboard under it so back (and
   * the dashboard's burger menu) work like for an existing landlord
   */
  const openProperties = useCallback(() => {
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 1,
        routes: [{ name: 'LandlordHome' }, { name: 'LandlordProperties' }],
      });
    } else if (navigation?.replace) {
      navigation.replace('LandlordProperties');
    }
  }, [navigation]);

  const continueToNext = useCallback(() => {
    const e = check(step);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      return;
    }
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    show({
      tone: 'success',
      title: 'Landlord profile activated',
      message: 'You can add your first property right away.',
      // Blank rows are dropped (fields can be empty while validation is bypassed)
      details: [
        { label: 'Name', value: `${form.firstName.trim()} ${form.lastName.trim()}`.trim() },
        { label: 'ID', value: ID_TYPES.find(t => t.id === form.idTypeId)?.label ?? '' },
      ].filter(d => d.value),
      dismissible: false,
      actions: [{ label: 'View Properties', variant: 'brand', onPress: openProperties }],
    });
  }, [check, step, show, form, openProperties]);

  /** Stepper tap: back any time, forward only through finished steps */
  const goToStep = useCallback(
    (index: number) => {
      if (index < step) {
        setErrors({});
        setStep(index);
        return;
      }
      for (let i = step; i < index; i++) {
        const e = check(i);
        if (Object.keys(e).length > 0) {
          setStep(i);
          setErrors(e);
          return;
        }
      }
      setStep(index);
    },
    [step, check],
  );

  /** Camera / library choice, then hands the picked photos to `onPicked` */
  const pickPhotos = useCallback(
    (title: string, limit: number, onPicked: (assets: Asset[]) => void) => {
      const handle = (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        const assets = (response.assets ?? []).filter(a => a.uri);
        if (response.errorCode || assets.length === 0) {
          show({
            tone: 'warning',
            title: 'Could not add file',
            message: response.errorMessage ?? 'Please try again.',
            actions: [{ label: 'OK' }],
          });
          return;
        }
        onPicked(assets);
      };
      show({
        tone: 'info',
        icon: createElement(UploadIcon, { size: ms(22), color: colors.navy }),
        title,
        message: 'Take a clear photo or pick one from your library.',
        actions: [
          { label: 'Take Photo', onPress: () => launchCamera(PHOTO).then(handle) },
          {
            label: 'Choose from Library',
            variant: 'soft',
            onPress: () => launchImageLibrary({ ...PHOTO, selectionLimit: limit }).then(handle),
          },
          { label: 'Cancel', variant: 'link' },
        ],
      });
    },
    [show],
  );

  const uploadPhoto = useCallback(
    () =>
      pickPhotos('Profile photo', 1, ([a]) =>
        setPhoto({ uri: a.uri!, name: a.fileName ?? 'profile.jpg' }),
      ),
    [pickPhotos],
  );

  const uploadDocuments = useCallback(() => {
    const left = MAX_ID_DOCUMENTS - documents.length;
    if (left <= 0) {
      show({
        tone: 'warning',
        title: 'Upload limit reached',
        message: `You can add up to ${MAX_ID_DOCUMENTS} files. Remove one to add another.`,
        actions: [{ label: 'OK' }],
      });
      return;
    }
    pickPhotos('Upload document(s)', left, assets => {
      setDocuments(prev =>
        [
          ...prev,
          ...assets.map((a, i) => ({
            uri: a.uri!,
            name: a.fileName ?? `id_document_${prev.length + i + 1}.jpg`,
          })),
        ].slice(0, MAX_ID_DOCUMENTS),
      );
      setErrors(prev => ({ ...prev, documents: undefined }));
    });
  }, [documents.length, pickPhotos, show]);

  const removeDocument = useCallback(
    (uri: string) => setDocuments(prev => prev.filter(d => d.uri !== uri)),
    [],
  );

  const pick = useCallback(
    (id: string) => {
      if (picker === 'phoneCountry') {
        setPhoneCountryId(id);
      } else if (picker === 'country') {
        // A new country clears the old state / region
        setForm(prev => ({ ...prev, countryId: id, stateId: '', region: '' }));
        setErrors(prev => ({ ...prev, countryId: undefined }));
      } else if (picker === 'state') {
        setField('stateId', id);
      } else if (picker === 'idType') {
        setField('idTypeId', id);
      }
      setPicker(null);
    },
    [picker, setField],
  );

  const pickerProps = useMemo(() => {
    switch (picker) {
      case 'phoneCountry':
        return { title: 'Country code', options: PHONE_COUNTRIES, selectedId: phoneCountryId };
      case 'country':
        return { title: 'Country', options: ONBOARDING_COUNTRIES, selectedId: form.countryId };
      case 'state':
        return { title: 'State / Region', options: US_STATES, selectedId: form.stateId };
      case 'idType':
        return { title: 'ID Type', options: ID_TYPES, selectedId: form.idTypeId };
      default:
        return { title: '', options: [], selectedId: undefined };
    }
  }, [picker, phoneCountryId, form.countryId, form.stateId, form.idTypeId]);

  const isLast = step === ONBOARDING_STEPS.length - 1;

  return {
    steps: ONBOARDING_STEPS,
    step,
    form,
    errors,
    setField,
    phoneCountry: PHONE_COUNTRIES.find(c => c.id === phoneCountryId) ?? PHONE_COUNTRIES[0],
    countryLabel: ONBOARDING_COUNTRIES.find(c => c.id === form.countryId)?.label,
    stateLabel: US_STATES.find(s => s.id === form.stateId)?.label,
    idTypeLabel: ID_TYPES.find(t => t.id === form.idTypeId)?.label,
    hasStateList,
    photo,
    uploadPhoto,
    documents,
    uploadDocuments,
    removeDocument,
    picker,
    pickerProps,
    openPicker: setPicker,
    closePicker: () => setPicker(null),
    pick,
    back,
    goToStep,
    continueToNext,
    // Short label: it shares the footer with "Back" (half width each)
    continueLabel: isLast ? 'Activate' : 'Continue',
    /** Name of the step before this one (footer "Back to …" link), if any */
    prevStepLabel: step > 0 ? ONBOARDING_STEPS[step - 1].label : undefined,
    isLast,
    dialog,
  };
}
