/**
 * RenterIcon: one of the dashboard line icons (white PNG), tinted.
 */

import React from 'react';
import { Image } from 'react-native';
import { renterIcons } from '../../assets/renterAssets';

export type RenterIconName = keyof typeof renterIcons;

export const RenterIcon: React.FC<{ name: RenterIconName; size: number; color: string }> = ({
  name,
  size,
  color,
}) => (
  <Image
    source={renterIcons[name]}
    style={{ width: size, height: size, tintColor: color }}
    resizeMode="contain"
  />
);

export default RenterIcon;
