/**
 * useAddProperty: ViewModel for the landlord's "Add New Property" page
 * (Property tab → Basic / Amenities; Unit tab unlocks after saving).
 *  - form fields + pickers (property type, ownership, country, state)
 *  - street address suggestions + "use current location" (shared
 *    useAddressLookup, free Photon search)
 *  - property photos (upload area + "+" tile, several at once) and a video
 *  - Location Preview: a picked suggestion / current location pins its
 *    exact point (zoomed in); a typed address is looked up (debounced) and
 *    the pin moves there; +/− zoom
 *  - Amenities: search + tile grid (multi-select by id); "Amenities Access"
 *    lists the selected shared facilities to grant units / tenants, then
 *    Generate Access (dialog)
 *  - Save & Continue / Save Property: success dialog, unlocks and opens the
 *    Unit tab
 */

import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useAppDialog } from '@/components/AppDialog';
import { UploadIcon } from '@/components/icons';
import { colors } from '@/config/theme';
import { US_STATES } from '@/features/application/constants';
import { useAddressLookup } from '@/features/application/hooks/useAddressLookup';
import { useDebounce } from '@/hooks/useDebounce';
import { navigationRef } from '@/navigation/navigationRef';
import { geocodeAddress } from '@/services/places/addressSearch';
import { moderateScale as ms } from '@/utils/responsive';
import { ONBOARDING_COUNTRIES } from '../onboarding/constants';
import {
  DEFAULT_MAP_POINT,
  MAX_PROPERTY_IMAGES,
  MAP_ZOOM,
  OWNERSHIP_TYPES,
  PROPERTY_AMENITIES,
  PROPERTY_TYPES,
} from './constants';

/** Screens-only phase: skip required-field checks (set false to turn on) */
const BYPASS_VALIDATION = true;

export type PropertyTab = 'property' | 'unit';
export type PropertySubTab = 'basic' | 'amenities';

export interface PropertyForm {
  name: string;
  typeId: string;
  value: string;
  builtYear: string;
  ownershipId: string;
  description: string;
  countryId: string;
  street1: string;
  street2: string;
  landmark: string;
  city: string;
  stateId: string;
  /** Typed state when the country has no list */
  region: string;
  zip: string;
}

export interface PickedMedia {
  readonly uri: string;
  readonly name: string;
}

type Picker = 'type' | 'ownership' | 'country' | 'state' | null;
type Errors = Partial<Record<keyof PropertyForm, string>>;

const EMPTY: PropertyForm = {
  name: '',
  typeId: '',
  value: '',
  builtYear: '',
  ownershipId: '',
  description: '',
  countryId: 'us',
  street1: '',
  street2: '',
  landmark: '',
  city: '',
  stateId: '',
  region: '',
  zip: '',
};

/** Fields whose edits move the pin by text lookup again */
const ADDRESS_KEYS: ReadonlySet<keyof PropertyForm> = new Set([
  'countryId',
  'street1',
  'city',
  'stateId',
  'region',
  'zip',
]);

const PHOTO = { mediaType: 'photo' as const, quality: 0.8 as const, maxWidth: 2000, maxHeight: 2000 };
const VIDEO = { mediaType: 'video' as const, videoQuality: 'high' as const };

export function useAddProperty(navigation?: { goBack: () => void }) {
  const [tab, setTab] = useState<PropertyTab>('property');
  const [subTab, setSubTab] = useState<PropertySubTab>('basic');
  const [unitUnlocked, setUnitUnlocked] = useState(false);
  const [form, setForm] = useState<PropertyForm>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [picker, setPicker] = useState<Picker>(null);
  const [images, setImages] = useState<PickedMedia[]>([]);
  const [video, setVideo] = useState<PickedMedia | null>(null);
  /** Selected amenity ids */
  const [amenities, setAmenities] = useState<string[]>([]);
  /** Amenity ids units / tenants get access to */
  const [access, setAccess] = useState<string[]>([]);
  const [amenityQuery, setAmenityQuery] = useState('');
  const [mapPoint, setMapPoint] = useState(DEFAULT_MAP_POINT);
  const [located, setLocated] = useState(false);
  const [zoom, setZoom] = useState(MAP_ZOOM.initial);
  const dialog = useAppDialog();
  const { show } = dialog;

  const hasStateList = form.countryId === 'us';
  /** Pin holds an exact point (suggestion / current location): skip the
   *  rough text lookup until the user edits the address again */
  const pinnedExact = useRef(false);

  const setField = useCallback((key: keyof PropertyForm, value: string) => {
    if (ADDRESS_KEYS.has(key)) {
      pinnedExact.current = false;
    }
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  // Street suggestions / current location fill the address fields
  const lookup = useAddressLookup((address, from) => {
    // Street Address 02 pick: fill only that field, keep Street Address 01
    // and the rest of the address (and the pin) as they are
    if (from === 'street2') {
      setForm(prev => ({ ...prev, street2: address.street1 || prev.street2 }));
      return;
    }
    const country = ONBOARDING_COUNTRIES.find(
      c => c.id === address.countryCode.toLowerCase(),
    );
    setForm(prev => ({
      ...prev,
      countryId: country?.id ?? prev.countryId,
      street1: address.street1 || prev.street1,
      street2: prev.street2,
      city: address.city || prev.city,
      stateId: country?.id === 'us' ? address.stateCode : prev.stateId,
      region: country?.id === 'us' ? prev.region : address.stateCode,
      zip: address.zip || prev.zip,
    }));
    // Drop the pin on the exact spot of the chosen address
    if (address.point) {
      pinnedExact.current = true;
      setMapPoint(address.point);
      setLocated(true);
      setZoom(MAP_ZOOM.pinned);
    }
  }, show, false); // any country: no "Outside the US" note

  // Location Preview follows the typed address (debounced, free service)
  const stateText = hasStateList ? form.stateId : form.region;
  const countryLabel = ONBOARDING_COUNTRIES.find(c => c.id === form.countryId)?.label;
  const addressQuery = useDebounce(
    form.street1.trim() && form.city.trim()
      ? [form.street1, form.city, stateText, form.zip, countryLabel]
          .map(s => s?.trim())
          .filter(Boolean)
          .join(', ')
      : '',
    900,
  );
  useEffect(() => {
    if (!addressQuery || pinnedExact.current) {
      return;
    }
    const controller = new AbortController();
    geocodeAddress(addressQuery, controller.signal)
      .then(point => {
        if (point) {
          setMapPoint(point);
          setLocated(true);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [addressQuery]);

  const goBack = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }, [navigation]);

  /** Camera / library choice for photos or a video */
  const pickMedia = useCallback(
    (
      title: string,
      kind: 'photo' | 'video',
      onPicked: (assets: Asset[]) => void,
      /** Library: how many can be picked at once */
      limit = 1,
    ) => {
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
      const options = kind === 'photo' ? PHOTO : VIDEO;
      show({
        tone: 'info',
        icon: createElement(UploadIcon, { size: ms(22), color: colors.navy }),
        title,
        message:
          kind === 'photo'
            ? 'Take a photo of the property or pick one from your library.'
            : 'Record a short walkthrough or pick a video from your library.',
        actions: [
          {
            label: kind === 'photo' ? 'Take Photo' : 'Record Video',
            onPress: () => launchCamera(options).then(handle),
          },
          {
            label: 'Choose from Library',
            variant: 'soft',
            onPress: () => launchImageLibrary({ ...options, selectionLimit: limit }).then(handle),
          },
          { label: 'Cancel', variant: 'link' },
        ],
      });
    },
    [show],
  );

  const toMedia = (a: Asset, fallback: string): PickedMedia => ({
    uri: a.uri!,
    name: a.fileName ?? fallback,
  });

  /** Upload area / "+" tile: add photos (several at once from the library) */
  const uploadImages = useCallback(() => {
    const left = MAX_PROPERTY_IMAGES - images.length;
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
      'Upload images',
      'photo',
      assets =>
        setImages(prev =>
          [
            ...prev,
            ...assets.map((a, i) => toMedia(a, `property_${prev.length + i + 1}.jpg`)),
          ].slice(0, MAX_PROPERTY_IMAGES),
        ),
      left,
    );
  }, [images.length, pickMedia, show]);

  const removeImage = useCallback(
    (uri: string) => setImages(prev => prev.filter(m => m.uri !== uri)),
    [],
  );

  const uploadVideo = useCallback(
    () =>
      pickMedia('Property video', 'video', ([a]) =>
        setVideo(toMedia(a, 'property_video.mp4')),
      ),
    [pickMedia],
  );

  const toggleAmenity = useCallback((id: string) => {
    setAmenities(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    // Unselecting an amenity also drops its access
    setAccess(prev => prev.filter(x => x !== id));
  }, []);

  const toggleAccess = useCallback(
    (id: string) => setAccess(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])),
    [],
  );

  /** Grid: every amenity, narrowed by the search */
  const shownAmenities = useMemo(() => {
    const q = amenityQuery.trim().toLowerCase();
    return q ? PROPERTY_AMENITIES.filter(a => a.label.toLowerCase().includes(q)) : PROPERTY_AMENITIES;
  }, [amenityQuery]);

  /** Access list: selected amenities that are shared facilities */
  const accessAmenities = useMemo(
    () => PROPERTY_AMENITIES.filter(a => a.accessName && amenities.includes(a.id)),
    [amenities],
  );

  const generateAccess = useCallback(() => {
    const granted = accessAmenities.filter(a => access.includes(a.id));
    if (granted.length === 0) {
      show({
        tone: 'info',
        title: 'Choose amenities first',
        message:
          accessAmenities.length === 0
            ? 'Select shared amenities above (gym, community hall, elevator, garden or laundry room), then tick the ones units and tenants can use.'
            : 'Tick the amenities units and tenants can use, then generate access.',
        actions: [{ label: 'OK', variant: 'brand' }],
      });
      return;
    }
    show({
      tone: 'success',
      title: 'Access generated',
      message: 'Units and tenants of this property can use these amenities.',
      details: granted.map(a => ({ label: a.label, value: 'Access on' })),
      actions: [{ label: 'Done', variant: 'brand' }],
    });
  }, [access, accessAmenities, show]);

  const check = useCallback((): Errors => {
    const e: Errors = {};
    if (BYPASS_VALIDATION) {
      return e;
    }
    const need = (key: keyof PropertyForm) => {
      if (!form[key].trim()) {
        e[key] = 'Required';
      }
    };
    need('name');
    need('typeId');
    need('ownershipId');
    need('countryId');
    need('street1');
    need('city');
    need(hasStateList ? 'stateId' : 'region');
    need('zip');
    return e;
  }, [form, hasStateList]);

  const saveAndContinue = useCallback(() => {
    const e = check();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setSubTab('basic');
      return;
    }
    show({
      tone: 'success',
      title: 'Property saved',
      message: 'Next, add the units inside this property.',
      details: form.name.trim() ? [{ label: 'Property', value: form.name.trim() }] : undefined,
      dismissible: false,
      actions: [
        {
          label: 'Add Units',
          variant: 'brand',
          onPress: () => {
            setUnitUnlocked(true);
            setTab('unit');
          },
        },
      ],
    });
  }, [check, show, form.name]);

  const cancel = useCallback(() => {
    show({
      tone: 'warning',
      title: 'Discard this property?',
      message: 'The details you entered will not be saved.',
      actions: [
        { label: 'Discard', variant: 'danger', onPress: goBack },
        { label: 'Keep Editing', variant: 'link' },
      ],
    });
  }, [show, goBack]);

  const selectTab = useCallback(
    (next: PropertyTab) => {
      if (next === 'unit' && !unitUnlocked) {
        show({
          tone: 'info',
          title: 'Unit details are locked',
          message: 'Save the property first, then add its units here.',
          actions: [{ label: 'OK' }],
        });
        return;
      }
      setTab(next);
    },
    [unitUnlocked, show],
  );

  const pick = useCallback(
    (id: string) => {
      if (picker === 'type') {
        setField('typeId', id);
      } else if (picker === 'ownership') {
        setField('ownershipId', id);
      } else if (picker === 'country') {
        pinnedExact.current = false;
        setForm(prev => ({ ...prev, countryId: id, stateId: '', region: '' }));
      } else if (picker === 'state') {
        setField('stateId', id);
      }
      setPicker(null);
    },
    [picker, setField],
  );

  const pickerProps = useMemo(() => {
    switch (picker) {
      case 'type':
        return { title: 'Property Type', options: PROPERTY_TYPES, selectedId: form.typeId };
      case 'ownership':
        return { title: 'Ownership Type', options: OWNERSHIP_TYPES, selectedId: form.ownershipId };
      case 'country':
        return { title: 'Country', options: ONBOARDING_COUNTRIES, selectedId: form.countryId };
      case 'state':
        return { title: 'State', options: US_STATES, selectedId: form.stateId };
      default:
        return { title: '', options: [], selectedId: undefined };
    }
  }, [picker, form.typeId, form.ownershipId, form.countryId, form.stateId]);

  const zoomIn = useCallback(() => setZoom(z => Math.min(MAP_ZOOM.max, z + 1)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(MAP_ZOOM.min, z - 1)), []);

  const addressLine = located
    ? [form.street1, form.city, hasStateList ? form.stateId : form.region]
        .map(s => s.trim())
        .filter(Boolean)
        .join(', ')
    : 'Enter the address to place the pin';

  return {
    tab,
    selectTab,
    unitUnlocked,
    subTab,
    setSubTab,
    form,
    errors,
    setField,
    hasStateList,
    typeLabel: PROPERTY_TYPES.find(t => t.id === form.typeId)?.label,
    ownershipLabel: OWNERSHIP_TYPES.find(t => t.id === form.ownershipId)?.label,
    countryLabel,
    stateLabel: US_STATES.find(s => s.id === form.stateId)?.label,
    lookup,
    images,
    uploadImages,
    removeImage,
    video,
    uploadVideo,
    removeVideo: () => setVideo(null),
    amenities,
    toggleAmenity,
    amenityQuery,
    setAmenityQuery,
    shownAmenities,
    accessAmenities,
    access,
    toggleAccess,
    generateAccess,
    map: { point: mapPoint, zoom, located, addressLine, zoomIn, zoomOut },
    picker,
    pickerProps,
    openPicker: setPicker,
    closePicker: () => setPicker(null),
    pick,
    saveAndContinue,
    cancel,
    goBack,
    dialog,
  };
}
