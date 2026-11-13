/**
 * OfferAcceptanceScreen: the owner's lease offer for an approved
 * application, opened from the Offer Acceptance journey step (Application
 * Details). Layout from the "Offer Acceptance" design, app standards:
 *  - light top bar: back + "Offer Acceptance"
 *  - property photo
 *  - OfferReceivedCard ("Offer Received" + line + illustration)
 *  - OfferPropertyRow: name, address, category chip
 *  - "Lease Information" (heading outside, white box): start date,
 *    move-in date, duration
 *  - "Payment Details" (heading outside, white box): rent, deposit, one time
 *    payment strip
 *  - Reject (light, navy rim) | Accept (brand), side by side
 * Already accepted (step done): "Offer Accepted" and no buttons.
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/config/theme';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { Reveal } from '@/features/renter/components/Reveal';
import { moderateScale as ms } from '@/utils/responsive';
import {
  LeaseFactsRow,
  OfferSection,
  OfferPhoto,
  OfferPropertyRow,
  OfferReceivedCard,
  PaymentRows,
} from '../components/OfferAcceptanceParts';
import { OfferAcceptanceNavigation, useOfferAcceptance } from '../hooks/useOfferAcceptance';
import { offerStore, useOfferStore } from '../store/offerStore';
import type { ApplicationRecord } from '../types';

interface Props {
  navigation?: OfferAcceptanceNavigation;
  route: { params: { record: ApplicationRecord; accepted?: boolean } };
}

export const OfferAcceptanceScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { record } = route.params;
  // Re-render once accepted (hides the buttons behind the success dialog)
  useOfferStore();
  const accepted = route.params.accepted === true || offerStore.isAccepted(record.id);
  const vm = useOfferAcceptance(record, navigation);
  const bottom = Math.max(insets.bottom, spacing.md) + spacing.sm;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: bottom + spacing.lg,
        }}
      >
        {/* Soft blue glow behind the top of the page (as on Application Details) */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />

        <LightTopBar title="Offer Acceptance" titleAlign="left" onBack={vm.back} />

        <View style={styles.padded}>
          <Reveal delay={40}>
            <View style={styles.photo}>
              <OfferPhoto source={record.image} label={`${record.propertyName} photo`} />
            </View>
          </Reveal>

          <Reveal delay={90}>
            <OfferReceivedCard
              title={accepted ? 'Offer Accepted' : 'Offer Received'}
              message={
                accepted
                  ? 'You accepted the owner’s lease offer. Your lease is being prepared for review.'
                  : 'Your application has been accepted! The owner has sent you a lease offer. Review the details below and respond.'
              }
            />
          </Reveal>

          <Reveal delay={140}>
            <View style={styles.section}>
              <OfferPropertyRow
                name={record.propertyName}
                address={vm.offer.address}
                category={vm.offer.category}
              />
            </View>
          </Reveal>

          {/* Heading + line on the page, content in white boxes */}
          <Reveal delay={190}>
            <View style={styles.pageSection}>
              <OfferSection
                title="Lease Information"
                subtitle="Key dates and length of your lease."
              >
                <LeaseFactsRow facts={vm.leaseFacts} />
              </OfferSection>
            </View>
          </Reveal>

          <Reveal delay={240}>
            <View style={styles.pageSection}>
              <OfferSection
                title="Payment Details"
                subtitle="What you’ll pay for this lease."
              >
                <PaymentRows lines={vm.payments} />
              </OfferSection>
            </View>
          </Reveal>

          {accepted ? null : (
            <Reveal delay={290}>
              <View style={styles.actions}>
                <Button
                  title="Reject"
                  variant="light"
                  onPress={vm.reject}
                  style={[styles.action, styles.reject]}
                />
                <Button title="Accept" variant="brand" onPress={vm.accept} style={styles.action} />
              </View>
            </Reveal>
          )}
        </View>
      </ScrollView>

      <AppDialog {...vm.dialog} />
    </View>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';

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
  photo: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  section: {
    marginTop: spacing.lg,
  },
  // Same gap as "Application Journey" on Application Details
  pageSection: {
    marginTop: spacing.xxl,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  action: {
    flex: 1,
  },
  // Outlined secondary choice, as in the design
  reject: {
    borderWidth: 1,
    borderColor: colors.navy,
  },
});

export default OfferAcceptanceScreen;
