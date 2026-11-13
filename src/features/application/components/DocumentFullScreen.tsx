/**
 * DocumentFullScreen: a document paper alone in a full-screen modal (the
 * file bar's full-screen button on Submitted Application and Lease
 * Review). Page tint, file name + round close button, the paper in a
 * scroll view (pinch to zoom on iOS).
 */

import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseIcon } from '@/components/icons';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { CircleIconButton } from '@/features/renter/components/CircleIconButton';
import { moderateScale as ms } from '@/utils/responsive';
import type { DocumentPaperModel } from '../types';
import { LeaseDocumentPaper } from './SubmittedApplicationParts';

export const DocumentFullScreen: React.FC<{
  visible: boolean;
  title: string;
  doc: DocumentPaperModel;
  onClose: () => void;
}> = ({ visible, title, doc, onClose }) => {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, spacing.md) + spacing.sm;
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.full, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.bar}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <CircleIconButton
            size={ms(40)}
            accessibilityLabel="Close full screen"
            onPress={onClose}
            icon={<CloseIcon size={ms(16)} color={colors.navy} />}
          />
        </View>
        <ScrollView
          maximumZoomScale={3}
          minimumZoomScale={1}
          centerContent
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: bottom + spacing.lg }]}
        >
          <LeaseDocumentPaper doc={doc} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.md,
  },
  title: {
    ...typographyPresets.cardTitle,
    flex: 1,
    color: colors.navy,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
});

export default DocumentFullScreen;
