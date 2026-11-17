/**
 * Landlord Property Details pieces (layout from the "Property Details"
 * design, app theme colours / presets / buttons):
 *  - DetailSectionHead: icon tile + heading laid on the page, optional right
 *    slot (read-only summary rule: heading outside, content in a white box)
 *  - DetailBox: the white summary box (radius xl, TILE_BORDER, shadows.sm)
 *  - PropertyGallery: large photo ("N photos" / "+ Add Photos" pills) + 3 thumbs
 *  - OverviewBody / HealthBody: overview facts, health score + bars
 *  - UnitInventoryCard: unit photo left, name / status / lease / maintenance,
 *    View Unit + Message
 *  - MaintenanceQueueBody, ActionRows (Quick Actions + Document Vault rows)
 *  - RentCollectionBody: bar chart (plain Views) + Funding / Expenses / Bills
 *  - ResidentsEmpty, CommsBody (Chats / Notifications underline tabs)
 */

import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { MapPinIcon, PlusIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import {
  CommsMessage,
  CommsTab,
  DETAIL_ICONS,
  DetailAmenity,
  HealthMetric,
  InventoryUnit,
  RentMonth,
} from './usePropertyDetails';

/** One of the app's white line-icon PNGs, tinted */
export const TintIcon: React.FC<{ source: ImageSourcePropType; size: number; color: string }> = ({
  source,
  size,
  color,
}) => (
  <Image source={source} style={{ width: size, height: size, tintColor: color }} resizeMode="contain" />
);

const money = (n: number) => `$${n.toLocaleString('en-US')}`;

/* ------------------------------------------------------------------ */
/* Header + section frame                                             */
/* ------------------------------------------------------------------ */

export const PropertyTitleBlock: React.FC<{
  name: string;
  type: string;
  address: string;
  onEdit: () => void;
}> = ({ name, type, address, onEdit }) => (
  <View>
    <View style={styles.titleRow}>
      <Text style={styles.propName} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.typePill}>
        <Text style={styles.typePillText} numberOfLines={1}>
          {type}
        </Text>
      </View>
      <View style={styles.flex} />
      <Button
        title="Edit"
        variant="light"
        size="sm"
        onPress={onEdit}
        leftIcon={<TintIcon source={DETAIL_ICONS.pencil} size={ms(14)} color={colors.navy} />}
        style={styles.editButton}
      />
    </View>
    <View style={styles.addressRow}>
      <MapPinIcon size={ms(14)} color={colors.textSecondary} />
      <Text style={styles.addressText} numberOfLines={2}>
        {address}
      </Text>
    </View>
  </View>
);

export const DetailSectionHead: React.FC<{
  icon?: ImageSourcePropType;
  title: string;
  right?: React.ReactNode;
}> = ({ icon, title, right }) => (
  <View style={styles.sectionHead}>
    {icon ? (
      <View style={styles.sectionIcon}>
        <TintIcon source={icon} size={ms(16)} color={colors.primary} />
      </View>
    ) : null}
    <Text style={styles.sectionTitle} numberOfLines={1} accessibilityRole="header">
      {title}
    </Text>
    {right ? <View style={styles.sectionRight}>{right}</View> : null}
  </View>
);

export const DetailBox: React.FC<{ children: React.ReactNode; flush?: boolean }> = ({
  children,
  flush,
}) => <View style={[styles.box, flush && styles.boxFlush]}>{children}</View>;

/* ------------------------------------------------------------------ */
/* Gallery                                                            */
/* ------------------------------------------------------------------ */

export const PropertyGallery: React.FC<{
  photos: readonly ImageSourcePropType[];
  count: number;
  onOpen: () => void;
  onAdd: () => void;
}> = ({ photos, count, onOpen, onAdd }) => (
  <View style={styles.gallery}>
    <Pressable onPress={onOpen} accessibilityRole="imagebutton" accessibilityLabel="Open photos">
      <View style={styles.hero}>
        <Image source={photos[0]} style={styles.fill} resizeMode="cover" />
        <View style={styles.heroBar}>
          {/* App's white button (Button "light"), lifted off the photo */}
          <Button
            title={`${count} photos`}
            variant="light"
            size="sm"
            onPress={onOpen}
            leftIcon={<TintIcon source={DETAIL_ICONS.photos} size={ms(13)} color={colors.navy} />}
            style={styles.photoButton}
          />
          <Button
            title="Add Photos"
            variant="light"
            size="sm"
            onPress={onAdd}
            leftIcon={<PlusIcon size={ms(13)} color={colors.navy} />}
            style={styles.photoButton}
          />
        </View>
      </View>
    </Pressable>
    <View style={styles.thumbs}>
      {photos.slice(1, 4).map((p, i) => (
        <Pressable
          key={`thumb-${i}`}
          onPress={onOpen}
          style={({ pressed }) => [styles.thumb, pressed && styles.pressed]}
          accessibilityRole="imagebutton"
          accessibilityLabel={`Photo ${i + 2}`}
        >
          <Image source={p} style={styles.fill} resizeMode="cover" />
        </Pressable>
      ))}
    </View>
  </View>
);

/* ------------------------------------------------------------------ */
/* Overview + Health                                                  */
/* ------------------------------------------------------------------ */

const FactRow: React.FC<{ label: string; children: React.ReactNode; last?: boolean }> = ({
  label,
  children,
  last,
}) => (
  <View style={[styles.fact, !last && styles.factRule]}>
    <Text style={styles.factLabel}>{label}</Text>
    <View style={styles.factValue}>{children}</View>
  </View>
);

export const OverviewBody: React.FC<{
  description: string;
  amenities: readonly DetailAmenity[];
  owner: { initials: string; name: string; share: number };
  coOwners: readonly string[];
  manager: string | null;
}> = ({ description, amenities, owner, coOwners, manager }) => (
  <View>
    <Text style={styles.description}>{description}</Text>
    <Text style={styles.eyebrow}>AMENITIES</Text>
    <View style={styles.amenities}>
      {amenities.map(a => (
        <View key={a.id} style={styles.amenity}>
          <TintIcon source={a.icon} size={ms(15)} color={colors.successDark} />
          <Text style={styles.amenityText}>{a.label}</Text>
        </View>
      ))}
    </View>
    <View style={styles.factsTop}>
      <FactRow label="Primary Owner">
        <View style={styles.initials}>
          <Text style={styles.initialsText}>{owner.initials}</Text>
        </View>
        <Text style={styles.factStrong} numberOfLines={1}>
          {owner.name}
        </Text>
        <View style={styles.sharePill}>
          <Text style={styles.sharePillText}>{owner.share}%</Text>
        </View>
      </FactRow>
      <FactRow label="Co-owners">
        <TintIcon source={DETAIL_ICONS.coOwners} size={ms(16)} color={colors.textSecondary} />
        <Text style={styles.factMuted} numberOfLines={1}>
          {coOwners.length ? coOwners.join(', ') : 'None registered'}
        </Text>
      </FactRow>
      <FactRow label="Assigned Manager" last>
        <TintIcon source={DETAIL_ICONS.manager} size={ms(16)} color={colors.textSecondary} />
        <Text style={styles.factMuted} numberOfLines={1}>
          {manager ?? 'None assigned'}
        </Text>
      </FactRow>
    </View>
  </View>
);

export const HealthBody: React.FC<{
  score: number;
  label: string;
  metrics: readonly HealthMetric[];
}> = ({ score, label, metrics }) => (
  <View>
    <View style={styles.scoreRow}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.scoreMax}>/ 100</Text>
      <View style={styles.flex} />
      <View style={styles.fairPill}>
        <Text style={styles.fairPillText}>{label}</Text>
      </View>
    </View>
    {metrics.map(m => (
      <View key={m.id} style={styles.metric}>
        <View style={styles.metricHead}>
          <Text style={styles.metricLabel}>{m.label}</Text>
          <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
        </View>
        <View style={styles.track}>
          <View
            style={[
              styles.trackFill,
              { width: `${Math.round(m.progress * 100)}%`, backgroundColor: m.color },
            ]}
          />
        </View>
      </View>
    ))}
  </View>
);

/* ------------------------------------------------------------------ */
/* Unit inventory                                                     */
/* ------------------------------------------------------------------ */

export const UnitInventoryCard: React.FC<{
  propertyName: string;
  unit: InventoryUnit;
  onView: () => void;
  onMessage: () => void;
}> = ({ propertyName, unit, onView, onMessage }) => {
  const vacant = unit.status === 'vacant';
  return (
    <Pressable
      onPress={onView}
      style={({ pressed }) => [styles.unit, pressed && styles.pressedCard]}
      accessibilityRole="button"
      accessibilityLabel={`${propertyName} ${unit.name}, ${unit.status}`}
    >
      <View style={styles.unitPhotoWrap}>
        <Image source={unit.photo} style={styles.unitPhoto} resizeMode="cover" />
      </View>
      <View style={styles.unitBody}>
        <View style={styles.unitHead}>
          <Text style={styles.unitName} numberOfLines={1}>
            {propertyName} — {unit.name}
          </Text>
          <TintIcon source={DETAIL_ICONS.chevron} size={ms(14)} color={colors.textSecondary} />
        </View>
        <View style={[styles.statusPill, !vacant && styles.statusPillOccupied]}>
          <Text style={[styles.statusText, !vacant && styles.statusTextOccupied]}>
            {vacant ? 'Vacant' : 'Occupied'}
          </Text>
        </View>
        <View style={styles.unitFact}>
          <Text style={styles.unitFactLabel}>Lease ends</Text>
          <Text style={styles.unitFactValue}>{unit.leaseEnds}</Text>
        </View>
        <View style={styles.unitFact}>
          <Text style={styles.unitFactLabel}>Maintenance</Text>
          <Text style={[styles.unitFactValue, styles.clear]}>{unit.maintenance}</Text>
        </View>
        <View style={styles.unitActions}>
          <Button
            title="View Unit"
            variant="brand"
            size="sm"
            onPress={onView}
            style={styles.unitAction}
          />
          <Button
            title="Message"
            variant="light"
            size="sm"
            onPress={onMessage}
            style={[styles.unitAction, styles.lightBorder]}
          />
        </View>
      </View>
    </Pressable>
  );
};

/* ------------------------------------------------------------------ */
/* Maintenance queue / action rows                                    */
/* ------------------------------------------------------------------ */

export const MaintenanceQueueBody: React.FC<{ openTickets: number; vendorScore: number }> = ({
  openTickets,
  vendorScore,
}) => (
  <View>
    <Text style={styles.queueText}>
      {openTickets === 0 ? 'No open tickets.' : `${openTickets} open tickets`}
    </Text>
    <View style={styles.queueRule} />
    <View style={styles.vendorRow}>
      <Text style={styles.queueText}>Vendor score</Text>
      <Text style={styles.vendorScore}>{vendorScore.toFixed(1)}</Text>
      <Text style={styles.star}>★</Text>
    </View>
  </View>
);

export interface ActionRowItem {
  readonly id: string;
  readonly title: string;
  /** Optional second line (Quick Actions on Unit Details have none) */
  readonly subtitle?: string;
  readonly icon: ImageSourcePropType;
  readonly tint: string;
  readonly tile: string;
}

export function ActionRows<T extends ActionRowItem>({
  items,
  onPress,
  trailingIcon = DETAIL_ICONS.chevron,
}: {
  items: readonly T[];
  onPress: (item: T) => void;
  /** Icon at the row end (default chevron; Document Vault on Unit Details: download) */
  trailingIcon?: ImageSourcePropType;
}) {
  return (
    <View>
      {items.map((it, i) => (
        <Pressable
          key={it.id}
          onPress={() => onPress(it)}
          accessibilityRole="button"
          accessibilityLabel={it.subtitle ? `${it.title}, ${it.subtitle}` : it.title}
          style={({ pressed }) => [styles.actionRow, i > 0 && styles.factRule, pressed && styles.pressed]}
        >
          <View style={[styles.actionTile, { backgroundColor: it.tile }]}>
            <TintIcon source={it.icon} size={ms(17)} color={it.tint} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.actionTitle} numberOfLines={1}>
              {it.title}
            </Text>
            {it.subtitle ? (
              <Text style={styles.actionSub} numberOfLines={1}>
                {it.subtitle}
              </Text>
            ) : null}
          </View>
          <TintIcon source={trailingIcon} size={ms(14)} color={colors.textSecondary} />
        </Pressable>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Rent collection                                                    */
/* ------------------------------------------------------------------ */

const PLOT_H = ms(96);
const AXIS = ['$0.4K', '$0.2K', '$0K'];
/** Top of the axis ($0.4K) */
const AXIS_MAX = 400;

export const RentCollectionBody: React.FC<{
  months: readonly RentMonth[];
  funding: number;
  expenses: number;
  vendorBills: number;
}> = ({ months, funding, expenses, vendorBills }) => {
  // Latest full month (design: SEP) is highlighted
  const peak = months.reduce((best, m, i) => (m.amount > months[best].amount ? i : best), 0);
  const totals = [
    { label: 'Funding', value: money(funding), color: colors.warning },
    { label: 'Expenses', value: money(expenses), color: colors.navy },
    { label: 'Vendor Bills', value: money(vendorBills), color: colors.navy },
  ];
  return (
    <View>
      <View style={styles.chart}>
        <View style={styles.axis}>
          {AXIS.map(a => (
            <Text key={a} style={styles.axisText}>
              {a}
            </Text>
          ))}
        </View>
        <View style={styles.flex}>
          <View style={styles.plot}>
            {[0, 1, 2].map(g => (
              <View key={`g-${g}`} style={[styles.grid, { top: (PLOT_H / 2) * g }]} />
            ))}
            {months.map((m, i) => (
              <View key={m.month} style={styles.barSlot}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(ms(4), (Math.min(m.amount, AXIS_MAX) / AXIS_MAX) * PLOT_H),
                      backgroundColor: i === peak ? colors.navy : colors.chipBlue,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          <View style={styles.months}>
            {months.map(m => (
              <Text key={m.month} style={styles.monthText}>
                {m.month}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.totals}>
        {totals.map((t, i) => (
          <View key={t.label} style={[styles.total, i > 0 && styles.totalRule]}>
            <Text style={styles.totalLabel} numberOfLines={1}>
              {t.label}
            </Text>
            <Text
              style={[styles.totalValue, { color: t.color }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {t.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Residents + communications                                         */
/* ------------------------------------------------------------------ */

export const ResidentsEmpty: React.FC = () => (
  <View style={styles.residents}>
    <TintIcon source={DETAIL_ICONS.residents} size={ms(20)} color={colors.textMuted} />
    <Text style={styles.residentsText}>No active tenants.</Text>
  </View>
);

const COMMS_TABS: readonly { id: CommsTab; label: string }[] = [
  { id: 'chats', label: 'Chats' },
  { id: 'notifications', label: 'Notifications' },
];

export const CommsBody: React.FC<{
  tab: CommsTab;
  onTab: (tab: CommsTab) => void;
  messages: readonly CommsMessage[];
  onOpen: (m: CommsMessage) => void;
}> = ({ tab, onTab, messages, onOpen }) => (
  <View>
    <View style={styles.tabs} accessibilityRole="tablist">
      {COMMS_TABS.map(t => {
        const active = t.id === tab;
        return (
          <Pressable
            key={t.id}
            onPress={() => onTab(t.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
    {messages.map((m, i) => (
      <Pressable
        key={m.id}
        onPress={() => onOpen(m)}
        accessibilityRole="button"
        accessibilityLabel={`${m.from}: ${m.preview}`}
        style={({ pressed }) => [styles.msg, i > 0 && styles.factRule, pressed && styles.pressed]}
      >
        <View style={styles.msgAvatar}>
          <Text style={styles.initialsText}>{m.initials}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.msgHead}>
            <Text style={styles.actionTitle} numberOfLines={1}>
              {m.from}
            </Text>
            <Text style={styles.msgTime}>{m.time}</Text>
          </View>
          <Text style={styles.actionSub} numberOfLines={1}>
            {m.preview}
          </Text>
        </View>
      </Pressable>
    ))}
  </View>
);

/* ------------------------------------------------------------------ */

const SECTION_ICON = ms(30);
const ACTION_TILE = ms(36);
const AVATAR = ms(34);
const UNIT_PHOTO_W = '40%';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
  pressedCard: {
    opacity: 0.92,
  },
  // Title block
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  propName: {
    ...typographyPresets.heroTitleCompact,
    color: colors.navy,
    flexShrink: 1,
  },
  typePill: {
    flexShrink: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.successLight,
  },
  typePillText: {
    ...typographyPresets.badge,
    color: colors.successDark,
  },
  editButton: {
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.sm,
  },
  addressText: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.textSecondary,
  },
  // Section head (on the page)
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionIcon: {
    width: SECTION_ICON,
    height: SECTION_ICON,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  sectionTitle: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
    flex: 1,
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  // Gallery
  gallery: {
    gap: spacing.sm,
  },
  hero: {
    height: ms(200),
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
  },
  heroBar: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoButton: {
    ...shadows.sm,
  },
  thumbs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  thumb: {
    flex: 1,
    height: ms(78),
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
  },
  // Overview
  description: {
    ...typographyPresets.bodyMedium,
    color: colors.textPrimary,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.successLight,
  },
  amenityText: {
    ...typographyPresets.bodyMedium,
    color: colors.textPrimary,
  },
  factsTop: {
    marginTop: spacing.md,
  },
  fact: {
    paddingVertical: spacing.sm + 2,
    gap: spacing.xs,
  },
  factRule: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  factLabel: {
    ...typographyPresets.label,
    color: colors.textSecondary,
  },
  factValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  factStrong: {
    ...typographyPresets.bodyBold,
    flex: 1,
    color: colors.navy,
  },
  factMuted: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.textSecondary,
  },
  initials: {
    width: AVATAR - ms(4),
    height: AVATAR - ms(4),
    borderRadius: (AVATAR - ms(4)) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  initialsText: {
    ...typographyPresets.badge,
    fontFamily: typography.fontFamily.body.semiBold,
    color: colors.navy,
  },
  sharePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  sharePillText: {
    ...typographyPresets.badge,
    color: colors.textPrimary,
  },
  // Health
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  score: {
    ...typographyPresets.priceLarge,
    color: colors.warning,
  },
  scoreMax: {
    ...typographyPresets.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fairPill: {
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warningLight,
  },
  fairPillText: {
    ...typographyPresets.bodyBold,
    color: colors.warningDark,
  },
  metric: {
    marginTop: spacing.md,
  },
  metricHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metricLabel: {
    ...typographyPresets.body,
    color: colors.textPrimary,
  },
  metricValue: {
    ...typographyPresets.bodyBold,
  },
  track: {
    height: ms(6),
    borderRadius: ms(3),
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  trackFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  // Unit card
  unit: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  unitPhotoWrap: {
    width: UNIT_PHOTO_W,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
  },
  unitPhoto: {
    ...StyleSheet.absoluteFill,
    width: undefined,
    height: undefined,
  },
  unitBody: {
    flex: 1,
    gap: spacing.xs + 1,
    paddingVertical: spacing.xs,
  },
  unitHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  unitName: {
    ...typographyPresets.bodyBold,
    flex: 1,
    color: colors.navy,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.successLight,
  },
  statusPillOccupied: {
    backgroundColor: colors.infoLight,
  },
  statusText: {
    ...typographyPresets.badge,
    color: colors.successDark,
  },
  statusTextOccupied: {
    color: colors.primary,
  },
  unitFact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unitFactLabel: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
  },
  unitFactValue: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.textPrimary,
  },
  clear: {
    color: colors.successDark,
  },
  unitActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  unitAction: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  lightBorder: {
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  // Maintenance queue
  queueText: {
    ...typographyPresets.body,
    color: colors.textSecondary,
  },
  queueRule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
    backgroundColor: colors.border,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  vendorScore: {
    ...typographyPresets.bodyBold,
    color: colors.successDark,
  },
  star: {
    ...typographyPresets.bodyBold,
    color: colors.successDark,
    marginLeft: -spacing.xs,
  },
  // Action rows (quick actions / document vault)
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  actionTile: {
    width: ACTION_TILE,
    height: ACTION_TILE,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    ...typographyPresets.bodyBold,
    flexShrink: 1,
    color: colors.navy,
  },
  actionSub: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  // Rent chart
  chart: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  axis: {
    height: PLOT_H,
    justifyContent: 'space-between',
    marginTop: -ms(6),
    marginBottom: -ms(6),
  },
  axisText: {
    ...typographyPresets.microText,
    color: colors.textSecondary,
  },
  plot: {
    height: PLOT_H,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  barSlot: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '62%',
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
  },
  months: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  monthText: {
    ...typographyPresets.microText,
    flex: 1,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  totals: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  total: {
    flex: 1,
    gap: spacing.xxs,
  },
  totalRule: {
    paddingLeft: spacing.md,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.border,
  },
  totalLabel: {
    ...typographyPresets.label,
    color: colors.textSecondary,
  },
  totalValue: {
    ...typographyPresets.price,
  },
  // Residents
  residents: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xl,
    backgroundColor: TILE_BG,
  },
  residentsText: {
    ...typographyPresets.body,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  // Comms
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typographyPresets.bodyMedium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: typography.fontFamily.body.semiBold,
    color: colors.navy,
  },
  msg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  msgAvatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  msgHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  msgTime: {
    ...typographyPresets.label,
    color: colors.textSecondary,
  },
});
