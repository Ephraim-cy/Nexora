import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  permissionCards,
  privacyActions,
  privacyControls,
  type PrivacyControl,
} from '@/core/ai/nexora-product-workflows';
import {
  NexoraMetric,
  NexoraPanel,
  NexoraSectionHeader,
  NexoraStatusPill,
  NexoraTag,
  SmartBackground,
} from '@/ui/components';
import { Colors, Layout, Spacing, Typography } from '@/ui/theme';

const initialPrivacyState = Object.fromEntries(
  privacyControls.map((control) => [control.id, control.enabled]),
) as Record<string, boolean>;

export function PrivacySettingsScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const [settings, setSettings] = useState(initialPrivacyState);

  const enabledCount = privacyControls.filter((control) => settings[control.id]).length;

  return (
    <SmartBackground category="General">
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, isWide && styles.contentContainerWide]}
      >
        <View style={styles.hero}>
          <NexoraSectionHeader
            eyebrow="Settings and privacy"
            title="Keep Nexora fully yours."
            detail="Control local AI, cloud sync, sensitive previews, reminders, permissions, and data export from one privacy-first surface."
          />
          <View style={styles.privacyBadge}>
            <View style={styles.privacyDot} />
            <Text style={styles.privacyBadgeText}>Cloud AI gated</Text>
          </View>
        </View>

        <View style={[styles.metricGrid, isWide && styles.metricGridWide]}>
          <NexoraMetric
            value={`${enabledCount}/${privacyControls.length}`}
            label="privacy controls"
            detail="enabled locally"
            color={Colors.electricTeal}
          />
          <NexoraMetric value="Off" label="cloud sync" detail="user opt-in required" color={Colors.auroraAmber} />
          <NexoraMetric value="0" label="auto deletes" detail="confirmation required" color={Colors.auroraGreen} />
        </View>

        <View style={[styles.workspaceGrid, isWide && styles.workspaceGridWide]}>
          <NexoraPanel style={[styles.controlsPanel, isWide && styles.workspacePanelWide]}>
            <NexoraSectionHeader
              title="Privacy Controls"
              detail="Defaults follow the hybrid architecture: local first, cloud only when chosen."
              compact
            />
            <View style={styles.controlList}>
              {privacyControls.map((control) => (
                <PrivacyControlRow
                  key={control.id}
                  control={control}
                  enabled={Boolean(settings[control.id])}
                  onChange={(value) =>
                    setSettings((current) => ({
                      ...current,
                      [control.id]: value,
                    }))
                  }
                />
              ))}
            </View>
          </NexoraPanel>

          <NexoraPanel style={[styles.permissionsPanel, isWide && styles.workspacePanelWide]}>
            <NexoraSectionHeader
              title="Permissions"
              detail="Nexora asks late, only when a feature needs access."
              compact
            />
            <View style={styles.permissionList}>
              {permissionCards.map((permission) => (
                <View key={permission.label} style={styles.permissionCard}>
                  <View style={styles.permissionCopy}>
                    <Text style={styles.permissionTitle} selectable>
                      {permission.label}
                    </Text>
                    <Text style={styles.permissionDetail} selectable>
                      {permission.detail}
                    </Text>
                  </View>
                  <NexoraTag label={permission.state} color={Colors.electricTeal} />
                </View>
              ))}
            </View>
          </NexoraPanel>
        </View>

        <View style={[styles.workspaceGrid, isWide && styles.workspaceGridWide]}>
          <NexoraPanel style={[styles.actionsPanel, isWide && styles.workspacePanelWide]}>
            <NexoraSectionHeader
              title="Data Actions"
              detail="Built as explicit user actions, never background surprises."
              compact
            />
            <View style={styles.actionList}>
              {privacyActions.map((action) => (
                <Pressable key={action.label} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
                  <View style={styles.actionCopy}>
                    <Text style={styles.actionTitle} selectable>
                      {action.label}
                    </Text>
                    <Text style={styles.actionDetail} selectable>
                      {action.detail}
                    </Text>
                  </View>
                  <NexoraStatusPill label={statusLabel(action.status)} color={statusColor(action.status)} />
                </Pressable>
              ))}
            </View>
          </NexoraPanel>

          <NexoraPanel style={[styles.vaultPanel, isWide && styles.workspacePanelWide]}>
            <NexoraSectionHeader
              title="Local Vault Model"
              detail="The free build stores first on device; premium sync can mirror later."
              compact
            />
            <View style={styles.vaultStack}>
              <VaultRow label="Private store" value="Local source of truth" color={Colors.electricTeal} />
              <VaultRow label="Encryption key" value="Device protected phase" color={Colors.auroraAmber} />
              <VaultRow label="Cloud AI" value="Premium, explicit request" color={Colors.electricViolet} />
              <VaultRow label="Gallery delete" value="Manual confirmation only" color={Colors.auroraGreen} />
            </View>
          </NexoraPanel>
        </View>
      </ScrollView>
    </SmartBackground>
  );
}

function PrivacyControlRow({
  control,
  enabled,
  onChange,
}: {
  control: PrivacyControl;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.controlRow}>
      <View style={styles.controlCopy}>
        <View style={styles.controlTitleRow}>
          <Text style={styles.controlTitle} selectable>
            {control.label}
          </Text>
          <NexoraStatusPill label={statusLabel(control.status)} color={statusColor(control.status)} />
        </View>
        <Text style={styles.controlDetail} selectable>
          {control.detail}
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onChange}
        thumbColor={enabled ? Colors.white : '#6f789c'}
        trackColor={{ false: 'rgba(255, 255, 255, 0.14)', true: `${Colors.electricTeal}66` }}
      />
    </View>
  );
}

function VaultRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.vaultRow}>
      <View style={[styles.vaultDot, { backgroundColor: color }]} />
      <View style={styles.vaultCopy}>
        <Text style={styles.vaultLabel} selectable>
          {label}
        </Text>
        <Text style={styles.vaultValue} selectable>
          {value}
        </Text>
      </View>
    </View>
  );
}

function statusLabel(status: PrivacyControl['status']) {
  if (status === 'built') {
    return 'built';
  }

  if (status === 'started') {
    return 'started';
  }

  if (status === 'next') {
    return 'next';
  }

  return 'planned';
}

function statusColor(status: PrivacyControl['status']) {
  if (status === 'built') {
    return Colors.auroraGreen;
  }

  if (status === 'started') {
    return Colors.electricTeal;
  }

  if (status === 'next') {
    return Colors.auroraAmber;
  }

  return Colors.electricViolet;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.eight,
  },
  contentContainerWide: {
    alignSelf: 'center',
    maxWidth: 1160,
    width: '100%',
  },
  hero: {
    gap: Spacing.four,
  },
  privacyBadge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: `${Colors.electricTeal}66`,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  privacyDot: {
    backgroundColor: Colors.electricTeal,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  privacyBadgeText: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  metricGrid: {
    gap: Spacing.three,
  },
  metricGridWide: {
    flexDirection: 'row',
  },
  workspaceGrid: {
    gap: Spacing.three,
  },
  workspaceGridWide: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  workspacePanelWide: {
    flex: 1,
  },
  controlsPanel: {
    gap: Spacing.three,
  },
  controlList: {
    gap: Spacing.three,
  },
  controlRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  controlCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  controlTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  controlTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  controlDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  permissionsPanel: {
    gap: Spacing.three,
  },
  permissionList: {
    gap: Spacing.three,
  },
  permissionCard: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    padding: Spacing.three,
  },
  permissionCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  permissionTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  permissionDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  actionsPanel: {
    gap: Spacing.three,
  },
  actionList: {
    gap: Spacing.three,
  },
  actionCard: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    padding: Spacing.three,
  },
  actionCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  actionTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  actionDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  vaultPanel: {
    gap: Spacing.three,
  },
  vaultStack: {
    gap: Spacing.three,
  },
  vaultRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  vaultDot: {
    borderRadius: 6,
    height: 12,
    marginTop: 5,
    width: 12,
  },
  vaultCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  vaultLabel: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  vaultValue: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  pressed: {
    opacity: 0.74,
  },
});
