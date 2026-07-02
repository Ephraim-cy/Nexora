import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  buildPlanPhases,
  freeOnDeviceCapabilities,
  freeTierRules,
  freeToolStack,
  premiumCloudCapabilities,
  processingPipeline,
  startedInventory,
  type BuildStatus,
  type Capability,
} from '@/core/ai/nexora-ai-architecture';
import { SmartBackground } from '@/ui/components';
import { Colors, Layout, Spacing, Typography } from '@/ui/theme';

type ArchitectureMode = 'free' | 'premium';

export function AiArchitectureScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const [mode, setMode] = useState<ArchitectureMode>('free');

  const capabilities = useMemo(
    () => (mode === 'free' ? freeOnDeviceCapabilities : premiumCloudCapabilities),
    [mode],
  );

  return (
    <SmartBackground category={mode === 'free' ? 'Study' : 'Work'}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, isWide && styles.contentContainerWide]}
      >
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker} selectable>
              AI ARCHITECTURE & PROCESSING
            </Text>
            <Text style={styles.title} selectable>
              Hybrid AI, with free local intelligence first.
            </Text>
            <Text style={styles.subtitle} selectable>
              Nexora keeps everyday analysis on the phone for speed, privacy, and offline use.
              Premium cloud AI is reserved for deep reasoning, conversations, sync, and advanced
              generation.
            </Text>
          </View>

          <View style={styles.modeSwitch}>
            <ModeButton label="On-device free" active={mode === 'free'} onPress={() => setMode('free')} />
            <ModeButton
              label="Cloud premium"
              active={mode === 'premium'}
              onPress={() => setMode('premium')}
            />
          </View>
        </View>

        <View style={[styles.summaryGrid, isWide && styles.summaryGridWide]}>
          <SummaryTile value="$0" label="core AI cost" detail="ML Kit, Vision, local rules" />
          <SummaryTile value="0" label="default cloud calls" detail="private mode first" />
          <SummaryTile value="26" label="build weeks" detail="from master plan" />
          <SummaryTile value="19" label="planned features" detail="free plus premium path" />
        </View>

        <View style={[styles.dualGrid, isWide && styles.dualGridWide]}>
          <Panel style={isWide && styles.dualPanelWide}>
            <SectionHeader
              title={mode === 'free' ? 'Free Device AI' : 'Premium Cloud AI'}
              detail={
                mode === 'free'
                  ? 'Fast, private, offline-capable features'
                  : 'Advanced reasoning behind explicit user consent and paid gates'
              }
            />
            <View style={styles.capabilityList}>
              {capabilities.map((capability) => (
                <CapabilityRow key={capability.id} capability={capability} mode={mode} />
              ))}
            </View>
          </Panel>

          <Panel style={isWide && styles.dualPanelWide}>
            <SectionHeader title="Current Folder Status" detail="What was already started here" />
            <View style={styles.inventoryList}>
              {startedInventory.map((item) => (
                <InventoryRow key={item} text={item} />
              ))}
            </View>
          </Panel>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Processing Flow" detail="The 5-step system from the product plan" />
          <View style={[styles.flowGrid, isWide && styles.flowGridWide]}>
            {processingPipeline.map((step) => (
              <Panel key={step.step} style={[styles.flowPanel, isWide && styles.flowPanelWide]}>
                <View style={styles.flowTop}>
                  <View style={styles.flowNumber}>
                    <Text style={styles.flowNumberText}>{step.step}</Text>
                  </View>
                  <Text style={styles.flowTitle} selectable>
                    {step.name}
                  </Text>
                </View>
                <Text style={styles.flowDetail} selectable>
                  {mode === 'free' ? step.freeEngine : step.premiumEngine}
                </Text>
              </Panel>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Free Tool Stack" detail="No paid cloud dependency for the core loop" />
          <View style={[styles.toolGrid, isWide && styles.toolGridWide]}>
            {freeToolStack.map((tool) => (
              <Panel key={tool.name} style={[styles.toolPanel, isWide && styles.toolPanelWide]}>
                <View style={styles.toolHeader}>
                  <Text style={styles.toolCost}>{tool.cost}</Text>
                </View>
                <Text style={styles.toolTitle} selectable>
                  {tool.name}
                </Text>
                <Text style={styles.toolDetail} selectable>
                  {tool.use}
                </Text>
              </Panel>
            ))}
          </View>
        </View>

        <View style={[styles.dualGrid, isWide && styles.dualGridWide]}>
          <Panel style={isWide && styles.dualPanelWide}>
            <SectionHeader title="Feature Gates" detail="Free stays useful, Pro unlocks scale" />
            <View style={styles.gateTable}>
              {freeTierRules.map((rule) => (
                <View key={rule.label} style={styles.gateRow}>
                  <Text style={styles.gateLabel} selectable>
                    {rule.label}
                  </Text>
                  <View style={styles.gateValues}>
                    <Text style={styles.gateFree} selectable>
                      Free: {rule.free}
                    </Text>
                    <Text style={styles.gatePro} selectable>
                      Pro: {rule.pro}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Panel>

          <Panel style={isWide && styles.dualPanelWide}>
            <SectionHeader title="Build Plan" detail="26-week roadmap condensed from the PDF" />
            <View style={styles.phaseList}>
              {buildPlanPhases.map((phase) => (
                <View key={phase.phase} style={styles.phaseRow}>
                  <View style={styles.phaseHeader}>
                    <View>
                      <Text style={styles.phaseName} selectable>
                        {phase.phase} - {phase.title}
                      </Text>
                      <Text style={styles.phaseWeeks} selectable>
                        {phase.weeks}
                      </Text>
                    </View>
                    <StatusPill status={phase.status} />
                  </View>
                  <Text style={styles.phaseFocus} selectable>
                    {phase.focus}
                  </Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${phase.progress}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </Panel>
        </View>
      </ScrollView>
    </SmartBackground>
  );
}

function ModeButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.modeButton,
        active && styles.modeButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SummaryTile({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <Panel style={styles.summaryTile}>
      <Text style={styles.summaryValue} selectable>
        {value}
      </Text>
      <Text style={styles.summaryLabel} selectable>
        {label}
      </Text>
      <Text style={styles.summaryDetail} selectable>
        {detail}
      </Text>
    </Panel>
  );
}

function CapabilityRow({
  capability,
  mode,
}: {
  capability: Capability;
  mode: ArchitectureMode;
}) {
  const accent = mode === 'free' ? '#8ff3dd' : '#f9c74f';

  return (
    <View style={styles.capabilityRow}>
      <View style={[styles.capabilityDot, { backgroundColor: accent }]} />
      <View style={styles.capabilityCopy}>
        <View style={styles.capabilityHeader}>
          <Text style={styles.capabilityTitle} selectable>
            {capability.title}
          </Text>
          <Text style={[styles.capabilityCost, { color: accent }]}>{capability.cost}</Text>
        </View>
        <Text style={styles.capabilityScope} selectable>
          {capability.scope}
        </Text>
        <Text style={styles.capabilityAdapter} selectable>
          {capability.adapter}
        </Text>
      </View>
    </View>
  );
}

function InventoryRow({ text }: { text: string }) {
  return (
    <View style={styles.inventoryRow}>
      <View style={styles.inventoryDot} />
      <Text style={styles.inventoryText} selectable>
        {text}
      </Text>
    </View>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

function SectionHeader({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle} selectable>
        {title}
      </Text>
      <Text style={styles.sectionDetail} selectable>
        {detail}
      </Text>
    </View>
  );
}

function StatusPill({ status }: { status: BuildStatus }) {
  const labels: Record<BuildStatus, string> = {
    built: 'Built',
    started: 'Started',
    next: 'Next',
    planned: 'Planned',
  };

  return (
    <View style={styles.statusPill}>
      <Text style={styles.statusPillText}>{labels[status]}</Text>
    </View>
  );
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
    maxWidth: 1120,
    width: '100%',
  },
  hero: {
    gap: Spacing.four,
  },
  heroCopy: {
    gap: Spacing.two,
  },
  kicker: {
    color: '#8ff3dd',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 39,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.base,
    lineHeight: 23,
    maxWidth: 820,
  },
  modeSwitch: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.one,
    padding: Spacing.one,
  },
  modeButton: {
    borderRadius: Layout.borderRadius.sm,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(143, 243, 221, 0.18)',
  },
  modeButtonText: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  modeButtonTextActive: {
    color: '#8ff3dd',
  },
  pressed: {
    opacity: 0.72,
  },
  summaryGrid: {
    gap: Spacing.three,
  },
  summaryGridWide: {
    flexDirection: 'row',
  },
  summaryTile: {
    flex: 1,
    minHeight: 120,
  },
  summaryValue: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: 31,
    fontWeight: '800',
  },
  summaryLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  summaryDetail: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  dualGrid: {
    gap: Spacing.three,
  },
  dualGridWide: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  dualPanelWide: {
    flex: 1,
  },
  section: {
    gap: Spacing.three,
  },
  sectionHeader: {
    gap: Spacing.one,
  },
  sectionTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    lineHeight: 27,
  },
  sectionDetail: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  capabilityList: {
    gap: Spacing.three,
  },
  capabilityRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  capabilityDot: {
    borderRadius: 6,
    height: 12,
    marginTop: 5,
    width: 12,
  },
  capabilityCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  capabilityHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  capabilityTitle: {
    color: Colors.white,
    flex: 1,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
    lineHeight: 20,
  },
  capabilityCost: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
  },
  capabilityScope: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  capabilityAdapter: {
    color: 'rgba(255, 255, 255, 0.48)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.xs,
    lineHeight: 17,
  },
  inventoryList: {
    gap: Spacing.three,
  },
  inventoryRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  inventoryDot: {
    backgroundColor: '#f9c74f',
    borderRadius: 5,
    height: 10,
    marginTop: 5,
    width: 10,
  },
  inventoryText: {
    color: 'rgba(255, 255, 255, 0.72)',
    flex: 1,
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  flowGrid: {
    gap: Spacing.three,
  },
  flowGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flowPanel: {
    minHeight: 150,
  },
  flowPanelWide: {
    width: '31.9%',
  },
  flowTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  flowNumber: {
    alignItems: 'center',
    borderColor: 'rgba(143, 243, 221, 0.4)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  flowNumberText: {
    color: '#8ff3dd',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  flowTitle: {
    color: Colors.white,
    flex: 1,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  flowDetail: {
    color: 'rgba(255, 255, 255, 0.66)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  toolGrid: {
    gap: Spacing.three,
  },
  toolGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toolPanel: {
    minHeight: 158,
  },
  toolPanelWide: {
    width: '31.9%',
  },
  toolHeader: {
    alignItems: 'flex-start',
  },
  toolCost: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(143, 243, 221, 0.14)',
    borderColor: 'rgba(143, 243, 221, 0.32)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    color: '#8ff3dd',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    textTransform: 'uppercase',
  },
  toolTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
    lineHeight: 21,
  },
  toolDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  gateTable: {
    gap: Spacing.two,
  },
  gateRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  gateLabel: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  gateValues: {
    gap: Spacing.one,
  },
  gateFree: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
  },
  gatePro: {
    color: '#f9c74f',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
  },
  phaseList: {
    gap: Spacing.three,
  },
  phaseRow: {
    gap: Spacing.two,
  },
  phaseHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  phaseName: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  phaseWeeks: {
    color: 'rgba(255, 255, 255, 0.48)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.xs,
    lineHeight: 17,
  },
  phaseFocus: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  progressTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    height: 7,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#8ff3dd',
    borderRadius: Layout.borderRadius.sm,
    height: '100%',
  },
  statusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  statusPillText: {
    color: '#8ff3dd',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  panel: {
    backgroundColor: 'rgba(6, 10, 31, 0.66)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.three,
    padding: Spacing.four,
  },
});
