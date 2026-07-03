import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors, Layout, Spacing, Typography } from '@/ui/theme';

export function NexoraPanel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function NexoraSectionHeader({
  eyebrow,
  title,
  detail,
  compact,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
      {eyebrow ? (
        <Text style={styles.eyebrow} selectable>
          {eyebrow}
        </Text>
      ) : null}
      <Text style={styles.sectionTitle} selectable>
        {title}
      </Text>
      {detail ? (
        <Text style={styles.sectionDetail} selectable>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

export function NexoraTag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { borderColor: `${color}66`, backgroundColor: `${color}1A` }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

export function NexoraMetric({
  value,
  label,
  detail,
  color = Colors.electricTeal,
}: {
  value: string;
  label: string;
  detail: string;
  color?: string;
}) {
  return (
    <NexoraPanel style={styles.metricPanel}>
      <Text style={[styles.metricValue, { color }]} selectable>
        {value}
      </Text>
      <Text style={styles.metricLabel} selectable>
        {label}
      </Text>
      <Text style={styles.metricDetail} selectable>
        {detail}
      </Text>
    </NexoraPanel>
  );
}

export function NexoraStatusPill({
  label,
  color = Colors.electricTeal,
}: {
  label: string;
  color?: string;
}) {
  return (
    <View style={[styles.statusPill, { borderColor: `${color}66`, backgroundColor: `${color}1A` }]}>
      <Text style={[styles.statusPillText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: Colors.dark.cardBg,
    borderColor: Colors.glassBorder,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.three,
    padding: Spacing.four,
  },
  sectionHeader: {
    gap: Spacing.one,
  },
  sectionHeaderCompact: {
    gap: 2,
  },
  eyebrow: {
    color: Colors.electricTeal,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    lineHeight: 27,
  },
  sectionDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  tag: {
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  tagText: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
  },
  metricPanel: {
    flex: 1,
    minHeight: 112,
  },
  metricValue: {
    fontFamily: Typography.fonts?.display,
    fontSize: 30,
    fontWeight: '800',
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  metricDetail: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  statusPill: {
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  statusPillText: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
