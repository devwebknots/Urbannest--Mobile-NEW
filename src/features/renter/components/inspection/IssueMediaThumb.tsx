/**
 * IssueMediaThumb: square thumbnail for an issue's photo or video.
 * Photos show the picture; videos show a navy tile with a camera icon.
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { VideoCameraIcon } from '@/components/icons';
import { borderRadius, colors } from '@/config/theme';
import type { IssueMedia } from '../../types';

interface Props {
  media: IssueMedia;
  size: number;
}

export const IssueMediaThumb: React.FC<Props> = ({ media, size }) =>
  media.type === 'photo' ? (
    <Image source={{ uri: media.uri }} style={[styles.thumb, { width: size, height: size }]} />
  ) : (
    <View style={[styles.thumb, styles.video, { width: size, height: size }]}>
      <VideoCameraIcon size={size * 0.36} color={colors.white} />
    </View>
  );

const styles = StyleSheet.create({
  thumb: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.chipBlue,
  },
  video: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
  },
});

export default IssueMediaThumb;
