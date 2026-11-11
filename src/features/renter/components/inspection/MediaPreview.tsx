/**
 * MediaPreview: full-screen view of one added photo or video (tap a
 * thumbnail on the request form). Dark backdrop, close button at the top
 * right; photos fit the screen, videos play with the player's own
 * controls (play / pause / seek).
 */

import React from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { CloseIcon } from '@/components/icons';
import { colors, spacing } from '@/config/theme';
import { useStatusBarInsets } from '@/hooks/useStatusBarInsets';
import { moderateScale as ms } from '@/utils/responsive';
import { CircleIconButton } from '../CircleIconButton';
import type { IssueMedia } from '../../types';

interface Props {
  media: IssueMedia | null;
  onClose: () => void;
}

export const MediaPreview: React.FC<Props> = ({ media, onClose }) => {
  const insets = useStatusBarInsets();
  return (
    <Modal
      visible={media !== null}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {media?.type === 'photo' ? (
          <Image source={{ uri: media.uri }} style={styles.media} resizeMode="contain" />
        ) : null}
        {media?.type === 'video' ? (
          <Video
            source={{ uri: media.uri }}
            style={styles.media}
            resizeMode="contain"
            controls
            paused={false}
            playInBackground={false}
            ignoreSilentSwitch="ignore"
          />
        ) : null}
        <View style={[styles.close, { top: insets.top + spacing.sm }]}>
          <CircleIconButton
            variant="solid"
            onPress={onClose}
            accessibilityLabel={media?.type === 'video' ? 'Close video' : 'Close photo'}
            icon={<CloseIcon size={ms(14)} color={colors.navy} />}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(11,29,58,0.96)',
  },
  media: {
    width: '100%',
    height: '75%',
  },
  close: {
    position: 'absolute',
    right: spacing.screenHorizontal,
  },
});

export default MediaPreview;
