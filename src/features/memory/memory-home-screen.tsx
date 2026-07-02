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
  analyzeCaptureOffline,
  capturedMemories,
  freeOnDeviceCapabilities,
  memoryCategories,
  processingPipeline,
  privacyRules,
  type CapturedMemory,
  type MemoryCategory,
} from '@/core/ai/nexora-ai-architecture';
import { SmartBackground } from '@/ui/components';
import { Colors, Layout, Spacing, Typography } from '@/ui/theme';

const activeFreeCapabilities = freeOnDeviceCapabilities.filter(
  (item) => item.status === 'built' || item.status === 'started',
);

export function MemoryHomeScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const [activeCategory, setActiveCategory] = useState<MemoryCategory>('General');
  const [selectedId, setSelectedId] = useState<string | undefined>(capturedMemories[0]?.id);

  const filteredMemories = useMemo(() => {
    if (activeCategory === 'General') {
      return capturedMemories;
    }

    return capturedMemories.filter((memory) => memory.category === activeCategory);
  }, [activeCategory]);

  const selectedMemory =
    filteredMemories.find((memory) => memory.id === selectedId) ?? filteredMemories[0];
  const selectedAnalysis = selectedMemory ? analyzeCaptureOffline(selectedMemory) : null;
  const activeColor = Colors.categories[activeCategory].color;

  const localStats = [
    { label: 'Cloud calls', value: '0', detail: 'Private mode' },
    { label: 'Local scans', value: String(capturedMemories.length), detail: 'Offline ready' },
    { label: 'Free AI', value: String(activeFreeCapabilities.length), detail: 'Built or started' },
  ];

  return (
    <SmartBackground category={activeCategory}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, isWide && styles.contentContainerWide]}
      >
        <View style={styles.hero}>
          <View style={styles.heroTitleBlock}>
            <Text style={styles.kicker} selectable>
              NEXORA
            </Text>
            <Text style={styles.title} selectable>
              Your second brain. Fully yours.
            </Text>
            <Text style={styles.subtitle} selectable>
              Free on-device AI handles everyday capture, organization, reminders, receipts, and
              local search before anything ever reaches the cloud.
            </Text>
          </View>
          <View style={[styles.privacyBadge, { borderColor: activeColor }]}>
            <View style={[styles.badgeDot, { backgroundColor: activeColor }]} />
            <Text style={styles.privacyText}>Private Mode On</Text>
          </View>
        </View>

        <View style={[styles.statsGrid, isWide && styles.statsGridWide]}>
          {localStats.map((stat) => (
            <Panel key={stat.label} style={[styles.statPanel, isWide && styles.statPanelWide]}>
              <Text style={styles.statValue} selectable>
                {stat.value}
              </Text>
              <Text style={styles.statLabel} selectable>
                {stat.label}
              </Text>
              <Text style={styles.statDetail} selectable>
                {stat.detail}
              </Text>
            </Panel>
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Memory Feed" detail="Started from the existing home prototype" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRail}
          >
            {memoryCategories.map((category) => {
              const isActive = category === activeCategory;
              const categoryColor = Colors.categories[category].color;

              return (
                <Pressable
                  key={category}
                  onPress={() => {
                    setActiveCategory(category);
                    setSelectedId(undefined);
                  }}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    {
                      borderColor: isActive ? categoryColor : 'rgba(255, 255, 255, 0.12)',
                      backgroundColor: isActive
                        ? `${categoryColor}26`
                        : 'rgba(255, 255, 255, 0.05)',
                      opacity: pressed ? 0.72 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: isActive ? categoryColor : 'rgba(255, 255, 255, 0.72)' },
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={[styles.memoryLayout, isWide && styles.memoryLayoutWide]}>
            <View style={styles.memoryList}>
              {filteredMemories.map((memory) => (
                <MemoryRow
                  key={memory.id}
                  memory={memory}
                  selected={selectedMemory?.id === memory.id}
                  onPress={() => setSelectedId(memory.id)}
                />
              ))}
            </View>

            {selectedMemory && selectedAnalysis && (
              <Panel style={[styles.analysisPanel, isWide && styles.analysisPanelWide]}>
                <View style={styles.analysisHeader}>
                  <View style={styles.analysisTitleBlock}>
                    <Text style={styles.panelEyebrow} selectable>
                      Local AI Analysis
                    </Text>
                    <Text style={styles.panelTitle} selectable>
                      {selectedMemory.title}
                    </Text>
                  </View>
                  <ConfidenceBadge value={selectedAnalysis.confidence} />
                </View>

                <Text style={styles.bodyText} selectable>
                  {selectedAnalysis.summary}
                </Text>

                <View style={styles.confidenceTrack}>
                  <View
                    style={[
                      styles.confidenceFill,
                      {
                        width: `${selectedAnalysis.confidence}%`,
                        backgroundColor: Colors.categories[selectedMemory.category].color,
                      },
                    ]}
                  />
                </View>

                <View style={styles.tokenWrap}>
                  {selectedAnalysis.localSignals.map((signal) => (
                    <Token key={signal} label={signal} color={Colors.categories[selectedMemory.category].color} />
                  ))}
                </View>

                <View style={styles.divider} />

                <Text style={styles.subhead} selectable>
                  Suggested free actions
                </Text>
                <View style={styles.actionList}>
                  {selectedAnalysis.actions.map((action) => (
                    <View key={action.label} style={styles.actionRow}>
                      <View style={[styles.actionIcon, { backgroundColor: activeColor }]} />
                      <View style={styles.actionTextBlock}>
                        <Text style={styles.actionTitle} selectable>
                          {action.label}
                        </Text>
                        <Text style={styles.actionDetail} selectable>
                          {action.detail}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Panel>
            )}
          </View>
        </View>

        <View style={[styles.dualGrid, isWide && styles.dualGridWide]}>
          <Panel style={isWide && styles.dualPanelWide}>
            <SectionHeader title="On-Device Pipeline" detail="Free by default" compact />
            <View style={styles.pipelineList}>
              {processingPipeline.map((step) => (
                <View key={step.step} style={styles.pipelineRow}>
                  <View style={[styles.stepNumber, { borderColor: activeColor }]}>
                    <Text style={styles.stepNumberText}>{step.step}</Text>
                  </View>
                  <View style={styles.pipelineCopy}>
                    <Text style={styles.pipelineTitle} selectable>
                      {step.name}
                    </Text>
                    <Text style={styles.pipelineDetail} selectable>
                      {step.freeEngine}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Panel>

          <Panel style={isWide && styles.dualPanelWide}>
            <SectionHeader title="Privacy Rules" detail="Trust builders from the plan" compact />
            <View style={styles.ruleList}>
              {privacyRules.map((rule) => (
                <View key={rule} style={styles.ruleRow}>
                  <View style={[styles.ruleDot, { backgroundColor: activeColor }]} />
                  <Text style={styles.ruleText} selectable>
                    {rule}
                  </Text>
                </View>
              ))}
            </View>
          </Panel>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Free AI Modules" detail="Built for local processing first" />
          <View style={[styles.capabilityGrid, isWide && styles.capabilityGridWide]}>
            {freeOnDeviceCapabilities.slice(0, 6).map((capability) => (
              <Panel
                key={capability.id}
                style={[styles.capabilityPanel, isWide && styles.capabilityPanelWide]}
              >
                <View style={styles.capabilityHeader}>
                  <StatusPill status={capability.status} />
                  <Text style={styles.costText}>{capability.cost}</Text>
                </View>
                <Text style={styles.capabilityTitle} selectable>
                  {capability.title}
                </Text>
                <Text style={styles.capabilityDetail} selectable>
                  {capability.scope}
                </Text>
              </Panel>
            ))}
          </View>
        </View>
      </ScrollView>
    </SmartBackground>
  );
}

function MemoryRow({
  memory,
  selected,
  onPress,
}: {
  memory: CapturedMemory;
  selected: boolean;
  onPress: () => void;
}) {
  const color = Colors.categories[memory.category].color;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.memoryRow,
        selected && { borderColor: color, backgroundColor: `${color}1F` },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.memoryMarker, { backgroundColor: color }]} />
      <View style={styles.memoryCopy}>
        <View style={styles.memoryMetaRow}>
          <Text style={[styles.memoryCategory, { color }]} selectable>
            {memory.category}
          </Text>
          <Text style={styles.memoryTime} selectable>
            {memory.capturedAt}
          </Text>
        </View>
        <Text style={styles.memoryTitle} numberOfLines={1} selectable>
          {memory.title}
        </Text>
        <Text style={styles.memorySubtitle} numberOfLines={2} selectable>
          {memory.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

function SectionHeader({
  title,
  detail,
  compact,
}: {
  title: string;
  detail: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
      <Text style={styles.sectionTitle} selectable>
        {title}
      </Text>
      <Text style={styles.sectionDetail} selectable>
        {detail}
      </Text>
    </View>
  );
}

function Token({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.token, { borderColor: `${color}66`, backgroundColor: `${color}1A` }]}>
      <Text style={[styles.tokenText, { color }]}>{label}</Text>
    </View>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  return (
    <View style={styles.confidenceBadge}>
      <Text style={styles.confidenceValue}>{value}%</Text>
      <Text style={styles.confidenceLabel}>local</Text>
    </View>
  );
}

function StatusPill({ status }: { status: string }) {
  const label = status === 'built' ? 'Built' : status === 'started' ? 'Started' : status === 'next' ? 'Next' : 'Planned';

  return (
    <View style={styles.statusPill}>
      <Text style={styles.statusPillText}>{label}</Text>
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
    maxWidth: 1080,
    width: '100%',
  },
  hero: {
    gap: Spacing.four,
  },
  heroTitleBlock: {
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
    maxWidth: 760,
  },
  privacyBadge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  badgeDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  privacyText: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
  },
  statsGrid: {
    gap: Spacing.three,
  },
  statsGridWide: {
    flexDirection: 'row',
  },
  statPanel: {
    minHeight: 112,
  },
  statPanelWide: {
    flex: 1,
  },
  statValue: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: 31,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '700',
  },
  statDetail: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  section: {
    gap: Spacing.three,
  },
  sectionHeader: {
    gap: Spacing.one,
  },
  sectionHeaderCompact: {
    marginBottom: Spacing.one,
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
  categoryRail: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  categoryChip: {
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  categoryChipText: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
  },
  memoryLayout: {
    gap: Spacing.three,
  },
  memoryLayoutWide: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  memoryList: {
    flex: 1,
    gap: Spacing.two,
  },
  memoryRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 88,
    padding: Spacing.three,
  },
  pressed: {
    opacity: 0.74,
  },
  memoryMarker: {
    borderRadius: 8,
    height: 48,
    width: 8,
  },
  memoryCopy: {
    flex: 1,
    gap: Spacing.one,
    minWidth: 0,
  },
  memoryMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  memoryCategory: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  memoryTime: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.xs,
  },
  memoryTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  memorySubtitle: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  analysisPanel: {
    gap: Spacing.three,
  },
  analysisPanelWide: {
    flex: 1,
    maxWidth: 420,
  },
  analysisHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  analysisTitleBlock: {
    flex: 1,
    gap: Spacing.one,
  },
  panelEyebrow: {
    color: '#8ff3dd',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.lg,
    fontWeight: '800',
    lineHeight: 23,
  },
  bodyText: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  confidenceTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    height: 8,
    overflow: 'hidden',
  },
  confidenceFill: {
    borderRadius: Layout.borderRadius.sm,
    height: '100%',
  },
  tokenWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  token: {
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  tokenText: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 1,
  },
  subhead: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  actionList: {
    gap: Spacing.two,
  },
  actionRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionIcon: {
    borderRadius: 6,
    height: 12,
    marginTop: 4,
    width: 12,
  },
  actionTextBlock: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  actionDetail: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  confidenceBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    minWidth: 66,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  confidenceValue: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  confidenceLabel: {
    color: 'rgba(255, 255, 255, 0.54)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
  },
  dualGrid: {
    gap: Spacing.three,
  },
  dualGridWide: {
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  dualPanelWide: {
    flex: 1,
  },
  pipelineList: {
    gap: Spacing.three,
  },
  pipelineRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  stepNumber: {
    alignItems: 'center',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  stepNumberText: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  pipelineCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  pipelineTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  pipelineDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  ruleList: {
    gap: Spacing.three,
  },
  ruleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  ruleDot: {
    borderRadius: 5,
    height: 10,
    marginTop: 5,
    width: 10,
  },
  ruleText: {
    color: 'rgba(255, 255, 255, 0.72)',
    flex: 1,
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  capabilityGrid: {
    gap: Spacing.three,
  },
  capabilityGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  capabilityPanel: {
    gap: Spacing.two,
  },
  capabilityPanelWide: {
    minHeight: 174,
    width: '31.9%',
  },
  capabilityHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capabilityTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
    lineHeight: 21,
  },
  capabilityDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  statusPill: {
    backgroundColor: 'rgba(143, 243, 221, 0.14)',
    borderColor: 'rgba(143, 243, 221, 0.32)',
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
  costText: {
    color: 'rgba(255, 255, 255, 0.54)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
  },
  panel: {
    backgroundColor: 'rgba(6, 10, 31, 0.66)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
