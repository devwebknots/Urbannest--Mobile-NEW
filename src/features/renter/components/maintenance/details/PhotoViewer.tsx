/**
 * PhotoViewer: full-screen dark view of one photo with a close button.
 * Used for the work photos on the Ticket Details timeline.
 */

import React from 'react';
import { Image, ImageSourcePropType, Modal, StyleSheet, View } from 'react-native';
import { CloseIcon } from '@/components/icons';
import { colors, spacing } from '@/config/theme';
import { useStatusBarInsets } from '@/hooks/useStatusBarInsets';
import { moderateScale as ms } from '@/utils/responsive';
import { CircleIconButton } from '../../CircleIconButton';

interface Props {
  image: ImageSourcePropType | null;
  onClose: () => void;
}

export const PhotoViewer: React.FC<Props> = ({ image, onClose }) => {
  const insets = useStatusBarInsets();
  return (
    <Modal
      visible={image !== null}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {image ? <Image source={image} style={styles.image} resizeMode="contain" /> : null}
        <View style={[styles.close, { top: insets.top + spacing.sm }]}>
          <CircleIconButton
            variant="solid"
            onPress={onClose}
            accessibilityLabel="Close photo"
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
  image: {
    width: '100%',
    height: '75%',
  },
  close: {
    position: 'absolute',
    right: spacing.screenHorizontal,
  },
});

export default PhotoViewer;
