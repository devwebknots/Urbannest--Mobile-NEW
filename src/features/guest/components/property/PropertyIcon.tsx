/**
 * PropertyIcon: one of the property details line icons (white PNG), tinted.
 */

import React from 'react';
import { Image } from 'react-native';
import { propertyIcons } from '../../assets/guestAssets';
import type { PropertyIconName } from '../../types';

export const PropertyIcon: React.FC<{ name: PropertyIconName; size: number; color: string }> = ({
  name,
  size,
  color,
}) => (
  <Image
    source={propertyIcons[name]}
    style={{ width: size, height: size, tintColor: color }}
    resizeMode="contain"
  />
);

export default PropertyIcon;
