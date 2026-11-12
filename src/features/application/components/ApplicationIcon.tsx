/**
 * ApplicationIcon: one of the rental application line icons (white PNG), tinted.
 */

import React from 'react';
import { Image } from 'react-native';
import { applicationIcons } from '../assets/applicationAssets';
import type { ApplicationIconName } from '../types';

export const ApplicationIcon: React.FC<{
  name: ApplicationIconName;
  size: number;
  color: string;
}> = ({ name, size, color }) => (
  <Image
    source={applicationIcons[name]}
    style={{ width: size, height: size, tintColor: color }}
    resizeMode="contain"
  />
);

export default ApplicationIcon;
