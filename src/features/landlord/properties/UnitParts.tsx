/**
 * Add New Property → Unit ("Unit / Home Information") pieces, laid out from
 * the design in the app's own tokens. Form sections sit on the page;
 * read-only blocks (Unit Summary, Unit Types Guide) use the app's white
 * summary box under a page heading; Property Context is the design's card.
 *  - UnitIcon: unit line icon (tinted PNG)
 *  - SectionChevron: collapse / expand button beside a section heading
 *  - UnitsBar: layers tile, "Units Added So Far" unit picker, "+ Add Unit"
 *  - PropertyContextCard: the design's blue card (icon disc + title, Property /
 *    Type / Units so far in white), building blended in on the right
 *  - DraftPill: clock + "Draft" (or "Saved")
 *  - UnitSummaryCard: Unit No. / Type / Floor / Area / Rent columns
 *  - StudentHousingRow: bed tile, title + line, switch
 *  - FloorPlanField: dashed upload area + 3 dashed drawing slots
 *  - UnitTypesGuide: 2-column guide (icon tile, name, line)
 */

import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Button } from '@/components/Button';
import { ChevronDownIcon, CloseIcon, PlusIcon } from '@/components/icons';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { ApplicationIcon } from '@/features/application/components/ApplicationIcon';
import type { ApplicationIconName } from '@/features/application/types';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { moderateScale as ms } from '@/utils/responsive';
import { type UnitIconName, landlordAssets, unitIcons } from '../assets/landlordAssets';
import { MAX_FLOOR_PLANS, UNIT_TYPE_GUIDE } from './constants';
import { UploadDisc, UploadZone } from './PropertyParts';
import type { PickedMedia } from './useAddProperty';

const EMPTY = '—';

export const UnitIcon: React.FC<{ name: UnitIconName; size: number; color: string }> = ({
  name,
  size,
  color,
}) => (
  <Image
    source={unitIcons[name]}
    style={{ width: size, height: size, tintColor: color }}
    resizeMode="contain"
  />
);

/** Section icon from either set (application / unit line icons) */
const AnyIcon: React.FC<{
  name: ApplicationIconName | UnitIconName;
  size: number;
  color: string;
}> = ({ name, size, color }) =>
  name in unitIcons ? (
    <UnitIcon name={name as UnitIconName} size={size} color={color} />
  ) : (
    <ApplicationIcon name={name as ApplicationIconName} size={size} color={color} />
  );

export const SectionChevron: React.FC<{
  open: boolean;
  onPress: () => void;
  label: string;
}> = ({ open, onPress, label }) => (
  <Pressable
    onPress={onPress}
    hitSlop={10}
    accessibilityRole="button"
    accessibilityState={{ expanded: open }}
    accessibilityLabel={`${open ? 'Collapse' : 'Expand'} ${label}`}
    style={({ pressed }) => [styles.chevron, pressed && styles.pressed]}
  >
    <View style={open ? styles.chevronOpen : undefined}>
      <ChevronDownIcon size={ms(16)} color={colors.navy} />
    </View>
  </Pressable>
);

export const UnitsBar: React.FC<{
  unitLabel: string;
  onPickUnit: () => void;
  onAddUnit: () => void;
}> = ({ unitLabel, onPickUnit, onAddUnit }) => (
  <View style={styles.unitsBar}>
    <View style={styles.iconTile}>
      <ApplicationIcon name="layers" size={ms(20)} color={colors.primary} />
    </View>
    <View style={styles.unitsPick}>
      <Text style={styles.fieldLabel}>Units Added So Far</Text>
      <FormSelect
        value={unitLabel}
        placeholder="Unit 1"
        onPress={onPickUnit}
        accessibilityLabel="Units added so far"
      />
    </View>
    <Button
      title="Add Unit"
      variant="brand"
      size="md"
      onPress={onAddUnit}
      style={styles.addUnit}
      leftIcon={<PlusIcon size={ms(14)} color={colors.white} />}
    />
  </View>
);

export const PropertyContextCard: React.FC<{
  property?: string;
  type?: string;
  unitsSoFar: number;
}> = ({ property, type, unitsSoFar }) => {
  // Until the property tab has them, show the design's sample data
  const cols = [
    { label: 'Property', value: property || CONTEXT_SAMPLE.property },
    { label: 'Type', value: type || CONTEXT_SAMPLE.type },
    { label: 'Units so far', value: unitsSoFar > 0 ? String(unitsSoFar) : EMPTY },
  ];
  return (
    <View style={styles.context}>
      {/* Lighter towards the bottom (design), over the left→right blue */}
      <View pointerEvents="none" style={styles.contextLift} />
      {/* The design's building behind the "Units so far" column: misty on
          its left, with a frosted blue veil so the text over it reads */}
      <View pointerEvents="none" style={styles.contextBuildingWrap}>
        <Image
          source={landlordAssets.contextBuilding}
          style={styles.contextBuilding}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.contextFrost} />
      </View>

      <View style={styles.contextHead}>
        <View style={styles.contextDisc}>
          <ApplicationIcon name="building" size={ms(20)} color={colors.white} />
        </View>
        <Text style={styles.contextTitle} accessibilityRole="header" numberOfLines={1}>
          Property Context
        </Text>
      </View>
      <View style={styles.contextCols}>
        {cols.map((c, i) => (
          <View key={c.label} style={[styles.contextCol, i > 0 && styles.contextColDivider]}>
            <Text style={styles.contextLabel} numberOfLines={1}>
              {c.label}
            </Text>
            <Text style={styles.contextValue} numberOfLines={1}>
              {c.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const DraftPill: React.FC<{ saved: boolean }> = ({ saved }) => (
  <View style={styles.draft}>
    <ApplicationIcon name={saved ? 'circleCheck' : 'clock'} size={ms(13)} color={colors.navy} />
    <Text style={styles.draftText}>{saved ? 'Saved' : 'Draft'}</Text>
  </View>
);

export const UnitSummaryCard: React.FC<{
  unitNo: string;
  type?: string;
  floor: string;
  area: string;
  rent: string;
  currency: string;
}> = ({ unitNo, type, floor, area, rent, currency }) => {
  const cols: { label: string; value: string; icon: ApplicationIconName | UnitIconName }[] = [
    { label: 'Unit No.', value: unitNo || EMPTY, icon: 'building' },
    { label: 'Type', value: type || 'Select type', icon: 'layers' },
    { label: 'Floor', value: floor || EMPTY, icon: 'door' },
    { label: 'Area', value: area ? `${area} sq ft` : EMPTY, icon: 'scan' },
    { label: 'Rent', value: rent ? `${currency}${rent}` : EMPTY, icon: 'receipt' },
  ];
  return (
    <View style={[styles.box, styles.columns]}>
      {cols.map((c, i) => (
        <View key={c.label} style={[styles.summaryCol, i > 0 && styles.columnDivider]}>
          <AnyIcon name={c.icon} size={ms(16)} color={colors.navy} />
          <Text style={styles.summaryLabel} numberOfLines={1}>
            {c.label}
          </Text>
          <Text style={styles.summaryValue} numberOfLines={2}>
            {c.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export const StudentHousingRow: React.FC<{
  value: boolean;
  onChange: () => void;
}> = ({ value, onChange }) => (
  <View style={styles.student}>
    <View style={styles.iconTile}>
      <ApplicationIcon name="bed" size={ms(20)} color={colors.navy} />
    </View>
    <View style={styles.flex}>
      <Text style={styles.rowTitle}>Student housing — room details</Text>
      <Text style={styles.rowBody}>Configure per-room bed & bathroom breakdown</Text>
    </View>
    <ToggleSwitch
      value={value}
      onChange={onChange}
      accessibilityLabel="Student housing room details"
    />
  </View>
);

export const FloorPlanField: React.FC<{
  drawings: readonly PickedMedia[];
  onUpload: () => void;
  onRemove: (uri: string) => void;
}> = ({ drawings, onUpload, onRemove }) => (
  <View style={styles.floorPlan}>
    <UploadZone
      icon={
        <UploadDisc>
          <ApplicationIcon name="fileText" size={ms(22)} color={colors.primary} />
        </UploadDisc>
      }
      title="Upload Technical Drawings"
      supports="Supports: JPG, PNG (Max 15MB each)"
      onPress={onUpload}
    />
    <View style={styles.slots}>
      {Array.from({ length: MAX_FLOOR_PLANS }, (_, i) => {
        const d = drawings[i];
        return d ? (
          <View key={d.uri} style={[styles.slot, styles.slotFilled]}>
            <Image source={{ uri: d.uri }} style={styles.slotPhoto} resizeMode="cover" />
            <Pressable
              onPress={() => onRemove(d.uri)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remove drawing ${i + 1}`}
              style={({ pressed }) => [styles.slotRemove, pressed && styles.pressed]}
            >
              <CloseIcon size={ms(9)} color={colors.textPrimary} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            key={`slot-${i}`}
            onPress={onUpload}
            accessibilityRole="button"
            accessibilityLabel={`Add drawing ${i + 1}`}
            style={({ pressed }) => [styles.slot, pressed && styles.pressed]}
          >
            <UnitIcon name="image" size={ms(20)} color={colors.textSecondary} />
          </Pressable>
        );
      })}
    </View>
  </View>
);

export const UnitTypesGuide: React.FC = () => (
  <View style={[styles.box, styles.guide]}>
    {UNIT_TYPE_GUIDE.map(g => (
      <View key={g.title} style={styles.guideItem}>
        <View style={styles.iconTile}>
          <AnyIcon name={g.icon} size={ms(18)} color={colors.navy} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {g.title}
          </Text>
          <Text style={styles.rowBody} numberOfLines={2}>
            {g.body}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const SLOT_H = ms(64);

/** Property Context gradient, light and smooth: ends on the photo's own
 * edge blue (#3B6294) so card and building read as one surface */
const CONTEXT_STOPS = ['#173764', '#244A7D', '#2F5A90', '#3B6294'] as const;

/** Soft shadow so white text reads over the building */
const TEXT_LIFT = {
  textShadowColor: 'rgba(9,32,68,0.45)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
};

/** The design's sample values, shown until the Property tab fills them */
const CONTEXT_SAMPLE = { property: 'Sky Tower', type: 'Condominium' };

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  // App's white summary box (Offer Acceptance rule)
  box: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    ...shadows.sm,
  } as ViewStyle,
  // Secondary-blue wash tile, as the section heading icons
  iconTile: {
    width: ms(40),
    height: ms(40),
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.headerGradientEnd}1A`,
  },
  chevron: {
    width: ms(32),
    height: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  fieldLabel: {
    ...typographyPresets.fieldLabel,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  // Units bar
  unitsBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  unitsPick: {
    flex: 1,
  },
  addUnit: {
    paddingHorizontal: spacing.lg,
  },
  // Property context (colours sampled from the design screenshot): plain
  // gradient card, navy top-left → mid blue right, lighter towards the
  // bottom, building in the right third. No glass layers.
  context: {
    overflow: 'hidden',
    paddingTop: spacing.md + 2,
    paddingBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundImage: `linear-gradient(90deg, ${CONTEXT_STOPS[0]} 0%, ${CONTEXT_STOPS[1]} 30%, ${CONTEXT_STOPS[2]} 60%, ${CONTEXT_STOPS[3]} 100%)`,
    boxShadow: '0px 8px 20px rgba(9,32,68,0.28)',
  },
  // Bottom lift, smooth: brings the bottom up to the photo's lighter base
  // (#5E83AF) so both blend top to bottom
  contextLift: {
    ...StyleSheet.absoluteFill,
    backgroundImage:
      'linear-gradient(180deg, rgba(140,175,220,0) 0%, rgba(140,175,220,0.1) 50%, rgba(140,175,220,0.28) 100%)',
  },
  // Design building at its own shape (no crop), full height, anchored right;
  // its left 55% fades to transparent so it melts into the card
  contextBuildingWrap: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    aspectRatio: 440 / 240,
  },
  contextBuilding: {
    width: '100%',
    height: '100%',
  },
  // Frosted veil under the "Units so far" text: clear at both edges, so it
  // never draws a line
  contextFrost: {
    ...StyleSheet.absoluteFill,
    backgroundImage:
      'linear-gradient(90deg, rgba(59,98,148,0) 0%, rgba(59,98,148,0.3) 35%, rgba(59,98,148,0.15) 60%, rgba(59,98,148,0) 85%)',
  },
  contextHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  // Disc: soft gradient, lighter centre (#6787AF) to #3A6298 at the edge
  contextDisc: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'radial-gradient(circle at 50% 45%, #6787AF 0%, #3A6298 100%)',
  },
  contextTitle: {
    ...typographyPresets.formHeading,
    flex: 1,
    color: colors.white,
  },
  // Three equal columns (dividers at 1/3 and 2/3 of the card, as drawn)
  contextCols: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  contextCol: {
    flex: 1,
    gap: 2,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  contextColDivider: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.12)',
  },
  // Small presets so "Condominium" fits a third of the card
  contextLabel: {
    ...typographyPresets.label,
    color: 'rgba(255,255,255,0.88)',
    ...TEXT_LIFT,
  },
  contextValue: {
    ...typographyPresets.fieldLabel,
    color: colors.white,
    ...TEXT_LIFT,
  },
  columns: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
  },
  column: {
    flex: 1,
    gap: 2,
    paddingHorizontal: spacing.md,
  },
  columnDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: TILE_BORDER,
  },
  colLabel: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
  },
  colValue: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  // Draft pill
  draft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  draftText: {
    ...typographyPresets.cardSubtitle,
    fontFamily: typographyPresets.bodyBold.fontFamily,
    color: colors.navy,
  },
  // Unit summary
  summaryCol: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  summaryLabel: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typographyPresets.cardSubtitle,
    fontFamily: typographyPresets.bodyBold.fontFamily,
    textAlign: 'center',
    color: colors.navy,
  },
  // Student housing
  student: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: TILE_BG,
  },
  rowTitle: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  rowBody: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
  },
  // Floor plan
  floorPlan: {
    gap: spacing.md,
  },
  slots: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  slot: {
    flex: 1,
    height: SLOT_H,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TILE_BORDER,
    backgroundColor: TILE_BG,
  },
  slotFilled: {
    borderWidth: 0,
  },
  slotPhoto: {
    width: '100%',
    height: '100%',
  },
  slotRemove: {
    position: 'absolute',
    top: spacing.xs + 1,
    right: spacing.xs + 1,
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    boxShadow: '0px 1px 4px rgba(11,29,58,0.25)',
  },
  // Unit types guide: two columns
  guide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.lg,
    padding: spacing.lg,
  },
  guideItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});
