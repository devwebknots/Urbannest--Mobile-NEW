/**
 * LandlordIcon: one of the landlord dashboard line icons (white PNG), tinted.
 */

import React from 'react';
import { Image } from 'react-native';
import { landlordIcons } from '../assets/landlordAssets';
import type { LandlordIconName } from '../types';

export const LandlordIcon: React.FC<{
  name: LandlordIconName;
  size: number;
  color: string;
}> = ({ name, size, color }) => (
  <Image
    source={landlordIcons[name]}
    style={{ width: size, height: size, tintColor: color }}
    resizeMode="contain"
  />
);

export default LandlordIcon;
