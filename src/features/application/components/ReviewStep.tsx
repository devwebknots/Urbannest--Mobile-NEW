/**
 * ReviewStep: step 4 of the rental application, "Review, Consent & Submit"
 * (from the design; sections laid on the page like steps 1–3, no icons):
 *  - Applicant & Household: two-column summary (label / value rows with
 *    hairlines) + "Edit" (back to step 1)
 *  - Background Screening: vendors, scope, tier pill (gold star) + "Edit"
 *    (back to History)
 *  - Application Fee: fee lines, credit in blue, "Net Due Today" strip
 *    with a "No real charge is made" pill
 *  - Regulatory Consents & Attestation: checkbox rows (required = red
 *    star; ticked = soft secondary-blue box + tick, app done colour)
 *  - Signature: type the full legal name to confirm
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { StarGlyph } from '@/features/guest/components/GuestIcons';
import { DONE_BLUE } from '@/features/renter/components/checkin/CompletedBadge';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { moderateScale as ms } from '@/utils/responsive';
import { APPLICATION_FEES, SCREENING_SUMMARY } from '../constants';
import type { ReviewStepModel } from '../hooks/useReviewStep';
import { FieldInput, LabeledField } from './ApplicationFields';
import { ApplicationIcon } from './ApplicationIcon';
import { ApplicationSection } from './ApplicationSection';

export interface SummaryItem {
  label: string;
  value: React.ReactNode;
}

interface Props {
  vm: ReviewStepModel;
  applicant: readonly SummaryItem[];
  /** For the signature check */
  legalName: { first: string; middle: string; last: string };
  onEditApplicant: () => void;
  onEditScreening: () => void;
}

const EditButton: React.FC<{ onPress: () => void; label: string }> = ({ onPress, label }) => (
  <Button
    title="Edit"
    variant="light"
    size="md"
    onPress={onPress}
    accessibilityLabel={label}
    leftIcon={<ApplicationIcon name="pencil" size={ms(14)} color={colors.navy} />}
    style={styles.edit}
  />
);

/** Label / value rows in two columns with a hairline between them */
const SummaryGrid: React.FC<{ items: readonly SummaryItem[] }> = ({ items }) => {
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];
  return (
    <View style={styles.grid}>
      {columns.map((col, c) => (
        <React.Fragment key={c}>
          {c > 0 ? <View style={styles.gridDivider} /> : null}
          <View style={styles.gridColumn}>
            {col.map((item, i) => (
              <View key={item.label} style={[styles.cell, i > 0 && styles.cellDivider]}>
                <Text style={styles.cellLabel}>{item.label}</Text>
                {typeof item.value === 'string' ? (
                  <Text style={styles.cellValue} numberOfLines={3}>
                    {item.value}
                  </Text>
                ) : (
                  item.value
                )}
              </View>
            ))}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

const money = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(n).toLocaleString('en-US')}`;

export const ReviewStep: React.FC<Props> = ({
  vm,
  applicant,
  legalName,
  onEditApplicant,
  onEditScreening,
}) => {
  const net = APPLICATION_FEES.reduce((sum, f) => sum + f.amount, 0);
  const signatureError = vm.signatureError(legalName.first, legalName.middle, legalName.last);

  return (
    <View style={styles.sections}>
      <ApplicationSection
        title="Applicant & Household"
        subtitle="Your details and household."
        right={<EditButton onPress={onEditApplicant} label="Edit applicant and household" />}
      >
        <SummaryGrid items={applicant} />
      </ApplicationSection>

      <ApplicationSection
        title="Background Screening"
        subtitle="How we verify your application."
        right={<EditButton onPress={onEditScreening} label="Edit rental and financial history" />}
      >
        <SummaryGrid
          items={[
            { label: 'Screening Vendors', value: SCREENING_SUMMARY.vendors },
            {
              label: 'Screening Tier',
              value: (
                <View style={styles.tier}>
                  <StarGlyph size={ms(12)} color={colors.gold} />
                  <Text style={styles.tierText}>{SCREENING_SUMMARY.tier}</Text>
                </View>
              ),
            },
            { label: 'Screening Scope', value: SCREENING_SUMMARY.scope },
          ]}
        />
      </ApplicationSection>

      <ApplicationSection
        title="Application Fee"
        subtitle="Fees related to your rental application."
      >
        <View>
          {APPLICATION_FEES.map((f, i) => (
            <View key={f.label} style={[styles.feeRow, i > 0 && styles.cellDivider]}>
              <Text style={styles.feeLabel}>{f.label}</Text>
              <Text style={[styles.feeAmount, f.amount < 0 && styles.feeCredit]}>
                {money(f.amount)}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.net}>
          <View style={styles.netRow}>
            <Text style={styles.netLabel}>Net Due Today</Text>
            <Text style={styles.netAmount}>{`$${Math.max(net, 0).toFixed(2)}`}</Text>
          </View>
          <View style={styles.noCharge}>
            <ApplicationIcon name="circleCheck" size={ms(13)} color={colors.headerGradientEnd} />
            <Text style={styles.noChargeText}>No real charge is made</Text>
          </View>
        </View>
      </ApplicationSection>

      <ApplicationSection
        title="Regulatory Consents"
        subtitle="Please review and provide your consents to proceed."
      >
        <View>
          {vm.consentItems.map((c, i) => {
            const on = vm.consents.has(c.id);
            const missing = vm.showErrors && c.required && !on;
            return (
              <Pressable
                key={c.id}
                onPress={() => vm.toggleConsent(c.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={c.title}
                style={({ pressed }) => [
                  styles.consent,
                  i > 0 && styles.cellDivider,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.box, on && styles.boxOn, missing && styles.boxMissing]}>
                  {on ? <RenterIcon name="check" size={ms(12)} color={colors.white} /> : null}
                </View>
                <View style={styles.consentText}>
                  <Text style={styles.consentTitle}>
                    {c.title}
                    {c.required ? <Text style={styles.star}> *</Text> : null}
                  </Text>
                  <Text style={styles.consentBody}>{c.text}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ApplicationSection>

      <ApplicationSection title="Signature" subtitle="Type your full legal name to confirm.">
        <LabeledField label="Full Legal Name" required error={signatureError}>
          <FieldInput
            value={vm.signature}
            onChangeText={vm.setSignature}
            invalid={!!signatureError}
            placeholder="Enter your full legal name"
            leftIcon="pencil"
            autoCapitalize="words"
            autoComplete="name"
            maxLength={80}
            accessibilityLabel="Signature, full legal name"
          />
        </LabeledField>
      </ApplicationSection>
    </View>
  );
};

const BOX = ms(22);

const styles = StyleSheet.create({
  // Same rhythm as steps 1–3: sections on the page, 40 apart
  sections: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sectionGap,
  },
  edit: {
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  grid: {
    flexDirection: 'row',
  },
  gridColumn: {
    flex: 1,
  },
  gridDivider: {
    width: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.md,
    backgroundColor: TILE_BORDER,
  },
  cell: {
    paddingVertical: spacing.sm + 2,
  },
  cellDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  cellLabel: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  cellValue: {
    ...typographyPresets.bodyBold,
    marginTop: ms(2),
    color: colors.navy,
  },
  tier: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  tierText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  feeLabel: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.textPrimary,
  },
  feeAmount: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  feeCredit: {
    color: colors.primary,
  },
  net: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.chipBlue,
  },
  netRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  netLabel: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  netAmount: {
    ...typographyPresets.price,
    color: colors.navy,
  },
  noCharge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
  },
  noChargeText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  consent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  box: {
    width: BOX,
    height: BOX,
    marginTop: ms(1),
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: TILE_BORDER,
  },
  // DONE_BLUE is see-through: lay it over white
  boxOn: {
    borderColor: 'transparent',
    backgroundImage: `linear-gradient(${DONE_BLUE}, ${DONE_BLUE})`,
  },
  boxMissing: {
    borderColor: colors.error,
  },
  consentText: {
    flex: 1,
  },
  consentTitle: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  star: {
    color: colors.error,
  },
  consentBody: {
    ...typographyPresets.caption,
    marginTop: ms(2),
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ReviewStep;
