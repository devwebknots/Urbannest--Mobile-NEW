/**
 * LeasePaymentScreen: "Payment Summary", opened from the Payment journey
 * step (Application Details) once the lease agreement is ready. Layout
 * from the "Payment Summary" design, app standards:
 *  - light top bar: back + "Payment Summary"
 *  - PaymentHero: "Lease Payment" eyebrow, "Complete Your Lease Payment",
 *    line, document illustration
 *  - PaymentPropertyCard: photo, name, unit, chevron (accepted offer)
 *  - "Lease Payment Details" (heading outside, white box): deposit and
 *    one time payment rows with icon tiles
 *  - "Total Summary" (heading outside, white box): total, tax, then the
 *    final amount in the chipBlue strip
 *  - "Proceed to Pay" (brand, card icon + arrow)
 * Already paid (step done): "Payment Complete" and no button.
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { Reveal } from '@/features/renter/components/Reveal';
import { moderateScale as ms } from '@/utils/responsive';
import { ApplicationIcon } from '../components/ApplicationIcon';
import {
  PaymentHero,
  PaymentItemRows,
  PaymentPropertyCard,
} from '../components/LeasePaymentParts';
import { OfferSection, PaymentRows } from '../components/OfferAcceptanceParts';
import { LeasePaymentNavigation, useLeasePayment } from '../hooks/useLeasePayment';
import { journeyStore, useJourneyStore } from '../store/journeyStore';
import type { ApplicationRecord } from '../types';

interface Props {
  navigation?: LeasePaymentNavigation;
  route: { params: { record: ApplicationRecord; paid?: boolean } };
}

export const LeasePaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { record } = route.params;
  // Re-render once paid (hides the button behind the success dialog)
  useJourneyStore();
  const paid = route.params.paid === true || journeyStore.isDone(record.id, 'payment');
  const vm = useLeasePayment(record, navigation);
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

        <LightTopBar title="Payment Summary" titleAlign="left" onBack={vm.back} />

        <View style={styles.padded}>
          <Reveal delay={40}>
            <View style={styles.hero}>
              <PaymentHero
                eyebrow="Lease Payment"
                title={paid ? 'Payment Complete' : 'Complete Your Lease Payment'}
                message={
                  paid
                    ? 'Your lease payment was received. Sign your lease to finish.'
                    : 'Make the payment to confirm your lease and proceed with move-in.'
                }
              />
            </View>
          </Reveal>

          <Reveal delay={100}>
            <PaymentPropertyCard
              name={record.propertyName}
              unit={record.address}
              image={record.image}
              onPress={vm.openOffer}
            />
          </Reveal>

          <Reveal delay={160}>
            <View style={styles.section}>
              <OfferSection
                title="Lease Payment Details"
                subtitle="What’s due before you sign your lease."
              >
                <PaymentItemRows items={vm.items} />
              </OfferSection>
            </View>
          </Reveal>

          <Reveal delay={220}>
            <View style={styles.section}>
              <OfferSection title="Total Summary" subtitle="Your total including tax.">
                <PaymentRows lines={vm.totals} />
              </OfferSection>
            </View>
          </Reveal>

          {paid ? null : (
            <Reveal delay={280}>
              <View style={styles.action}>
                <Button
                  title="Proceed to Pay"
                  variant="brand"
                  onPress={vm.pay}
                  leftIcon={<ApplicationIcon name="creditCard" size={ms(18)} color={colors.white} />}
                  rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
                />
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
  hero: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  // Same gap as the Offer Acceptance sections
  section: {
    marginTop: spacing.xxl,
  },
  action: {
    marginTop: spacing.xxl,
  },
});

export default LeasePaymentScreen;
