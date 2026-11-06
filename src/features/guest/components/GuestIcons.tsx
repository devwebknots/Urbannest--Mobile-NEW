/**
 * Small View-drawn icons used by the guest home page
 * (no native icon library needed).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  size?: number;
  color?: string;
}

const stroke = (size: number, k = 0.09) => Math.max(1.4, size * k);

const Box: React.FC<{ size: number; children: React.ReactNode }> = ({
  size,
  children,
}) => <View style={[styles.box, { width: size, height: size }]}>{children}</View>;

export const ArrowRightIcon: React.FC<Props> = ({ size = 16, color = '#fff' }) => {
  const s = stroke(size, 0.11);
  const head = size * 0.4;
  return (
    <Box size={size}>
      <View
        style={[
          styles.abs,
          { left: size * 0.12, right: size * 0.16, height: s, backgroundColor: color, borderRadius: s / 2 },
        ]}
      />
      <View
        style={[
          styles.abs,
          {
            right: size * 0.16,
            width: head,
            height: head,
            borderTopWidth: s,
            borderRightWidth: s,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
    </Box>
  );
};

/** Heart; outline mode draws a smaller heart in `fillColor` on top. */
export const HeartIcon: React.FC<Props & { filled?: boolean; fillColor?: string }> = ({
  size = 18,
  color = '#EF4444',
  filled = true,
  fillColor = '#FFFFFF',
}) => {
  const shape = (s: number, c: string) => {
    const a = s * 0.5;
    return (
      <View style={{ width: s, height: s }}>
        <View
          style={[
            styles.abs,
            { width: a, height: a, left: s * 0.25, top: s * 0.33, backgroundColor: c, transform: [{ rotate: '45deg' }] },
          ]}
        />
        <View style={[styles.abs, { width: a, height: a, borderRadius: a / 2, left: s * 0.073, top: s * 0.153, backgroundColor: c }]} />
        <View style={[styles.abs, { width: a, height: a, borderRadius: a / 2, left: s * 0.427, top: s * 0.153, backgroundColor: c }]} />
      </View>
    );
  };
  const inner = size * 0.68;
  return (
    <View style={{ width: size, height: size }}>
      {shape(size, color)}
      {!filled && (
        <View style={[styles.abs, { left: (size - inner) / 2, top: (size - inner) / 2 + size * 0.03 }]}>
          {shape(inner, fillColor)}
        </View>
      )}
    </View>
  );
};

export const StarGlyph: React.FC<Props> = ({ size = 10, color = '#F5B83D' }) => (
  <Text style={{ fontSize: size, lineHeight: size * 1.2, color }}>★</Text>
);

export const BuildingIcon: React.FC<Props> = ({ size = 20, color = '#0B2A5B' }) => {
  const s = stroke(size);
  const win = size * 0.1;
  return (
    <Box size={size}>
      <View
        style={{
          width: size * 0.62,
          height: size * 0.84,
          borderWidth: s,
          borderColor: color,
          borderRadius: 2,
          paddingTop: size * 0.12,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map(row => (
          <View key={row} style={[styles.row, { marginBottom: size * 0.07 }]}>
            <View style={{ width: win, height: win, backgroundColor: color, marginRight: size * 0.1 }} />
            <View style={{ width: win, height: win, backgroundColor: color }} />
          </View>
        ))}
      </View>
    </Box>
  );
};

export const ApartmentsIcon: React.FC<Props> = ({ size = 20, color = '#0B2A5B' }) => {
  const s = stroke(size);
  const dot = size * 0.09;
  return (
    <Box size={size}>
      <View
        style={{
          width: size * 0.78,
          height: size * 0.84,
          borderWidth: s,
          borderColor: color,
          borderRadius: 2,
          justifyContent: 'space-evenly',
          paddingHorizontal: size * 0.08,
        }}
      >
        {[0, 1, 2, 3].map(row => (
          <View key={row} style={[styles.row, { justifyContent: 'space-between' }]}>
            {[0, 1, 2].map(col => (
              <View key={col} style={{ width: dot, height: dot, backgroundColor: color }} />
            ))}
          </View>
        ))}
      </View>
    </Box>
  );
};

export const LayersIcon: React.FC<Props> = ({ size = 20, color = '#0B2A5B' }) => {
  const s = stroke(size, 0.12);
  const d = size * 0.56;
  return (
    <Box size={size}>
      {[0.36, 0.22, 0.08].map(top => (
        <View
          key={top}
          style={[
            styles.abs,
            {
              top: size * top - d * 0.1,
              width: d,
              height: d,
              borderWidth: s,
              borderColor: color,
              borderRadius: 2,
              transform: [{ scaleY: 0.55 }, { rotate: '45deg' }],
            },
          ]}
        />
      ))}
    </Box>
  );
};

export const SlidersIcon: React.FC<Props> = ({ size = 16, color = '#0B2A5B' }) => {
  const s = stroke(size, 0.1);
  const knob = size * 0.3;
  return (
    <Box size={size}>
      <View style={[styles.row, { width: size * 0.8, justifyContent: 'space-between', height: size * 0.86 }]}>
        {[0.15, 0.55, 0.3].map((pos, i) => (
          <View key={i} style={{ width: knob, alignItems: 'center' }}>
            <View style={{ width: s, height: '100%', backgroundColor: color, borderRadius: s / 2 }} />
            <View
              style={[
                styles.abs,
                { top: size * 0.86 * pos, width: knob, height: knob * 0.55, borderRadius: 2, backgroundColor: color },
              ]}
            />
          </View>
        ))}
      </View>
    </Box>
  );
};

export const DollarIcon: React.FC<Props> = ({ size = 18, color = '#64748B' }) => (
  <Box size={size}>
    <View
      style={[
        styles.box,
        { width: size * 0.9, height: size * 0.9, borderRadius: size, borderWidth: stroke(size), borderColor: color },
      ]}
    >
      <Text style={{ color, fontSize: size * 0.55, lineHeight: size * 0.7, fontWeight: '700' }}>$</Text>
    </View>
  </Box>
);

export const BedIcon: React.FC<Props> = ({ size = 16, color = '#334155' }) => {
  const s = stroke(size, 0.11);
  return (
    <Box size={size}>
      <View style={{ width: size * 0.9, height: size * 0.62, justifyContent: 'flex-end' }}>
        <View style={[styles.abs, { left: 0, top: 0, width: s, height: '100%', backgroundColor: color }]} />
        <View
          style={[
            styles.abs,
            { left: s + 1, top: size * 0.14, width: size * 0.26, height: size * 0.16, borderRadius: 2, backgroundColor: color },
          ]}
        />
        <View style={{ height: size * 0.22, borderRadius: 2, backgroundColor: color, marginLeft: s }} />
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={{ width: s, height: size * 0.14, backgroundColor: color }} />
          <View style={{ width: s, height: size * 0.14, backgroundColor: color }} />
        </View>
      </View>
    </Box>
  );
};

export const BathIcon: React.FC<Props> = ({ size = 16, color = '#334155' }) => {
  const s = stroke(size, 0.11);
  return (
    <Box size={size}>
      <View style={{ width: size * 0.9, height: size * 0.8, justifyContent: 'flex-end' }}>
        <View
          style={[
            styles.abs,
            { left: size * 0.08, top: 0, width: size * 0.2, height: size * 0.4, borderTopWidth: s, borderLeftWidth: s, borderColor: color, borderTopLeftRadius: size * 0.1 },
          ]}
        />
        <View
          style={{
            height: size * 0.4,
            borderWidth: s,
            borderColor: color,
            borderBottomLeftRadius: size * 0.18,
            borderBottomRightRadius: size * 0.18,
          }}
        />
      </View>
    </Box>
  );
};

export const AreaIcon: React.FC<Props> = ({ size = 16, color = '#334155' }) => {
  const s = stroke(size, 0.1);
  return (
    <Box size={size}>
      <View style={{ width: size * 0.8, height: size * 0.8, borderWidth: s, borderColor: color, borderRadius: 2 }}>
        <View
          style={[
            styles.abs,
            { right: size * 0.1, top: size * 0.1, width: size * 0.32, height: size * 0.32, borderWidth: s, borderColor: color },
          ]}
        />
      </View>
    </Box>
  );
};

export const LockIcon: React.FC<Props> = ({ size = 18, color = '#2563EB' }) => {
  const s = stroke(size, 0.1);
  return (
    <Box size={size}>
      <View
        style={{
          width: size * 0.46,
          height: size * 0.36,
          borderTopWidth: s,
          borderLeftWidth: s,
          borderRightWidth: s,
          borderColor: color,
          borderTopLeftRadius: size * 0.23,
          borderTopRightRadius: size * 0.23,
          marginBottom: -1,
        }}
      />
      <View style={[styles.box, { width: size * 0.7, height: size * 0.46, borderRadius: 3, borderWidth: s, borderColor: color }]}>
        <View style={{ width: s * 1.2, height: size * 0.14, borderRadius: s, backgroundColor: color }} />
      </View>
    </Box>
  );
};

export const HeadsetIcon: React.FC<Props> = ({ size = 18, color = '#2563EB' }) => {
  const s = stroke(size, 0.1);
  const ear = { width: size * 0.18, height: size * 0.32, borderRadius: size * 0.06, backgroundColor: color };
  return (
    <Box size={size}>
      <View
        style={[
          styles.abs,
          {
            top: size * 0.1,
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: size,
            borderWidth: s,
            borderColor: color,
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
      <View style={[styles.abs, ear, { left: size * 0.06, top: size * 0.44 }]} />
      <View style={[styles.abs, ear, { right: size * 0.06, top: size * 0.44 }]} />
    </Box>
  );
};

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  abs: { position: 'absolute' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
