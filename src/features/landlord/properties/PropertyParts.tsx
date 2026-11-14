/**
 * Add New Property pieces, in the app's form look (TILE_BG / TILE_BORDER
 * fields, typography presets, brand gradient, done-blue accents):
 *  - PropertyTabs: "Property" / "Unit 🔒" segmented switch (brand gradient
 *    on the active half)
 *  - SubTabs: "Basic" / "Amenities" underline tabs (MessageTabs look)
 *  - DescriptionField: multi-line field with a character counter
 *  - MainImageField: wide photo with a white "Upload Main Image" pill
 *  - ExtraImageSlots: 3 dashed slots for more photos (tap to add, ✕ to remove)
 *  - VideoDropZone: dashed box for the property video
 *  - LocationPreview: small map (free CARTO tiles, no key) with the pin,
 *    +/− zoom and the address + coordinates under it
 */

import React, { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  CloseIcon,
  MapPinIcon,
  PlusIcon,
  VideoCameraIcon,
} from '@/components/icons';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { ApplicationIcon } from '@/features/application/components/ApplicationIcon';
import { LockIcon } from '@/features/guest/components/GuestIcons';
import { personaAssets } from '@/features/persona/assets/personaAssets';
import { DONE_BLUE } from '@/features/renter/components/checkin/CompletedBadge';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { formStyles } from '@/features/renter/components/form/formStyles';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { moderateScale as ms } from '@/utils/responsive';
import type { PickedMedia, PropertySubTab, PropertyTab } from './useAddProperty';

/* ───────────────────────── Tabs ───────────────────────── */

export const PropertyTabs: React.FC<{
  tab: PropertyTab;
  unitUnlocked: boolean;
  onChange: (tab: PropertyTab) => void;
}> = ({ tab, unitUnlocked, onChange }) => (
  <View style={styles.segment} accessibilityRole="tablist">
    {(['property', 'unit'] as const).map(t => {
      const on = t === tab;
      const locked = t === 'unit' && !unitUnlocked;
      return (
        <Pressable
          key={t}
          onPress={() => onChange(t)}
          accessibilityRole="tab"
          accessibilityState={{ selected: on }}
          accessibilityLabel={`${t === 'property' ? 'Property' : 'Unit'}${locked ? ', locked' : ''}`}
          style={[styles.segmentTab, on && styles.segmentTabOn]}
        >
          <Text style={[styles.segmentText, on && styles.segmentTextOn]}>
            {t === 'property' ? 'Property' : 'Unit'}
          </Text>
          {locked ? <LockIcon size={ms(15)} color={colors.textSecondary} /> : null}
        </Pressable>
      );
    })}
  </View>
);

const SUB_TABS: readonly { id: PropertySubTab; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'amenities', label: 'Amenities' },
];

export const SubTabs: React.FC<{
  tab: PropertySubTab;
  onChange: (tab: PropertySubTab) => void;
}> = ({ tab, onChange }) => (
  <View style={styles.subTabs} accessibilityRole="tablist">
    {SUB_TABS.map(t => {
      const on = t.id === tab;
      return (
        <Pressable
          key={t.id}
          onPress={() => onChange(t.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: on }}
          accessibilityLabel={t.label}
          style={styles.subTab}
        >
          <Text style={[styles.subTabText, on && styles.subTabTextOn]}>{t.label}</Text>
          <View style={[styles.underline, on && styles.underlineOn]} />
        </Pressable>
      );
    })}
  </View>
);

/* ─────────────────────── Fields / media ─────────────────────── */

const DESCRIPTION_MAX = 500;

export const DescriptionField: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
}> = ({ value, onChangeText }) => (
  <View style={[formStyles.field, formStyles.textArea]}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Detailed overview of the property's unique value propositions and structural highlights..."
      placeholderTextColor={colors.textMuted}
      multiline
      maxLength={DESCRIPTION_MAX}
      textAlignVertical="top"
      accessibilityLabel="Description"
      style={[formStyles.input, styles.textArea]}
    />
    <Text style={formStyles.counter}>{`${value.length} / ${DESCRIPTION_MAX}`}</Text>
  </View>
);

export const MainImageField: React.FC<{
  image: PickedMedia | null;
  onUpload: () => void;
}> = ({ image, onUpload }) => (
  <Pressable
    onPress={onUpload}
    accessibilityRole="button"
    accessibilityLabel={image ? 'Change main image' : 'Upload main image'}
    style={styles.mainImage}
  >
    <Image
      source={image ? { uri: image.uri } : personaAssets.landlord}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    />
    <View style={[styles.mainShade, image && styles.mainShadeLight]} />
    <View style={styles.mainCenter}>
      <View style={styles.uploadPill}>
        <ApplicationIcon name="upload" size={ms(16)} color={colors.primary} />
        <Text style={styles.uploadPillText}>{image ? 'Change Main Image' : 'Upload Main Image'}</Text>
      </View>
      <Text style={styles.mainHint}>JPG or PNG (Max 5MB)</Text>
    </View>
  </Pressable>
);

export const ExtraImageSlots: React.FC<{
  images: readonly (PickedMedia | null)[];
  onAdd: (slot: number) => void;
  onRemove: (slot: number) => void;
}> = ({ images, onAdd, onRemove }) => (
  <View style={styles.slots}>
    {images.map((img, i) => (
      <Pressable
        key={i}
        onPress={() => onAdd(i)}
        accessibilityRole="button"
        accessibilityLabel={img ? `Replace photo ${i + 2}` : `Add photo ${i + 2}`}
        style={({ pressed }) => [styles.slot, !img && styles.dashed, pressed && styles.pressed]}
      >
        {img ? (
          <>
            <Image source={{ uri: img.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <Pressable
              onPress={() => onRemove(i)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remove photo ${i + 2}`}
              style={styles.slotRemove}
            >
              <CloseIcon size={ms(10)} color={colors.white} />
            </Pressable>
          </>
        ) : (
          <PlusIcon size={ms(20)} color={colors.textSecondary} />
        )}
      </Pressable>
    ))}
  </View>
);

export const VideoDropZone: React.FC<{
  video: PickedMedia | null;
  onUpload: () => void;
  onRemove: () => void;
}> = ({ video, onUpload, onRemove }) =>
  video ? (
    <View style={styles.file}>
      <View style={styles.fileIcon}>
        <VideoCameraIcon size={ms(18)} color={colors.primary} />
      </View>
      <Text style={styles.fileName} numberOfLines={1}>
        {video.name}
      </Text>
      <View style={styles.doneTick}>
        <RenterIcon name="check" size={ms(9)} color={colors.white} />
      </View>
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Remove video"
        style={({ pressed }) => pressed && styles.pressed}
      >
        <ApplicationIcon name="circleX" size={ms(18)} color={colors.textMuted} />
      </Pressable>
    </View>
  ) : (
    <Pressable
      onPress={onUpload}
      accessibilityRole="button"
      accessibilityLabel="Upload property video"
      style={({ pressed }) => [styles.drop, pressed && styles.pressed]}
    >
      <VideoCameraIcon size={ms(26)} color={colors.navy} />
      <Text style={styles.dropTitle}>Upload Property Video</Text>
      <Text style={styles.hint}>MP4 or MOV (Max 50MB)</Text>
    </Pressable>
  );

/* ─────────────────────── Location preview ─────────────────────── */

const TILE = 256;
const MAP_H = ms(170);
const tileUrl = (z: number, x: number, y: number) =>
  `https://${'abcd'[(x + y) % 4]}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}@2x.png`;

/** Web-mercator position of a point, in tiles at zoom z */
const toTile = (lat: number, lng: number, z: number) => {
  const n = 2 ** z;
  const r = (lat * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n,
  };
};

const formatCoord = (v: number, pos: string, neg: string) =>
  `${Math.abs(v).toFixed(4)}° ${v >= 0 ? pos : neg}`;

export const LocationPreview: React.FC<{
  point: { lat: number; lng: number };
  zoom: number;
  located: boolean;
  addressLine: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
}> = ({ point, zoom, located, addressLine, onZoomIn, onZoomOut }) => {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  // Tiles covering the box, placed so the point sits in the middle
  const tiles: { key: string; uri: string; left: number; top: number }[] = [];
  if (width > 0) {
    const n = 2 ** zoom;
    const c = toTile(point.lat, point.lng, zoom);
    const left = c.x * TILE - width / 2;
    const top = c.y * TILE - MAP_H / 2;
    for (let ty = Math.floor(top / TILE); ty <= Math.floor((top + MAP_H) / TILE); ty++) {
      for (let tx = Math.floor(left / TILE); tx <= Math.floor((left + width) / TILE); tx++) {
        if (ty < 0 || ty >= n) {
          continue;
        }
        const wx = ((tx % n) + n) % n;
        tiles.push({
          key: `${zoom}-${tx}-${ty}`,
          uri: tileUrl(zoom, wx, ty),
          left: tx * TILE - left,
          top: ty * TILE - top,
        });
      }
    }
  }

  return (
    <View style={styles.mapCard}>
      <View style={styles.map} onLayout={onLayout} accessibilityLabel="Map of the property location">
        {tiles.map(t => (
          <Image
            key={t.key}
            source={{ uri: t.uri }}
            style={[styles.tile, { left: t.left, top: t.top }]}
          />
        ))}
        {/* Pin: soft halo on the point, pin tip on it */}
        <View pointerEvents="none" style={styles.pinWrap}>
          <View style={styles.pinHalo} />
          <View style={styles.pin}>
            <MapPinIcon size={ms(34)} color={colors.navy} />
          </View>
        </View>
        <View style={styles.zoom}>
          <Pressable
            onPress={onZoomIn}
            accessibilityRole="button"
            accessibilityLabel="Zoom in"
            style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}
          >
            <PlusIcon size={ms(16)} color={colors.navy} />
          </Pressable>
          <View style={styles.zoomRule} />
          <Pressable
            onPress={onZoomOut}
            accessibilityRole="button"
            accessibilityLabel="Zoom out"
            style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}
          >
            <View style={styles.minus} />
          </Pressable>
        </View>
        <Text style={styles.attribution}>© OpenStreetMap © CARTO</Text>
      </View>
      <View style={styles.mapCaption}>
        <ApplicationIcon name="mapPin" size={ms(18)} color={colors.navy} />
        <View style={styles.mapCaptionText}>
          <Text style={styles.mapAddress} numberOfLines={1}>
            {addressLine}
          </Text>
          {located ? (
            <Text style={styles.hint}>
              {`Lat: ${formatCoord(point.lat, 'N', 'S')}   |   Long: ${formatCoord(point.lng, 'E', 'W')}`}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Tabs
  segment: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: ms(44),
    borderRadius: borderRadius.button,
  },
  segmentTabOn: {
    backgroundImage: `linear-gradient(90deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
  },
  segmentText: {
    ...typographyPresets.button,
    color: colors.textSecondary,
  },
  segmentTextOn: {
    color: colors.white,
  },
  subTabs: {
    flexDirection: 'row',
    gap: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subTab: {
    paddingTop: spacing.md,
  },
  subTabText: {
    ...typographyPresets.segmentLabel,
    paddingHorizontal: spacing.xs,
    color: colors.textSecondary,
  },
  subTabTextOn: {
    color: colors.primary,
  },
  underline: {
    height: 2,
    marginTop: spacing.md,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  underlineOn: {
    backgroundColor: colors.primary,
  },
  // Fields / media
  textArea: {
    flex: 1,
    paddingVertical: 0,
  },
  mainImage: {
    height: ms(170),
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: TILE_BG,
  },
  mainShade: {
    ...StyleSheet.absoluteFill,
    backgroundImage: 'linear-gradient(180deg, rgba(11,29,58,0) 30%, rgba(11,29,58,0.55) 100%)',
  },
  mainShadeLight: {
    backgroundImage: 'linear-gradient(180deg, rgba(11,29,58,0) 50%, rgba(11,29,58,0.45) 100%)',
  },
  mainCenter: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  uploadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    height: ms(42),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    boxShadow: '0px 6px 16px rgba(11,29,58,0.25)',
  },
  uploadPillText: {
    ...typographyPresets.button,
    color: colors.primary,
  },
  mainHint: {
    ...typographyPresets.cardSubtitle,
    color: colors.white,
  },
  slots: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  slot: {
    flex: 1,
    height: ms(72),
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TILE_BG,
  },
  dashed: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TILE_BORDER,
  },
  slotRemove: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,29,58,0.65)',
  },
  drop: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TILE_BORDER,
    backgroundColor: TILE_BG,
  },
  dropTitle: {
    ...typographyPresets.bodyBold,
    color: colors.primary,
  },
  hint: {
    ...typographyPresets.cardSubtitle,
  },
  file: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  fileIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.headerGradientEnd}24`,
  },
  fileName: {
    ...typographyPresets.bodyMedium,
    flex: 1,
  },
  doneTick: {
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DONE_BLUE,
  },
  // Map
  mapCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: TILE_BG,
  },
  map: {
    height: MAP_H,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  tile: {
    position: 'absolute',
    width: TILE,
    height: TILE,
  },
  pinWrap: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHalo: {
    position: 'absolute',
    width: ms(56),
    height: ms(22),
    borderRadius: ms(28),
    backgroundColor: `${colors.headerGradientEnd}40`,
  },
  // Pin tip sits on the point
  pin: {
    position: 'absolute',
    bottom: -ms(3),
  },
  zoom: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    boxShadow: '0px 2px 8px rgba(11,29,58,0.18)',
  },
  zoomButton: {
    width: ms(32),
    height: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  minus: {
    width: ms(12),
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.navy,
  },
  attribution: {
    position: 'absolute',
    right: spacing.xs,
    bottom: 2,
    fontSize: ms(8),
    color: colors.textSecondary,
  },
  mapCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  mapCaptionText: {
    flex: 1,
    gap: 2,
  },
  mapAddress: {
    ...typographyPresets.bodyMedium,
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
});
