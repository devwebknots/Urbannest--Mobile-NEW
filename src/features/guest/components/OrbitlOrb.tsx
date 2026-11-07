/**
 * Orbitl AI building blocks: the glowing sphere with its three rings
 * (used as the AI button and on the listening screen), a sparkle, a mic
 * icon and the shared animation hooks. Animated with the native driver;
 * everything stays still in tests and when "reduce motion" is on.
 */

import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

/** A 0→1 value that loops forever */
export function useLoop(duration: number, run: boolean, easing = Easing.linear) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!run) {
      return;
    }
    const anim = Animated.loop(
      Animated.timing(value, { toValue: 1, duration, easing, useNativeDriver: true }),
    );
    anim.start();
    return () => anim.stop();
  }, [duration, easing, run, value]);
  return value;
}

/** True unless motion should be avoided (tests, reduce-motion setting) */
export function useOrbitlMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then(setReduceMotion)
      .catch(() => {});
  }, []);
  return !IS_TEST && !reduceMotion;
}

/** 0 → 1 → 0 over one loop, for pulses */
export const pulse = (v: Animated.Value, from: number, to: number) =>
  v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [from, to, from] });

/** Four-point sparkle drawn from two thin diamonds */
export const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const side = size / Math.SQRT2;
  const diamond = {
    position: 'absolute' as const,
    width: side,
    height: side,
    borderRadius: side * 0.12,
    backgroundColor: color,
  };
  return (
    <View style={[styles.centerBox, { width: size, height: size }]}>
      <View style={[diamond, { transform: [{ scaleX: 0.3 }, { rotate: '45deg' }] }]} />
      <View style={[diamond, { transform: [{ scaleY: 0.3 }, { rotate: '45deg' }] }]} />
    </View>
  );
};

/** Microphone: capsule, holder arc and stand */
export const MicIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const stroke = Math.max(1.6, size * 0.1);
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.36,
          height: size * 0.56,
          borderRadius: size * 0.18,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.3,
          width: size * 0.62,
          height: size * 0.42,
          borderWidth: stroke,
          borderTopWidth: 0,
          borderColor: color,
          borderBottomLeftRadius: size * 0.31,
          borderBottomRightRadius: size * 0.31,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.72,
          width: stroke,
          height: size * 0.2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

interface OrbProps {
  size: number;
  animate: boolean;
}

/** The sphere artwork (cut from the Orbitl emblem, transparent corners) */
const SPHERE_IMAGE = require('@/assets/images/guest/orbitl_sphere.png');

/** Sphere diameter as a share of `size`; rings and glow spill past it */
const SPHERE_SHARE = 0.8;

const GLOW = {
  cyan: '#38BDF8',
  violet: '#8B5CF6',
};

interface RingSpec {
  /** Diameter relative to the sphere */
  d: number;
  color: string;
  /** Starting angle of the ring on screen */
  tilt: number;
  /** How flat the ring looks (rotation around its x axis) */
  lean: number;
  /** One full turn of the ring around the sphere; sign = direction */
  precessMs: number;
  precessDir: 1 | -1;
  /** One lap of the glowing dot along the ring; sign = direction */
  orbitMs: number;
  orbitDir: 1 | -1;
}

/** Three orbits, each turning around the sphere its own way and speed */
const RINGS: RingSpec[] = [
  { d: 1.38, color: '#7DD3FC', tilt: -18, lean: 72, precessMs: 16000, precessDir: 1, orbitMs: 4200, orbitDir: 1 },
  { d: 1.24, color: '#C4B5FD', tilt: 48, lean: 66, precessMs: 20000, precessDir: -1, orbitMs: 5200, orbitDir: -1 },
  {
    d: 1.12,
    color: 'rgba(255, 255, 255, 0.9)',
    tilt: -66,
    lean: 76,
    precessMs: 24000,
    precessDir: 1,
    orbitMs: 3400,
    orbitDir: -1,
  },
];

const spinDeg = (from: number, dir: 1 | -1) => [`${from}deg`, `${from + 360 * dir}deg`];

/**
 * One orbit: a tilted ring that slowly turns around the sphere with a
 * glowing dot travelling along it. Drawn twice: the 'back' copy (whole
 * ring) goes under the sphere, the 'front' copy shows only the near half
 * over it, so ring and dot pass behind the sphere and come back in front.
 */
const Ring: React.FC<{
  spec: RingSpec;
  sphere: number;
  precess: Animated.Value;
  orbit: Animated.Value;
  layer: 'back' | 'front';
}> = ({ spec, sphere, precess, orbit, layer }) => {
  const d = sphere * spec.d;
  const stroke = Math.max(1.5, sphere * 0.028);
  const dot = Math.max(4, sphere * 0.09);

  const body = (
    <>
      <View
        style={[
          styles.ring,
          {
            width: d,
            height: d,
            borderRadius: d / 2,
            borderWidth: stroke,
            borderColor: spec.color,
            shadowColor: spec.color,
          },
        ]}
      />
      {/* Spins in the ring's plane, carrying the dot around the orbit */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: d,
            height: d,
            transform: [
              { rotate: orbit.interpolate({ inputRange: [0, 1], outputRange: spinDeg(0, spec.orbitDir) }) },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.orbitDot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              left: d / 2 - dot / 2,
              top: stroke / 2 - dot / 2,
              borderColor: spec.color,
              shadowColor: spec.color,
            },
          ]}
        />
      </Animated.View>
    </>
  );

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.center,
        {
          width: d,
          height: d,
          marginLeft: -d / 2,
          marginTop: -d / 2,
          transform: [
            { perspective: sphere * 6 },
            {
              rotate: precess.interpolate({
                inputRange: [0, 1],
                outputRange: spinDeg(spec.tilt, spec.precessDir),
              }),
            },
            { rotateX: `${spec.lean}deg` },
          ],
        },
      ]}
    >
      {layer === 'back' ? (
        body
      ) : (
        // Lower half of the ring's plane faces the viewer
        <View style={[styles.ringClip, { top: d / 2, width: d, height: d / 2 }]}>
          <View style={[styles.ring, { top: -d / 2, width: d, height: d }]}>{body}</View>
        </View>
      )}
    </Animated.View>
  );
};

/**
 * Orbitl sphere: the emblem artwork with a cyan/violet glow, three orbits
 * turning around it in different directions, a gentle breathe and float.
 * `onDark` makes the glow stronger for navy backgrounds.
 */
export const OrbitlSphere: React.FC<OrbProps & { onDark?: boolean }> = ({
  size,
  animate,
  onDark = false,
}) => {
  const breathe = useLoop(2800, animate, Easing.inOut(Easing.sin));
  const precess = [
    useLoop(RINGS[0].precessMs, animate),
    useLoop(RINGS[1].precessMs, animate),
    useLoop(RINGS[2].precessMs, animate),
  ];
  const orbits = [
    useLoop(RINGS[0].orbitMs, animate),
    useLoop(RINGS[1].orbitMs, animate),
    useLoop(RINGS[2].orbitMs, animate),
  ];

  const sphere = size * SPHERE_SHARE;
  const glowBoost = onDark ? 1.6 : 1;
  // Glow circle centered on the sphere, nudged by (dx, dy) * sphere
  const glow = (d: number, dx: number, dy: number, color: string, opacity: number) => ({
    position: 'absolute' as const,
    width: sphere * d,
    height: sphere * d,
    borderRadius: (sphere * d) / 2,
    left: size / 2 - (sphere * d) / 2 + sphere * dx,
    top: size / 2 - (sphere * d) / 2 + sphere * dy,
    backgroundColor: color,
    opacity: Math.min(1, opacity * glowBoost),
  });

  const rings = (layer: 'back' | 'front') =>
    RINGS.map((spec, i) => (
      <Ring
        key={`${layer}${i}`}
        spec={spec}
        sphere={sphere}
        precess={precess[i]}
        orbit={orbits[i]}
        layer={layer}
      />
    ));

  return (
    <View pointerEvents="none" style={{ width: size, height: size }}>
      {/* Cyan glow up-left, violet down-right, like the emblem's light */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: pulse(breathe, 0.65, 1), transform: [{ scale: pulse(breathe, 0.96, 1.05) }] },
        ]}
      >
        <View style={glow(1.5, -0.06, -0.06, GLOW.cyan, 0.08)} />
        <View style={glow(1.5, 0.06, 0.06, GLOW.violet, 0.08)} />
        <View style={glow(1.32, -0.05, -0.05, GLOW.cyan, 0.12)} />
        <View style={glow(1.32, 0.05, 0.05, GLOW.violet, 0.12)} />
        <View style={glow(1.16, -0.03, -0.03, GLOW.cyan, 0.18)} />
        <View style={glow(1.16, 0.03, 0.03, GLOW.violet, 0.18)} />
      </Animated.View>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateY: pulse(breathe, 0, -sphere * 0.04) }] },
        ]}
      >
        {rings('back')}

        <Animated.Image
          source={SPHERE_IMAGE}
          resizeMode="contain"
          style={[
            styles.center,
            styles.sphere,
            {
              width: sphere,
              height: sphere,
              borderRadius: sphere / 2,
              marginLeft: -sphere / 2,
              marginTop: -sphere / 2,
              shadowRadius: Math.max(6, sphere * 0.25),
              transform: [{ scale: pulse(breathe, 1, 1.04) }],
            },
          ]}
        />

        {rings('front')}
      </Animated.View>
    </View>
  );
};

/** The AI button icon */
export const OrbitlOrb: React.FC<OrbProps> = ({ size, animate }) => (
  <OrbitlSphere size={size} animate={animate} />
);

const styles = StyleSheet.create({
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  sphere: {
    // Soft colored glow on iOS (Android ignores colored shadows)
    shadowColor: GLOW.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
  },
  ring: {
    position: 'absolute',
    left: 0,
    top: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  ringClip: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
  },
  orbitDot: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});

export default OrbitlOrb;
