/**
 * AddPersonaScreen: opened by the "Add Persona" card on PersonaSelect.
 * Same blurred-photo night backdrop as the carousel. Top: back button and
 * page title. Middle: a spotlight on the chosen role (glowing orb, title,
 * perks) over a 3 x 2 grid of every role (Landlord, Property Manager,
 * Tenant, PMS Company, Real Estate Agent, UN Admin). Bottom: the white
 * continue button: "Continue as ..." for a role already on the account,
 * "Add ..." (confirm -> request sent) for a new one.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { ChevronLeftIcon } from '@/components/icons';
import { colors, spacing, typography, typographyPresets } from '@/config/theme';
import { personaAssets } from '../assets/personaAssets';
import { PersonaCta } from '../components/PersonaCta';
import { RoleSpotlight } from '../components/RoleSpotlight';
import { RoleTile } from '../components/RoleTile';
import { Scrim } from '../components/Scrim';
import {
  AddPersonaNavigation,
  isRoleAdded,
  useAddPersona,
} from '../hooks/useAddPersona';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';
const COLUMNS = 3;
const GRID_GAP = 10;

interface Props {
  navigation?: AddPersonaNavigation;
}

export const AddPersonaScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useAddPersona(navigation);
  const [spotlightHeight, setSpotlightHeight] = useState<number | undefined>();

  const contentWidth = Math.min(width - spacing.screenHorizontal * 2, 420);
  const tileWidth = (contentWidth - GRID_GAP * (COLUMNS - 1)) / COLUMNS;

  // Entrance: spotlight settles, tiles rise one after another
  const intro = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;
  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    Animated.timing(intro, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [intro]);
  const rise = (from: number, start = 0) => {
    const progress = intro.interpolate({
      inputRange: [start, Math.min(start + 0.6, 1)],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return {
      opacity: progress,
      transform: [
        {
          translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [from, 0],
          }),
        },
      ],
    };
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Backdrop />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
        <Pressable
          onPress={vm.goBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
        >
          <ChevronLeftIcon size={16} color={colors.white} />
        </Pressable>
        <View style={styles.topTitles}>
          <Text style={styles.brand}>URBANNEST</Text>
          {/* Commented out at the user's request (not needed in the top bar).
          <Text style={styles.pageTitle}>Add a persona</Text> */}
        </View>
        <View style={styles.spacer} />
      </View>

      {/* No scrolling: grid + button keep their size, the spotlight takes
          the space left and shrinks its photo to fit */}
      <View style={styles.body}>
        <Animated.View
          style={[styles.spotlightArea, rise(-12)]}
          onLayout={e => setSpotlightHeight(e.nativeEvent.layout.height)}
        >
          <RoleSpotlight
            role={vm.selected}
            index={vm.selectedIndex}
            count={vm.roles.length}
            maxHeight={spotlightHeight}
          />
        </Animated.View>

        <View style={[styles.gridArea, { width: contentWidth }]}>
          <Animated.View style={[styles.gridHeader, rise(16, 0.15)]}>
            <Text style={styles.gridLabel}>ALL ROLES</Text>
            <View style={styles.gridRule} />
          </Animated.View>

          <View style={styles.grid}>
            {vm.roles.map((role, i) => (
              <Animated.View key={role.id} style={rise(28, 0.2 + i * 0.06)}>
                <RoleTile
                  role={role}
                  width={tileWidth}
                  selected={role.id === vm.selected.id}
                  added={isRoleAdded(role)}
                  onPress={() => vm.select(role.id)}
                />
              </Animated.View>
            ))}
          </View>
        </View>
      </View>

      <Animated.View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + spacing.lg },
          rise(40, 0.3),
        ]}
      >
        <PersonaCta
          label={vm.ctaLabel}
          width={contentWidth}
          onPress={vm.onContinue}
        />
      </Animated.View>

      <AppDialog {...vm.dialog.props} />
    </View>
  );
};

/** Blurred "Add persona" photo under a deep navy tint. */
const Backdrop: React.FC = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Animated.Image
      source={personaAssets.addPersona}
      blurRadius={28}
      resizeMode="cover"
      style={[StyleSheet.absoluteFill, styles.backdropImage]}
    />
    <View style={styles.backdropTint} />
    <View style={styles.glow} />
    <Scrim edge="top" extent={0.3} maxOpacity={0.75} />
    <Scrim edge="bottom" extent={0.4} maxOpacity={0.95} />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.headerDarkBlue,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.8)',
  },
  // Soft blue light behind the spotlight orb
  glow: {
    position: 'absolute',
    top: '12%',
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(81,142,249,0.10)',
    boxShadow: '0px 0px 120px rgba(81,142,249,0.35)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  spacer: {
    width: 40,
  },
  backPressed: {
    opacity: 0.7,
  },
  topTitles: {
    alignItems: 'center',
  },
  brand: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.xxs,
    letterSpacing: 3,
    color: colors.subtitlePeriwinkle,
  },
  pageTitle: {
    ...typographyPresets.sectionHeading,
    color: colors.white,
    marginTop: spacing.xxs,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  // Takes all height the grid leaves; RoleSpotlight sizes its photo to it
  spotlightArea: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    minHeight: 0,
  },
  gridArea: {
    marginTop: spacing.lg,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gridLabel: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.xxs,
    letterSpacing: 1.6,
    color: colors.subtitlePeriwinkle,
  },
  gridRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md,
    backgroundColor: 'rgba(199,210,254,0.25)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
});

export default AddPersonaScreen;
