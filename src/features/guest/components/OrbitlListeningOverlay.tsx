/**
 * OrbitlListeningOverlay: full-screen "Orbitl is listening" view.
 * A large orb with ripples and dots orbiting in 3D (they pass behind and
 * in front of it), a live voice wave and example phrases to say.
 * UI only for now; hook speech-to-text in where marked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography, typographyPresets } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { OrbitlOrb, pulse, useLoop, useOrbitlMotion } from './OrbitlOrb';

/** Sphere diameter on the listening screen */
const CORE = ms(150);
const STAGE_W = ms(300);
const STAGE_H = ms(260);
const PROMPT_MS = 3000;

interface Props {
  visible: boolean;
  prompts: string[];
  onClose: () => void;
}

/** Big Orbitl orb: the exact same animated orb as the AI button, larger */
const BigOrb: React.FC<{ animate: boolean }> = ({ animate }) => {
  const breathe = useLoop(2400, animate, Easing.inOut(Easing.sin));
  return (
    <View style={styles.stage} pointerEvents="none">
      <Animated.View style={[styles.glow, { opacity: pulse(breathe, 0.55, 1) }]} />
      {/* The orb draws the sphere at 80% of its size */}
      <OrbitlOrb size={CORE / 0.8} animate={animate} onDark />
    </View>
  );
};

/** Bars that bounce like a live voice level */
const VoiceWave: React.FC<{ animate: boolean }> = ({ animate }) => {
  const b1 = useLoop(620, animate, Easing.inOut(Easing.sin));
  const b2 = useLoop(820, animate, Easing.inOut(Easing.sin));
  const b3 = useLoop(540, animate, Easing.inOut(Easing.sin));
  const b4 = useLoop(760, animate, Easing.inOut(Easing.sin));
  const b5 = useLoop(680, animate, Easing.inOut(Easing.sin));
  return (
    <View style={styles.wave}>
      {[b1, b2, b3, b4, b5].map((v, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            { transform: [{ scaleY: pulse(v, 0.3, i === 2 ? 1 : 0.75) }] },
          ]}
        />
      ))}
    </View>
  );
};

/** Example phrase that fades to the next one every PROMPT_MS */
const CyclingPrompt: React.FC<{ prompts: string[]; animate: boolean }> = ({ prompts, animate }) => {
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!animate || prompts.length < 2) {
      return;
    }
    const timer = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setIndex(i => (i + 1) % prompts.length);
        Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, PROMPT_MS);
    return () => clearInterval(timer);
  }, [animate, fade, prompts.length]);
  return (
    <Animated.Text
      numberOfLines={2}
      style={[
        styles.example,
        {
          opacity: fade,
          transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }],
        },
      ]}
    >
      “{prompts[index]}”
    </Animated.Text>
  );
};

export const OrbitlListeningOverlay: React.FC<Props> = ({ visible, prompts, onClose }) => {
  const insets = useSafeAreaInsets();
  const animate = useOrbitlMotion();
  const enter = useRef(new Animated.Value(0)).current;

  // Orb grows in each time the overlay opens
  useEffect(() => {
    if (!visible) {
      enter.setValue(0);
      return;
    }
    // TODO: start speech-to-text here and send the result to Orbitl
    Animated.spring(enter, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }).start();
  }, [enter, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <View style={[styles.root, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <View style={styles.liveDot} />
            <Text style={styles.badgeText}>Orbitl AI</Text>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={styles.close}
            accessibilityRole="button"
            accessibilityLabel="Close Orbitl"
          >
            <CloseIcon size={ms(14)} color={colors.white} />
          </Pressable>
        </View>

        <Animated.View
          style={[
            styles.body,
            {
              opacity: enter,
              transform: [{ scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
            },
          ]}
        >
          <BigOrb animate={animate} />
          <Text style={styles.title}>I'm listening…</Text>
          <Text style={styles.subtitle}>
            Tell me the kind of home you want, the area and your budget.
          </Text>
          <VoiceWave animate={animate} />
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.tryLabel}>Try saying</Text>
          <CyclingPrompt prompts={prompts} animate={animate} />
          <Pressable
            onPress={onClose}
            style={styles.stop}
            accessibilityRole="button"
            accessibilityLabel="Stop listening"
          >
            <View style={styles.stopSquare} />
          </Pressable>
          <Text style={styles.stopLabel}>Tap to stop</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: colors.headerDarkBlue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: ms(6),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  liveDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(3.5),
    backgroundColor: colors.success,
  },
  badgeText: {
    ...typographyPresets.eyebrow,
    color: colors.white,
  },
  close: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    width: STAGE_W,
    height: STAGE_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: CORE * 1.8,
    height: CORE * 1.8,
    borderRadius: CORE * 0.9,
    backgroundColor: 'rgba(139, 92, 246, 0.18)',
  },
  title: {
    ...typographyPresets.sectionHeading,
    marginTop: spacing.lg,
    fontSize: scaleFont(22),
    lineHeight: scaleFont(28),
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    maxWidth: ms(280),
    fontFamily: typography.fontFamily.body.regular,
    fontSize: typography.fontSize.base,
    lineHeight: scaleFont(20),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  wave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
    height: ms(34),
    marginTop: spacing.xl,
  },
  bar: {
    width: ms(4),
    height: ms(34),
    borderRadius: ms(2),
    backgroundColor: colors.primaryLight,
  },
  footer: {
    alignItems: 'center',
  },
  tryLabel: {
    ...typographyPresets.eyebrow,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  example: {
    marginTop: spacing.sm,
    minHeight: scaleFont(40),
    fontFamily: typography.fontFamily.body.medium,
    fontSize: typography.fontSize.md,
    lineHeight: scaleFont(20),
    color: colors.white,
    textAlign: 'center',
  },
  stop: {
    marginTop: spacing.xl,
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  stopSquare: {
    width: ms(18),
    height: ms(18),
    borderRadius: ms(4),
    backgroundColor: colors.navy,
  },
  stopLabel: {
    ...typographyPresets.caption,
    marginTop: spacing.sm,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default OrbitlListeningOverlay;
