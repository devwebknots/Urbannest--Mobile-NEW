/**
 * Submitted Application page pieces (layout from the "Submitted
 * Application" design, app theme values):
 *  - DocumentHeading: tileBlue icon tile (file + check), Playfair title and
 *    a line under it.
 *  - FileBar: red PDF tile, file name + "PDF • 1.2 MB", round soft-blue
 *    download / share buttons and a bare full-screen icon.
 *  - LeaseDocumentPaper: a document drawn as a white sheet of paper:
 *    centered title, note, parties box, sections table with check boxes,
 *    closing paragraph and the centered footer. Body font, small sizes.
 *    All its text comes from a DocumentPaperModel (also used by Lease
 *    Review).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { ApplicationIconName, DocumentPaperModel } from '../types';
import { ApplicationIcon } from './ApplicationIcon';

/* ---------- Heading ---------- */

export const DocumentHeading: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <View style={styles.heading}>
    <View style={styles.headingTile}>
      <ApplicationIcon name="fileCheck" size={ms(28)} color={colors.navy} />
    </View>
    <View style={styles.headingText}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

/* ---------- File bar ---------- */

const RoundAction: React.FC<{
  icon: ApplicationIconName;
  label: string;
  onPress: () => void;
  bare?: boolean;
}> = ({ icon, label, onPress, bare = false }) => (
  <Pressable
    onPress={onPress}
    hitSlop={6}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.action, !bare && styles.actionSoft, pressed && styles.pressed]}
  >
    <ApplicationIcon name={icon} size={ms(18)} color={colors.navy} />
  </Pressable>
);

export const FileBar: React.FC<{
  name: string;
  meta: string;
  onDownload: () => void;
  onShare: () => void;
  onExpand: () => void;
  /** Hairline under the bar (on when the paper follows in the same card) */
  divider?: boolean;
}> = ({ name, meta, onDownload, onShare, onExpand, divider = true }) => (
  <View style={[styles.fileBar, divider && styles.fileBarDivider]}>
    <View style={styles.pdfTile}>
      <ApplicationIcon name="fileText" size={ms(22)} color={colors.error} />
    </View>
    <View style={styles.fileText} accessible accessibilityLabel={`${name}, ${meta}`}>
      {/* File name hidden for now
      <Text style={styles.fileName} numberOfLines={1}>
        {name}
      </Text> */}
      <Text style={styles.fileMeta}>{meta}</Text>
    </View>
    <RoundAction icon="download" label="Download" onPress={onDownload} />
    <RoundAction icon="share" label="Share" onPress={onShare} />
    <RoundAction icon="expand" label="Full screen" onPress={onExpand} bare />
  </View>
);

/* ---------- Paper ---------- */

const Box: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
  <View style={styles.checkRow}>
    <Text style={styles.docText}>{label}</Text>
    <View style={styles.checkBox}>{checked ? <Text style={styles.checkMark}>✓</Text> : null}</View>
  </View>
);

/** Any document as a sheet of paper; all its text comes from `doc` */
export const LeaseDocumentPaper: React.FC<{ doc: DocumentPaperModel }> = ({ doc }) => (
  <View style={styles.paper} accessible accessibilityLabel={`${doc.heading}, ${doc.party.name}`}>
    <Text style={styles.docTitle}>{doc.heading.toUpperCase()}</Text>

    <Text style={[styles.docBold, styles.docGap]}>{doc.intro}</Text>
    {doc.notes.length > 0 ? (
      <>
        <Text style={[styles.docBold, styles.docGapSm]}>Note:</Text>
        {doc.notes.map((n, i) => (
          <Text key={n} style={styles.docText}>
            {`${i + 1}. ${n}`}
          </Text>
        ))}
      </>
    ) : null}
    <View style={styles.docRule} />

    <Text style={styles.docText}>{doc.certify}</Text>

    {/* Parties box: name & address | contacts, then the subject row */}
    <View style={[styles.grid, styles.docGapSm]}>
      <View style={styles.gridRow}>
        <View style={[styles.cell, styles.cellWide]}>
          <Text style={styles.docBold}>{doc.party.title}</Text>
          <Text style={styles.docText}>{doc.party.name}</Text>
          <Text style={styles.docText}>{doc.party.address}</Text>
        </View>
        <View style={[styles.cell, styles.cellLast]}>
          {doc.contacts.map((c, i) => (
            <React.Fragment key={c.label}>
              <Text style={[styles.docBold, i > 0 && styles.docGapXs]}>{`${c.label}:`}</Text>
              <Text style={styles.docText}>{c.value}</Text>
            </React.Fragment>
          ))}
        </View>
      </View>
      <View style={[styles.cell, styles.cellTop, styles.cellLast]}>
        <Text style={styles.docBold}>{doc.subject.title}</Text>
        <Text style={styles.docText}>{doc.subject.value}</Text>
      </View>
    </View>

    {/* Sections table */}
    <View style={[styles.grid, styles.docGap]}>
      <View style={[styles.gridRow, styles.tableHead]}>
        <Text style={[styles.th, styles.colSection]}>{doc.columns[0]}</Text>
        <Text style={[styles.th, styles.colDetails]}>{doc.columns[1]}</Text>
        <Text style={[styles.th, styles.colChecks, styles.cellLast]}>{doc.columns[2]}</Text>
      </View>
      {doc.sections.map(s => (
        <View key={s.id} style={[styles.gridRow, styles.cellTop]}>
          <View style={[styles.cell, styles.colSection]}>
            <Text style={styles.docBold}>{s.section}</Text>
            <Text style={styles.docBold}>{s.title}</Text>
          </View>
          <View style={[styles.cell, styles.colDetails]}>
            {s.lines.map(l => (
              <Text key={l} style={styles.docText}>
                {l}
              </Text>
            ))}
          </View>
          <View style={[styles.cell, styles.colChecks, styles.cellLast]}>
            {s.checks.map(c => (
              <Box key={c} label={c} checked />
            ))}
          </View>
        </View>
      ))}
    </View>

    <Text style={[styles.docBold, styles.docGap]}>{doc.closingTitle}</Text>
    <Text style={styles.docSmall}>{doc.closing}</Text>

    <View style={styles.docFooter}>
      {doc.footer.map(l => (
        <Text key={l} style={styles.docFooterText}>
          {l}
        </Text>
      ))}
    </View>
  </View>
);

const HEAD_TILE = ms(56);
const FILE_TILE = ms(44);
const ACTION = ms(40);
const LINE = '#C9D3E1';
const INK = colors.headerDarkBlue;

const styles = StyleSheet.create({
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  // Heading
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  headingTile: {
    width: HEAD_TILE,
    height: HEAD_TILE,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  headingText: {
    flex: 1,
  },
  title: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  // File bar
  fileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fileBarDivider: {
    borderBottomWidth: 1,
    borderBottomColor: TILE_BORDER,
  },
  pdfTile: {
    width: FILE_TILE,
    height: FILE_TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorLight,
  },
  fileText: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  fileName: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  fileMeta: {
    ...typographyPresets.cardSubtitle,
    marginTop: ms(1),
  },
  action: {
    width: ACTION,
    height: ACTION,
    borderRadius: ACTION / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSoft: {
    backgroundColor: colors.tileBlue,
  },
  // Paper
  paper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xs,
    ...shadows.sm,
  },
  docTitle: {
    fontFamily: typography.fontFamily.body.bold,
    fontWeight: typography.fontWeight.bold,
    fontSize: scaleFont(12.5),
    color: INK,
    textAlign: 'center',
  },
  docBold: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    fontSize: scaleFont(9),
    lineHeight: scaleFont(12.5),
    color: INK,
  },
  docText: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(9),
    lineHeight: scaleFont(12.5),
    color: INK,
  },
  docSmall: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(8),
    lineHeight: scaleFont(11),
    color: INK,
    marginTop: spacing.xxs,
  },
  docGap: {
    marginTop: spacing.md,
  },
  docGapSm: {
    marginTop: spacing.sm,
  },
  docGapXs: {
    marginTop: spacing.xs,
  },
  docRule: {
    height: 1,
    marginVertical: spacing.sm,
    backgroundColor: LINE,
  },
  grid: {
    borderWidth: 1,
    borderColor: LINE,
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    padding: spacing.xs + 2,
    borderRightWidth: 1,
    borderRightColor: LINE,
  },
  cellWide: {
    flex: 1.7,
  },
  cellLast: {
    flex: 1,
    borderRightWidth: 0,
  },
  cellTop: {
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  tableHead: {
    backgroundColor: colors.tileBlue,
  },
  th: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    fontSize: scaleFont(9),
    color: INK,
    textAlign: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.xs,
    borderRightWidth: 1,
    borderRightColor: LINE,
  },
  colSection: {
    flex: 1.2,
  },
  colDetails: {
    flex: 1.3,
  },
  colChecks: {
    flex: 1,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  checkBox: {
    width: ms(9),
    height: ms(9),
    borderWidth: 1,
    borderColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: scaleFont(7),
    lineHeight: scaleFont(8),
    color: INK,
  },
  docFooter: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  docFooterText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    fontSize: scaleFont(9.5),
    lineHeight: scaleFont(14),
    color: INK,
    textAlign: 'center',
  },
});
