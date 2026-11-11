/**
 * FloorPlanViewer: full-screen look at the floor plan ("View Floor Plan").
 * Pale page with the property name, the plan fitted to the width and a
 * round close button. Android back closes it.
 */

import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseIcon } from '@/components/icons';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { CircleIconButton } from '@/features/renter/components/CircleIconButton';
import { PROPERTY_IMAGE_ASPECT } from '../../assets/guestAssets';

interface Props {
  visible: boolean;
  title: string;
  image: ImageSourcePropType;
  onClose: () => void;
}

export const FloorPlanViewer: React.FC<Props> = ({ visible, title, image, onClose }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const imageH = Math.round(width / PROPERTY_IMAGE_ASPECT.floorPlan);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.bar}>
          <View style={styles.titles}>
            <Text style={styles.title}>Floor Plan</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <CircleIconButton
            onPress={onClose}
            accessibilityLabel="Close floor plan"
            size={ms(40)}
            icon={<CloseIcon size={ms(14)} color={colors.navy} />}
          />
        </View>
        <View style={styles.body}>
          <Image source={image} style={{ width, height: imageH }} resizeMode="contain" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  titles: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default FloorPlanViewer;
