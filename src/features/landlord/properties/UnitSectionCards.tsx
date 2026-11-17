/**
 * Unit Details: everything below the stats row, laid out as the mobile
 * "Unit Details" design (image 97). Section titles are the app's
 * PropertySectionTitle (soft blue icon circle + sectionHeading) on the page;
 * content sits under them:
 *  - QuickActionTiles: the app's IconTile row (Message, Renew Lease, ...)
 *  - KpiTile + CollectedPill: "This Month" Financial | Maintenance tiles
 *    (title, big value, caption, footer)
 *  - OverviewCard: building photo left, fact rows right (label / value)
 *  - FeatureChips: AC / Balcony / Furnished, one row of equal chips
 *  - ServiceCards: three tinted cards (icon over label)
 *  - FloorPlanCard: plan + soft "View Floor Plan" (opens FloorPlanViewer)
 *  - WhiteBox, PeopleToggle (Current / Past), PeopleList, EmptyRow
 */

import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { IconTile } from '@/components/IconTile';
import { ShareIcon } from '@/components/icons';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { PROPERTY_IMAGE_ASPECT, propertyAssets } from '@/features/guest/assets/guestAssets';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { landlordAssets } from '../assets/landlordAssets';
import { TintIcon } from './PropertyDetailsParts';
import { DETAIL_ICONS } from './usePropertyDetails';
import { PeopleTab, UnitChip, UnitFact, UnitPerson, UnitRow } from './useUnitDetails';

/** The read-only summary box (white, radius xl, TILE_BORDER, shadows.sm) */
export const WhiteBox: React.FC<{ children: React.ReactNode; flush?: boolean }> = ({
  children,
  flush,
}) => <View style={[styles.box, flush && styles.boxFlush]}>{children}</View>;

/* ------------------------------------------------------------------ */
/* Quick actions                                                      */
/* ------------------------------------------------------------------ */

export const QuickActionTiles: React.FC<{
  actions: readonly UnitRow[];
  onPress: (a: UnitRow) => void;
}> = ({ actions, onPress }) => (
  <View style={styles.tiles}>
    {actions.map(a => (
      <IconTile
        key={a.id}
        label={a.short ?? a.title}
        onPress={() => onPress(a)}
        icon={<TintIcon source={a.icon} size={ms(22)} color={colors.primary} />}
      />
    ))}
  </View>
);

/* ------------------------------------------------------------------ */
/* This month                                                         */
/* ------------------------------------------------------------------ */

export const KpiTile: React.FC<{
  icon: ImageSourcePropType;
  title: string;
  value: string;
  caption: string;
  onPress: () => void;
  footer: React.ReactNode;
}> = ({ icon, title, value, caption, onPress, footer }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${title}, ${value}, ${caption}`}
    style={({ pressed }) => [styles.kpi, pressed && styles.pressedScale]}
  >
    <View style={styles.kpiHead}>
      <TintIcon source={icon} size={ms(16)} color={colors.primary} />
      <Text style={styles.kpiTitle} numberOfLines={1}>
        {title}
      </Text>
      <TintIcon source={DETAIL_ICONS.chevron} size={ms(13)} color={colors.navy} />
    </View>
    <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
      {value}
    </Text>
    <Text style={styles.kpiCaption} numberOfLines={1}>
      {caption}
    </Text>
    <View style={styles.kpiFooter}>{footer}</View>
  </Pressable>
);

/** Green "Collected" pill with the app's tick */
export const CollectedPill: React.FC<{ collected: boolean }> = ({ collected }) => (
  <View style={[styles.collected, !collected && styles.pending]}>
    <View style={[styles.tick, !collected && styles.tickPending]}>
      <RenterIcon name="check" size={ms(9)} color={colors.white} />
    </View>
    <Text style={[styles.collectedText, !collected && styles.pendingText]}>
      {collected ? 'Collected' : 'Pending'}
    </Text>
  </View>
);

/* ------------------------------------------------------------------ */
/* Unit & lease overview                                              */
/* ------------------------------------------------------------------ */

const FactValue: React.FC<{ fact: UnitFact }> = ({ fact }) => {
  if (fact.kind === 'pill') {
    return (
      <View style={styles.activePill}>
        <Text style={styles.activePillText}>{fact.value}</Text>
      </View>
    );
  }
  if (fact.kind === 'dot') {
    return (
      <View style={styles.dotValue}>
        <View style={styles.blueDot} />
        <Text style={styles.factValue} numberOfLines={1}>
          {fact.value}
        </Text>
      </View>
    );
  }
  return (
    <Text style={styles.factValue} numberOfLines={1}>
      {fact.value}
    </Text>
  );
};

/** Building photo on the left, fact rows on the right */
export const OverviewCard: React.FC<{ facts: readonly UnitFact[] }> = ({ facts }) => (
  <View style={styles.overview}>
    <Image
      source={landlordAssets.detailsBuilding}
      style={styles.overviewPhoto}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
    />
    <View style={styles.facts}>
      {facts.map((f, i) => (
        <View
          key={f.id}
          style={[styles.factRow, i > 0 && styles.rule]}
          accessibilityLabel={`${f.label}, ${f.value}`}
        >
          <Text style={styles.factLabel} numberOfLines={1}>
            {f.label}
          </Text>
          <FactValue fact={f} />
        </View>
      ))}
    </View>
  </View>
);

/* ------------------------------------------------------------------ */
/* Features + services                                                */
/* ------------------------------------------------------------------ */

/** One row of equal chips: tinted icon + label */
export const FeatureChips: React.FC<{ features: readonly UnitChip[] }> = ({ features }) => (
  <View style={styles.row3}>
    {features.map(f => (
      <View key={f.id} style={styles.feature}>
        <TintIcon source={f.icon} size={ms(16)} color={f.tint} />
        <Text style={styles.featureText} numberOfLines={1}>
          {f.label}
        </Text>
      </View>
    ))}
  </View>
);

/** Three tinted service cards: icon over label */
export const ServiceCards: React.FC<{
  services: readonly UnitChip[];
  onPress: (s: UnitChip) => void;
}> = ({ services, onPress }) => (
  <View style={styles.row3}>
    {services.map(s => (
      <Pressable
        key={s.id}
        onPress={() => onPress(s)}
        accessibilityRole="button"
        accessibilityLabel={s.label}
        style={({ pressed }) => [styles.service, { backgroundColor: s.tile }, pressed && styles.pressedScale]}
      >
        <TintIcon source={s.icon} size={ms(20)} color={s.tint} />
        <Text style={styles.serviceText} numberOfLines={1}>
          {s.label}
        </Text>
      </Pressable>
    ))}
  </View>
);

/* ------------------------------------------------------------------ */
/* Floor plan                                                         */
/* ------------------------------------------------------------------ */

export const FloorPlanCard: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
  <WhiteBox>
    <Pressable onPress={onOpen} accessibilityRole="imagebutton" accessibilityLabel="Open floor plan">
      <Image source={propertyAssets.floorPlan} style={styles.plan} resizeMode="contain" />
    </Pressable>
    <Button
      title="View Floor Plan"
      variant="soft"
      size="md"
      onPress={onOpen}
      rightIcon={<ShareIcon size={ms(14)} color={colors.navy} />}
      style={styles.planButton}
    />
  </WhiteBox>
);

/* ------------------------------------------------------------------ */
/* Tenant / owner                                                     */
/* ------------------------------------------------------------------ */

const PEOPLE_TABS: readonly { id: PeopleTab; label: string }[] = [
  { id: 'current', label: 'Current' },
  { id: 'past', label: 'Past' },
];

/** Current / Past: white track, navy active segment */
export const PeopleToggle: React.FC<{ value: PeopleTab; onChange: (v: PeopleTab) => void }> = ({
  value,
  onChange,
}) => (
  <View style={styles.toggle} accessibilityRole="tablist">
    {PEOPLE_TABS.map(t => {
      const active = t.id === value;
      return (
        <Pressable
          key={t.id}
          onPress={() => onChange(t.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
          style={[styles.toggleItem, active && styles.toggleItemActive]}
        >
          <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{t.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

/** Tenants / owners in a white box: initials, name, detail line, chevron */
export const PeopleList: React.FC<{
  people: readonly UnitPerson[];
  onPress: (p: UnitPerson) => void;
}> = ({ people, onPress }) => (
  <View style={[styles.box, styles.peopleBox]}>
    {people.map((p, i) => (
      <Pressable
        key={p.id}
        onPress={() => onPress(p)}
        accessibilityRole="button"
        accessibilityLabel={`${p.name}, ${p.detail}`}
        style={({ pressed }) => [styles.owner, i > 0 && styles.rule, pressed && styles.pressedOpacity]}
      >
        <View style={styles.initials}>
          <Text style={styles.initialsText}>{p.initials}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.ownerName} numberOfLines={1}>
            {p.name}
          </Text>
          <Text style={styles.ownerRole} numberOfLines={1}>
            {p.detail}
          </Text>
        </View>
        <TintIcon source={DETAIL_ICONS.chevron} size={ms(14)} color={colors.navy} />
      </Pressable>
    ))}
  </View>
);

/** Quiet empty state in a white box (icon + text) */
export const EmptyRow: React.FC<{ icon: ImageSourcePropType; text: string }> = ({ icon, text }) => (
  <View style={[styles.box, styles.empty]}>
    <TintIcon source={icon} size={ms(18)} color={colors.textSecondary} />
    <Text style={styles.emptyText}>{text}</Text>
  </View>
);

/* ------------------------------------------------------------------ */

const INITIALS = ms(46);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  pressedScale: {
    transform: [{ scale: 0.97 }],
  },
  box: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  boxFlush: {
    paddingVertical: spacing.xs,
  },
  rule: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  // Quick actions
  tiles: {
    flexDirection: 'row',
  },
  // KPI tiles
  kpi: {
    flex: 1,
    padding: spacing.lg,
    overflow: 'hidden',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  kpiHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  kpiTitle: {
    ...typographyPresets.cardSubtitleBold,
    flex: 1,
    color: colors.navy,
  },
  kpiValue: {
    ...typographyPresets.priceLarge,
    marginTop: spacing.sm,
    color: colors.navy,
  },
  kpiCaption: {
    ...typographyPresets.label,
  },
  kpiFooter: {
    marginTop: spacing.sm + 2,
    alignItems: 'flex-start',
  },
  collected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.successLight,
  },
  pending: {
    backgroundColor: colors.warningLight,
  },
  tick: {
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successDark,
  },
  tickPending: {
    backgroundColor: colors.warningDark,
  },
  collectedText: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.successDark,
  },
  pendingText: {
    color: colors.warningDark,
  },
  // Overview: photo left, rows right
  overview: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  overviewPhoto: {
    width: '34%',
    height: undefined,
    alignSelf: 'stretch',
    borderRadius: borderRadius.lg,
  },
  facts: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: ms(32),
  },
  factLabel: {
    ...typographyPresets.label,
    flexShrink: 1,
  },
  factValue: {
    ...typographyPresets.cardSubtitleBold,
    flexShrink: 1,
    textAlign: 'right',
    color: colors.navy,
  },
  activePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.successLight,
  },
  activePillText: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.successDark,
  },
  dotValue: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  blueDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: colors.primary,
  },
  // Features / services: one row of three
  row3: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  feature: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(220, 232, 251, 0.6)',
  },
  featureText: {
    ...typographyPresets.cardSubtitleBold,
    flexShrink: 1,
    color: colors.navy,
  },
  service: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  serviceText: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.navy,
  },
  // Floor plan
  plan: {
    width: '100%',
    height: undefined,
    aspectRatio: PROPERTY_IMAGE_ASPECT.floorPlan,
  },
  planButton: {
    marginTop: spacing.md,
  },
  // Toggle
  toggle: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  toggleItem: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.pill,
  },
  toggleItemActive: {
    backgroundColor: colors.navy,
  },
  toggleText: {
    ...typographyPresets.buttonSmall,
    color: colors.navy,
  },
  toggleTextActive: {
    color: colors.white,
  },
  // Owner
  peopleBox: {
    paddingVertical: spacing.xs,
  },
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pressedOpacity: {
    opacity: 0.7,
  },
  initials: {
    width: INITIALS,
    height: INITIALS,
    borderRadius: INITIALS / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  initialsText: {
    ...typographyPresets.bodyBold,
    color: colors.primary,
  },
  ownerName: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  ownerRole: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  // Empty
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typographyPresets.body,
    color: colors.textSecondary,
  },
});
