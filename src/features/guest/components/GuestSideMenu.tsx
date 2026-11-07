/**
 * GuestSideMenu: full-height drawer that slides in from the right over a
 * dimmed page (opened by the hero's burger button).
 *  - Navy header: Log In button + close, and a "New to Urban Nest? Register"
 *    link (the usual pattern in Airbnb / Booking.com).
 *  - Grouped options (Explore / Discover / Support) with icons.
 * Closes on backdrop tap, the close button, Android back, or a swipe to
 * the right. The chosen option is reported after the close animation so
 * scrolling / navigation doesn't fight the slide.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookmarkIcon,
  ChevronRightIcon,
  CloseIcon,
  HomeIcon,
  KeyIcon,
  MapPinIcon,
  MessageBubbleIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
} from '@/components/icons';
import {
  borderRadius,
  colors,
  spacing,
  typographyPresets,
} from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { BuildingIcon, StarGlyph } from './GuestIcons';

export type GuestMenuKey =
  | 'login'
  | 'register'
  | 'home'
  | 'search'
  | 'rent'
  | 'buy'
  | 'featured'
  | 'guides'
  | 'cities'
  | 'help'
  | 'about'
  | 'terms';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (key: GuestMenuKey) => void;
}

type IconRender = (color: string) => React.ReactNode;

interface MenuItem {
  key: GuestMenuKey;
  label: string;
  icon: IconRender;
}

const ICON = ms(17);

const GROUPS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Explore',
    items: [
      {
        key: 'home',
        label: 'Home',
        icon: c => <HomeIcon size={ICON} color={c} />,
      },
      {
        key: 'search',
        label: 'Search Homes',
        icon: c => <SearchIcon size={ICON} color={c} />,
      },
      {
        key: 'rent',
        label: 'Rent a Home',
        icon: c => <KeyIcon size={ICON} color={c} />,
      },
      {
        key: 'buy',
        label: 'Buy a Home',
        icon: c => <BuildingIcon size={ICON} color={c} />,
      },
      {
        key: 'featured',
        label: 'Featured Homes',
        icon: c => <StarGlyph size={ICON} color={c} />,
      },
    ],
  },
  {
    title: 'Discover',
    items: [
      {
        key: 'guides',
        label: 'Resources & Guides',
        icon: c => <BookmarkIcon size={ICON} color={c} />,
      },
      {
        key: 'cities',
        label: 'Popular Cities',
        icon: c => <MapPinIcon size={ICON} color={c} />,
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        key: 'help',
        label: 'Help & Support',
        icon: c => <MessageBubbleIcon size={ICON} color={c} />,
      },
      {
        key: 'about',
        label: 'About Urban Nest',
        icon: c => <HomeIcon size={ICON} color={c} />,
      },
      {
        key: 'terms',
        label: 'Terms & Privacy',
        icon: c => <ShieldIcon size={ICON} color={c} />,
      },
    ],
  },
];

const OPEN_MS = 300;
const CLOSE_MS = 220;

export const GuestSideMenu: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const drawerWidth = Math.min(width * 0.84, 360);

  // 0 = hidden off the right edge, 1 = fully open
  const progress = useRef(new Animated.Value(0)).current;
  // Extra offset while the user drags the drawer to the right
  const drag = useRef(new Animated.Value(0)).current;
  // Keep the Modal mounted until the close animation ends
  const [mounted, setMounted] = useState(visible);
  const pending = useRef<GuestMenuKey | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      drag.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: OPEN_MS,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(progress, {
        toValue: 0,
        duration: CLOSE_MS,
        easing: Easing.bezier(0.4, 0, 1, 1),
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
        drag.setValue(0);
        const key = pending.current;
        pending.current = null;
        if (key) {
          onSelect(key);
        }
      });
    }
    // onSelect is read when the close finishes; no need to re-run for it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const choose = (key: GuestMenuKey) => {
    pending.current = key;
    onClose();
  };

  // Swipe right to close
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dx > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => drag.setValue(Math.max(0, g.dx)),
      onPanResponderRelease: (_, g) => {
        if (g.dx > drawerWidth * 0.3 || g.vx > 0.6) {
          onClose();
        } else {
          Animated.spring(drag, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () =>
        Animated.spring(drag, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }).start(),
    }),
  ).current;

  const translateX = Animated.add(
    progress.interpolate({ inputRange: [0, 1], outputRange: [drawerWidth, 0] }),
    drag,
  );

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.backdrop, { opacity: progress }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close menu"
        />
      </Animated.View>

      <Animated.View
        {...pan.panHandlers}
        style={[
          styles.drawer,
          { width: drawerWidth, transform: [{ translateX }] },
        ]}
        accessibilityViewIsModal
      >
        {/* Header: Log In / Sign Up + close (logo and welcome are already on the page) */}
        {/* Like Airbnb / Booking: one clear Log In button, Register as a link */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => choose('login')}
              accessibilityRole="button"
            >
              <View style={styles.loginButton}>
                <UserIcon size={ms(13)} color={colors.navy} />
                <Text style={styles.loginText}>Log In</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={styles.close}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            >
              <CloseIcon size={ms(13)} color={colors.white} />
            </Pressable>
          </View>
          <Pressable
            onPress={() => choose('register')}
            hitSlop={8}
            accessibilityRole="button"
            style={styles.registerRow}
          >
            <Text style={styles.registerText}>
              New to Urban Nest?{' '}
              <Text style={styles.registerLink}>Register</Text>
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          {GROUPS.map(group => (
            <View key={group.title} style={styles.group}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              {group.items.map(item => (
                <Pressable
                  key={item.key}
                  onPress={() => choose(item.key)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.item,
                    pressed && styles.itemPressed,
                  ]}
                >
                  <View style={styles.itemIcon}>{item.icon(colors.navy)}</View>
                  <Text style={styles.itemText}>{item.label}</Text>
                  <ChevronRightIcon size={ms(12)} color={colors.textMuted} />
                </Pressable>
              ))}
            </View>
          ))}

          <Text style={styles.version}>Urban Nest · v1.0</Text>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 29, 58, 0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: borderRadius.xxl,
    borderBottomLeftRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    boxShadow: '-8px 0px 24px rgba(11, 29, 58, 0.25)',
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.headerDarkBlue,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registerRow: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  registerText: {
    ...typographyPresets.cardSubtitle,
    color: 'rgba(255, 255, 255, 0.72)',
  },
  registerLink: {
    ...typographyPresets.bodyBold,
    fontSize: typographyPresets.cardSubtitle.fontSize,
    color: colors.white,
    textDecorationLine: 'underline',
  },
  close: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  // Compact: sized to its label, not full width
  loginButton: {
    height: ms(36),
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(6),
    borderRadius: borderRadius.button,
    backgroundColor: colors.white,
  },
  loginText: {
    ...typographyPresets.button,
    fontSize: typographyPresets.sectionLink.fontSize,
    color: colors.navy,
  },
  group: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  groupTitle: {
    ...typographyPresets.eyebrow,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: ms(11),
    borderRadius: borderRadius.lg,
  },
  itemPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  itemIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  itemText: {
    ...typographyPresets.bodyMedium,
    flex: 1,
    color: colors.textPrimary,
  },
  version: {
    ...typographyPresets.caption,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
});

export default GuestSideMenu;
