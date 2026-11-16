/**
 * Address search with no API key: Photon (https://photon.komoot.io), a free
 * geocoder on OpenStreetMap data (fair use, no account).
 *  - searchAddresses: suggestions while typing (houses / streets, any country)
 *  - addressFromLocation: reverse lookup for "Use current location"
 * Results come back as a `ParsedAddress` the forms drop into their fields.
 * Show "© OpenStreetMap" next to results (data licence).
 */

export interface AddressSuggestion {
  readonly id: string;
  /** "35 Spring Borough Ct" */
  readonly main: string;
  /** "O'Fallon, MO 63368" */
  readonly secondary: string;
  readonly address: ParsedAddress;
}

export interface ParsedAddress {
  readonly street1: string;
  readonly street2: string;
  readonly city: string;
  /** Two-letter state code for US addresses, else the region name */
  readonly stateCode: string;
  readonly zip: string;
  /** ISO country code, e.g. "US" */
  readonly countryCode: string;
  /** Exact map point of the result (suggestion / current location) */
  readonly point?: { readonly lat: number; readonly lng: number };
}

export class AddressLookupError extends Error {
  constructor(message: string, readonly code: 'network' | 'not-found') {
    super(message);
  }
}

const BASE = 'https://photon.komoot.io';

/** Full US state names -> postal codes (Photon returns names) */
const US_STATE_CODES: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', 'district of columbia': 'DC',
  florida: 'FL', georgia: 'GA', hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN',
  iowa: 'IA', kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND',
  ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT',
  vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI',
  wyoming: 'WY',
};

interface PhotonProps {
  osm_id?: number;
  osm_type?: string;
  name?: string;
  housenumber?: string;
  street?: string;
  city?: string;
  town?: string;
  village?: string;
  district?: string;
  county?: string;
  state?: string;
  postcode?: string;
  countrycode?: string;
  country?: string;
  type?: string;
}

type PhotonCoords = [number, number] | undefined;

const parse = (p: PhotonProps, coords?: PhotonCoords): ParsedAddress => {
  const country = (p.countrycode ?? '').toUpperCase();
  const state = p.state ?? '';
  const street = p.street
    ? [p.housenumber, p.street].filter(Boolean).join(' ')
    : p.type === 'street'
      ? p.name ?? ''
      : [p.housenumber, p.name].filter(Boolean).join(' ');
  return {
    street1: street,
    street2: '',
    city: p.city ?? p.town ?? p.village ?? p.district ?? p.county ?? '',
    stateCode: country === 'US' ? US_STATE_CODES[state.toLowerCase()] ?? state : state,
    zip: (p.postcode ?? '').split(/[-\s]/)[0],
    countryCode: country,
    point: coords ? { lat: coords[1], lng: coords[0] } : undefined,
  };
};

const getJson = async (url: string, signal?: AbortSignal) => {
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } }).catch(() => {
    throw new AddressLookupError('Request failed', 'network');
  });
  if (!res.ok) {
    throw new AddressLookupError(`Request failed ${res.status}`, 'network');
  }
  return res.json();
};

export async function searchAddresses(
  input: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const url =
    `${BASE}/api/?q=${encodeURIComponent(input)}&lang=en&limit=10` +
    '&layer=house&layer=street';
  const json = await getJson(url, signal);
  const seen = new Set<string>();
  // Any country (the user may not be in the US); non-US rows name the country
  return (json.features ?? [])
    .map((f: { properties: PhotonProps; geometry?: { coordinates?: PhotonCoords } }) => {
      const p = f.properties;
      const address = parse(p, f.geometry?.coordinates);
      return {
        id: `${p.osm_type ?? ''}${p.osm_id ?? Math.random()}`,
        main: address.street1 || p.name || '',
        secondary: [
          address.city,
          [address.stateCode, address.zip].filter(Boolean).join(' '),
          address.countryCode !== 'US' ? p.country : undefined,
        ]
          .filter(Boolean)
          .join(', '),
        address,
      };
    })
    .filter((s: AddressSuggestion) => {
      const key = `${s.main}|${s.secondary}`;
      if (!s.main || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, 5);
}

export async function addressFromLocation(lat: number, lng: number): Promise<ParsedAddress> {
  const json = await getJson(`${BASE}/reverse?lat=${lat}&lon=${lng}&lang=en&limit=1`);
  const props: PhotonProps | undefined = json.features?.[0]?.properties;
  if (!props) {
    throw new AddressLookupError('No address here', 'not-found');
  }
  // Pin the phone's real position, not the matched building's
  return parse(props, [lng, lat]);
}

/** Map point for a typed address (Location Preview); null if none found */
export async function geocodeAddress(
  query: string,
  signal?: AbortSignal,
): Promise<{ lat: number; lng: number } | null> {
  const json = await getJson(
    `${BASE}/api/?q=${encodeURIComponent(query)}&lang=en&limit=1`,
    signal,
  );
  const coords: [number, number] | undefined = json.features?.[0]?.geometry?.coordinates;
  return coords ? { lat: coords[1], lng: coords[0] } : null;
}
