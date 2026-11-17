/**
 * PmsIcon: one of the PMS home line icons (white PNG), tinted.
 */

import React from 'react';
import { Image } from 'react-native';
import { pmsIcons, type PmsIconName } from '../assets/pmsAssets';

export const PmsIcon: React.FC<{
  name: PmsIconName;
  size: number;
  color: string;
}> = ({ name, size, color }) => (
  <Image
    source={pmsIcons[name]}
    style={{ width: size, height: size, tintColor: color }}
    resizeMode="contain"
  />
);

export default PmsIcon;
