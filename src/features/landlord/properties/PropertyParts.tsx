/**
 * Add New Property pieces, in the app's form look (TILE_BG / TILE_BORDER
 * fields, typography presets, brand gradient, done-blue accents):
 *  - PropertyTabs: "Property" / "Unit 🔒" segmented switch (brand gradient
 *    on the active half)
 *  - SubTabs: "Basic" / "Amenities" underline tabs (MessageTabs look)
 *  - DescriptionField: multi-line field with a character counter
 *  - PropertyImagesField: dashed upload area (image-plus icon, "Upload
 *    Images", line, "Supports" pill), then a row of photo thumbnails (white
 *    round ✕) + a dashed "+" tile
 *  - VideoDropZone: dashed box for the property video
 *  - LocationPreview: small map (free CARTO tiles, no key) with the pin,
 *    +/− zoom and the address + coordinates under it
 */

import React, { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
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
import { renterIcons } from '@/features/renter/assets/renterAssets';
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

/** Photo row: thumbnail size (about 1.6 : 1, as the design) */
const THUMB_W = ms(104);
const THUMB_H = ms(66);

export const PropertyImagesField: React.FC<{
  images: readonly PickedMedia[];
  onUpload: () => void;
  onRemove: (uri: string) => void;
}> = ({ images, onUpload, onRemove }) => (
  <View style={styles.imagesField}>
    {/* Dashed upload area */}
    <Pressable
      onPress={onUpload}
      accessibilityRole="button"
      accessibilityLabel="Upload images"
      style={({ pressed }) => [styles.uploadZone, pressed && styles.pressed]}
    >
      <Image source={renterIcons.lineImagePlus} style={styles.uploadIcon} resizeMode="contain" />
      <Text style={styles.uploadTitle}>Upload Images</Text>
      <Text style={styles.uploadBody}>Take a photo or select files from your device</Text>
      <View style={styles.supportsPill}>
        <Text style={styles.supportsText}>Supports: JPG, PNG (Max 15MB each)</Text>
      </View>
    </Pressable>

    {/* Uploaded photos + dashed "+" tile */}
    {images.length > 0 ? (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbs}
      >
        {images.map((img, i) => (
          <View key={img.uri} style={styles.thumb}>
            <Image source={{ uri: img.uri }} style={styles.thumbPhoto} resizeMode="cover" />
            <Pressable
              onPress={() => onRemove(img.uri)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remove photo ${i + 1}`}
              style={({ pressed }) => [styles.thumbRemove, pressed && styles.pressed]}
            >
              <CloseIcon size={ms(9)} color={colors.textPrimary} />
            </Pressable>
          </View>
        ))}
        <Pressable
          onPress={onUpload}
          accessibilityRole="button"
          accessibilityLabel="Add more photos"
          style={({ pressed }) => [styles.thumb, styles.addTile, pressed && styles.pressed]}
        >
          <PlusIcon size={ms(20)} color={colors.navy} />
        </Pressable>
      </ScrollView>
    ) : null}
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
  // Images: dashed upload area (design: icon, bold blue title, line,
  // "Supports" pill), then a row of thumbnails + dashed "+" tile
  imagesField: {
    gap: spacing.md,
  },
  uploadZone: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TILE_BORDER,
    backgroundColor: TILE_BG,
  },
  uploadIcon: {
    width: ms(30),
    height: ms(30),
    tintColor: colors.primary,
  },
  uploadTitle: {
    ...typographyPresets.bodyBold,
    fontSize: typographyPresets.sectionTitle.fontSize,
    marginTop: spacing.md,
    color: colors.primary,
  },
  uploadBody: {
    ...typographyPresets.body,
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  supportsPill: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  supportsText: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
  },
  thumbs: {
    gap: spacing.md,
  },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: TILE_BG,
  },
  // Explicit size so a picked photo never draws at its pixel size
  thumbPhoto: {
    width: '100%',
    height: '100%',
  },
  // White round ✕ in the top-right corner
  thumbRemove: {
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
  addTile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TILE_BORDER,
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
