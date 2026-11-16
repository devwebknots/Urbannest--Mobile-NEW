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
 *  - VideoDropZone: dashed area like "Upload Images" (camera on a soft
 *    blue disc, title, line, "Supports" pill); once picked, a white file
 *    row (icon tile, name, "Video added" tick, Replace, ✕)
 *  - LocationPreview: map (free, key-free Esri tiles: streets, or
 *    satellite + labels) with a branded pulsing pin, Map/Satellite switch,
 *    +/− zoom and a floating address + coordinates card
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
        <VideoCameraIcon size={ms(20)} color={colors.primary} />
      </View>
      <View style={styles.fileText}>
        <Text style={styles.fileName} numberOfLines={1}>
          {video.name}
        </Text>
        <View style={styles.fileStatus}>
          <View style={styles.doneTick}>
            <RenterIcon name="check" size={ms(9)} color={colors.white} />
          </View>
          <Text style={styles.hint}>Video added</Text>
        </View>
      </View>
      <Pressable
        onPress={onUpload}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Replace video"
        style={({ pressed }) => [styles.fileReplace, pressed && styles.pressed]}
      >
        <Text style={styles.fileReplaceText}>Replace</Text>
      </Pressable>
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Remove video"
        style={({ pressed }) => pressed && styles.pressed}
      >
        <ApplicationIcon name="circleX" size={ms(20)} color={colors.textMuted} />
      </Pressable>
    </View>
  ) : (
    // Same dashed area as "Upload Images": icon disc, bold blue title,
    // line, "Supports" pill
    <Pressable
      onPress={onUpload}
      accessibilityRole="button"
      accessibilityLabel="Upload property video"
      style={({ pressed }) => [styles.uploadZone, pressed && styles.pressed]}
    >
      <View style={styles.dropIcon}>
        <VideoCameraIcon size={ms(24)} color={colors.primary} />
      </View>
      <Text style={styles.uploadTitle}>Upload Property Video</Text>
      <Text style={styles.uploadBody}>
        Record a walkthrough or select a video from your device
      </Text>
      <View style={styles.supportsPill}>
        <Text style={styles.supportsText}>Supports: MP4, MOV (Max 50MB)</Text>
      </View>
    </Pressable>
  );

/* ─────────────────────── Location preview ─────────────────────── */

const TILE = 256;
const MAP_H = ms(240);
const PIN = ms(42);

type MapStyle = 'map' | 'satellite';
const MAP_STYLES: readonly { id: MapStyle; label: string }[] = [
  { id: 'map', label: 'Map' },
  { id: 'satellite', label: 'Satellite' },
];

/**
 * Free, key-free Esri tiles (CARTO now answers "API key required", OSM's
 * own servers block apps): street map, or imagery + road / place labels.
 * Esri tile URLs are z / y / x.
 */
const esriUrl = (service: string, z: number, x: number, y: number) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/${z}/${y}/${x}`;
const tileLayers = (style: MapStyle, z: number, x: number, y: number) =>
  style === 'map'
    ? [esriUrl('World_Street_Map', z, x, y)]
    : [
        esriUrl('World_Imagery', z, x, y),
        esriUrl('Reference/World_Transportation', z, x, y),
        esriUrl('Reference/World_Boundaries_and_Places', z, x, y),
      ];

/** Soft pulsing ring under the pin */
const PinPulse: React.FC = () => {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [t]);
  return (
    <Animated.View
      style={[
        styles.pinPulse,
        {
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
          transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }],
        },
      ]}
    />
  );
};

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
  const [mapStyle, setMapStyle] = useState<MapStyle>('map');
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  // Tiles covering the box, placed so the point sits in the middle
  const tiles: { key: string; uris: string[]; left: number; top: number }[] = [];
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
          key: `${mapStyle}-${zoom}-${tx}-${ty}`,
          uris: tileLayers(mapStyle, zoom, wx, ty),
          left: tx * TILE - left,
          top: ty * TILE - top,
        });
      }
    }
  }

  return (
    <View style={styles.mapCard}>
      <View style={styles.map} onLayout={onLayout} accessibilityLabel="Map of the property location">
        {tiles.map(t =>
          t.uris.map((uri, i) => (
            <Image
              key={`${t.key}-${i}`}
              source={{ uri }}
              style={[styles.tile, { left: t.left, top: t.top }]}
            />
          )),
        )}
        {/* Soft edge shade so the controls and card read on any tiles */}
        <View pointerEvents="none" style={styles.mapShade} />

        {/* Pin: pulse + ground shadow on the point, branded marker above it */}
        <View pointerEvents="none" style={styles.pinWrap}>
          {located ? <PinPulse /> : null}
          <View style={styles.pinShadow} />
          <View style={[styles.pin, !located && styles.pinIdle]}>
            <View style={styles.pinHead}>
              <ApplicationIcon name="building" size={ms(18)} color={colors.white} />
            </View>
            <View style={styles.pinTip} />
          </View>
        </View>

        {/* Map / Satellite switch */}
        <View style={styles.styleSwitch} accessibilityRole="tablist">
          {MAP_STYLES.map(s => {
            const on = s.id === mapStyle;
            return (
              <Pressable
                key={s.id}
                onPress={() => setMapStyle(s.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${s.label} view`}
                style={[styles.styleTab, on && styles.styleTabOn]}
              >
                <Text style={[styles.styleText, on && styles.styleTextOn]}>{s.label}</Text>
              </Pressable>
            );
          })}
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
        {/* Floating address card */}
        <View style={styles.mapCaption}>
          <View style={styles.mapCaptionIcon}>
            <MapPinIcon size={ms(16)} color={colors.white} />
          </View>
          <View style={styles.mapCaptionText}>
            <Text style={styles.mapAddress} numberOfLines={1}>
              {addressLine}
            </Text>
            <Text style={styles.hint} numberOfLines={1}>
              {located
                ? `${formatCoord(point.lat, 'N', 'S')}  ·  ${formatCoord(point.lng, 'E', 'W')}`
                : 'The pin moves as you fill the address'}
            </Text>
          </View>
          {located ? (
            <View style={styles.doneTick}>
              <RenterIcon name="check" size={ms(9)} color={colors.white} />
            </View>
          ) : null}
        </View>
        <Text style={styles.attribution}>
          {mapStyle === 'map' ? '© Esri, HERE, Garmin, OpenStreetMap' : '© Esri, Maxar, Earthstar'}
        </Text>
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
  // Video: soft blue disc behind the camera (dashed area reuses uploadZone)
  dropIcon: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  // Video added: white row, icon tile, name + "Video added", Replace, ✕
  file: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  fileIcon: {
    width: ms(44),
    height: ms(44),
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  fileText: {
    flex: 1,
    gap: 3,
  },
  fileName: {
    ...typographyPresets.bodyMedium,
    color: colors.textPrimary,
  },
  fileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  fileReplace: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  fileReplaceText: {
    ...typographyPresets.cardSubtitle,
    fontFamily: typographyPresets.bodyBold.fontFamily,
    color: colors.primary,
  },
  hint: {
    ...typographyPresets.cardSubtitle,
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
    boxShadow: '0px 8px 22px rgba(11,29,58,0.12)',
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
  mapShade: {
    ...StyleSheet.absoluteFill,
    backgroundImage:
      'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.45) 100%)',
  },
  // Zero-size anchor exactly on the point
  pinWrap: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: ms(110),
    height: ms(110),
    borderRadius: ms(55),
    backgroundColor: `${colors.headerGradientEnd}80`,
    borderWidth: 1.5,
    borderColor: colors.headerGradientEnd,
  },
  pinShadow: {
    position: 'absolute',
    width: ms(20),
    height: ms(7),
    borderRadius: ms(10),
    backgroundColor: 'rgba(11,29,58,0.35)',
  },
  // Marker: tip sits on the point
  pin: {
    position: 'absolute',
    bottom: 0,
    left: -PIN / 2,
    width: PIN,
    alignItems: 'center',
  },
  pinIdle: {
    opacity: 0.75,
  },
  pinHead: {
    width: PIN,
    height: PIN,
    borderRadius: PIN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    backgroundImage: `linear-gradient(145deg, ${colors.headerGradientEnd} 0%, ${gradients.button[0]} 100%)`,
    boxShadow: '0px 6px 14px rgba(3,38,76,0.4)',
  },
  pinTip: {
    marginTop: -1,
    borderLeftWidth: ms(7),
    borderRightWidth: ms(7),
    borderTopWidth: ms(10),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.white,
  },
  // Map / Satellite glass switch, top left
  styleSwitch: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    padding: 3,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    boxShadow: '0px 2px 8px rgba(11,29,58,0.18)',
  },
  styleTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.pill,
  },
  styleTabOn: {
    backgroundImage: `linear-gradient(90deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
  },
  styleText: {
    ...typographyPresets.cardSubtitle,
    fontFamily: typographyPresets.bodyBold.fontFamily,
    color: colors.textSecondary,
  },
  styleTextOn: {
    color: colors.white,
  },
  zoom: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.lg,
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
    right: spacing.sm,
    bottom: 2,
    fontSize: ms(8),
    color: colors.textSecondary,
  },
  // Floating address card, bottom of the map
  mapCaption: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    boxShadow: '0px 6px 16px rgba(11,29,58,0.2)',
  },
  mapCaptionIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(145deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
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
