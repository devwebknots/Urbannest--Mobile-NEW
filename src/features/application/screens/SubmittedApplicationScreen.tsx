/**
 * SubmittedApplicationScreen: the lease application the renter sent,
 * opened by "View" on the Application Submitted journey step (Application
 * Details). Layout from the "Submitted Application" design, app standards:
 *  - light top bar: back + "Submitted Application"
 *  - DocumentHeading: icon tile, "Rental Application" (subtitle hidden)
 *  - one white card: FileBar (PDF tile, name + size, download / share /
 *    full screen) over the document paper
 *  - "Close" (brand button) pinned to the bottom: commented out for now
 * Full screen opens the paper alone in a modal (pinch to zoom on iOS).
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the hidden Close button
import { Button } from '@/components/Button';
import { borderRadius, colors, shadows, spacing } from '@/config/theme';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { Reveal } from '@/features/renter/components/Reveal';
import { moderateScale as ms } from '@/utils/responsive';
import {
  DocumentHeading,
  FileBar,
  LeaseDocumentPaper,
} from '../components/SubmittedApplicationParts';
import { DocumentFullScreen } from '../components/DocumentFullScreen';
import {
  SubmittedApplicationNavigation,
  useSubmittedApplication,
} from '../hooks/useSubmittedApplication';
import type { ApplicationRecord } from '../types';

interface Props {
  navigation?: SubmittedApplicationNavigation;
  route: { params: { record: ApplicationRecord } };
}

/** Button height + its padding above (for the hidden Close footer) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the hidden Close button
const FOOTER = ms(48) + spacing.lg;

export const SubmittedApplicationScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useSubmittedApplication(route.params.record, navigation);
  const bottom = Math.max(insets.bottom, spacing.md) + spacing.sm;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          // Close footer hidden: FOOTER + bottom + spacing.xl while it shows
          paddingBottom: bottom + spacing.xl,
        }}
      >
        {/* Soft blue glow behind the top of the page (as on Application Details) */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />

        <LightTopBar title="Submitted Application" titleAlign="left" onBack={vm.back} />

        <Reveal delay={40}>
          <View style={[styles.padded, styles.heading]}>
            <DocumentHeading
              title="Rental Application"
              // Subtitle hidden for now
              // subtitle="Your submitted application for lease"
            />
          </View>
        </Reveal>

        <Reveal delay={110}>
          <View style={styles.padded}>
            <View style={styles.card}>
              <FileBar
                name={vm.fileName}
                meta={vm.fileSize}
                onDownload={vm.download}
                onShare={vm.share}
                onExpand={vm.openFullScreen}
              />
              <View style={styles.paperWell}>
                <LeaseDocumentPaper doc={vm.document} />
              </View>
            </View>
          </View>
        </Reveal>
      </ScrollView>

      {/* Pinned Close: hidden for now (back button covers it)
      <View style={[styles.footer, { paddingBottom: bottom }]}>
        <Button title="Close" variant="brand" size="lg" onPress={vm.back} />
      </View> */}

      {/* Full screen: the paper alone */}
      <DocumentFullScreen
        visible={vm.fullScreen}
        title={vm.fileName}
        doc={vm.document}
        onClose={vm.closeFullScreen}
      />

      <AppDialog {...vm.dialog} />
    </View>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';
// colors.pageTint (#EEF3F9) as rgb, for the footer fade
const TINT = '238,243,249';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: ms(420),
    backgroundImage: `radial-gradient(circle at 85% 5%, rgba(${BLUE},0.2) 0%, rgba(${BLUE},0) 55%), linear-gradient(180deg, rgba(${BLUE},0.1) 0%, rgba(${BLUE},0) 100%)`,
  },
  padded: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  heading: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  card: {
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.md,
  },
  // Pale well the paper sits in (the design's grey-blue backdrop)
  paperWell: {
    padding: spacing.md,
    backgroundColor: `rgba(${TINT},0.7)`,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundImage: `linear-gradient(180deg, rgba(${TINT},0) 0%, rgba(${TINT},0.96) 30%, rgba(${TINT},1) 100%)`,
  },
});

export default SubmittedApplicationScreen;
