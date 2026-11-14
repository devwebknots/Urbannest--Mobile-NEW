/**
 * RecentDocumentsCard: file rows (red PDF tile, title, meta, download) and
 * the "Open Document Hub" soft button. The section title sits on the page.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { RecentDocument } from '../types';
import { DashboardCard, ToneTile } from './DashboardParts';
import { LandlordIcon } from './LandlordIcon';

export const RecentDocumentsCard: React.FC<{
  documents: readonly RecentDocument[];
  onOpen: (doc: RecentDocument) => void;
  onDownload: (doc: RecentDocument) => void;
  onOpenHub: () => void;
}> = ({ documents, onOpen, onDownload, onOpenHub }) => (
  <DashboardCard>
    {documents.map((doc, i) => (
      <Pressable
        key={doc.id}
        onPress={() => onOpen(doc)}
        accessibilityRole="button"
        accessibilityLabel={doc.title}
        style={({ pressed }) => [styles.row, i > 0 && styles.divider, pressed && styles.pressed]}
      >
        <ToneTile icon="fileText" tone="red" size={ms(38)} />
        <View style={styles.copy}>
          <Text style={typographyPresets.bodyBold} numberOfLines={1}>
            {doc.title}
          </Text>
          <Text style={typographyPresets.caption} numberOfLines={1}>
            {doc.meta}
          </Text>
        </View>
        <Pressable
          onPress={() => onDownload(doc)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Download ${doc.title}`}
          style={({ pressed }) => [styles.download, pressed && styles.pressed]}
        >
          <LandlordIcon name="download" size={ms(16)} color={colors.navy} />
        </Pressable>
      </Pressable>
    ))}

    <Button
      title="Open Document Hub"
      variant="soft"
      size="md"
      onPress={onOpenHub}
      style={styles.hub}
      leftIcon={<LandlordIcon name="folder" size={ms(16)} color={colors.navy} />}
    />
  </DashboardCard>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  copy: {
    flex: 1,
    gap: ms(2),
  },
  download: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pageTint,
  },
  pressed: {
    opacity: 0.7,
  },
  hub: {
    marginTop: spacing.sm,
  },
});

export default RecentDocumentsCard;
