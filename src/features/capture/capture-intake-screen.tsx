import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  captureSources,
  intakeQueue,
  intakeSteps,
  type CaptureSource,
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

export function CaptureIntakeScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const [selectedSourceId, setSelectedSourceId] = useState(captureSources[0]?.id);

  const selectedSource = useMemo(() => {
    return captureSources.find((source) => source.id === selectedSourceId) ?? captureSources[0];
  }, [selectedSourceId]);

  const activeCategory = selectedSource?.category ?? 'General';
  const activeColor = selectedSource?.accent ?? Colors.categories[activeCategory].color;

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
          <NexoraSectionHeader
            eyebrow="Capture intake"
            title="Bring every memory in cleanly."
            detail="Start with free local intake: camera, screenshots, gallery, files, links, OCR, labels, reminders, and smart organization."
          />
          <View style={[styles.liveBadge, { borderColor: activeColor }]}>
            <View style={[styles.liveDot, { backgroundColor: activeColor }]} />
            <Text style={styles.liveBadgeText}>On-device queue active</Text>
          </View>
        </View>

        <View style={[styles.metricGrid, isWide && styles.metricGridWide]}>
          <NexoraMetric
            value={String(captureSources.length)}
            label="intake paths"
            detail="camera, gallery, docs, links"
            color={Colors.electricTeal}
          />
          <NexoraMetric
            value={String(intakeQueue.length)}
            label="local queue"
            detail="ready for review"
            color={Colors.auroraGreen}
          />
          <NexoraMetric value="0" label="cloud calls" detail="free path stays private" color={Colors.auroraAmber} />
        </View>

        <View style={[styles.workspaceGrid, isWide && styles.workspaceGridWide]}>
          <NexoraPanel style={[styles.sourcesPanel, isWide && styles.workspacePanelWide]}>
            <NexoraSectionHeader
              title="Capture Sources"
              detail="Tap a source to see how Nexora handles it locally."
              compact
            />
            <View style={styles.sourceGrid}>
              {captureSources.map((source) => (
                <SourceCard
                  key={source.id}
                  source={source}
                  selected={source.id === selectedSource?.id}
                  onPress={() => setSelectedSourceId(source.id)}
                />
              ))}
            </View>
          </NexoraPanel>

          {selectedSource ? (
            <NexoraPanel style={[styles.detailPanel, isWide && styles.workspacePanelWide]}>
              <View style={styles.detailHeader}>
                <View style={styles.detailCopy}>
                  <Text style={styles.detailEyebrow} selectable>
                    {selectedSource.signal}
                  </Text>
                  <Text style={styles.detailTitle} selectable>
                    {selectedSource.label}
                  </Text>
                </View>
                <NexoraStatusPill label={selectedSource.state} color={activeColor} />
              </View>

              <Text style={styles.bodyText} selectable>
                {selectedSource.detail}
              </Text>

              <View style={styles.adapterBox}>
                <Text style={styles.adapterLabel} selectable>
                  Adapter
                </Text>
                <Text style={styles.adapterText} selectable>
                  {selectedSource.adapter}
                </Text>
              </View>

              <View style={styles.tokenWrap}>
                <NexoraTag label={selectedSource.category} color={Colors.categories[selectedSource.category].color} />
                <NexoraTag label="local first" color={Colors.electricTeal} />
                <NexoraTag label="review before action" color={Colors.auroraAmber} />
              </View>
            </NexoraPanel>
          ) : null}
        </View>

        <View style={[styles.workspaceGrid, isWide && styles.workspaceGridWide]}>
          <NexoraPanel style={[styles.queuePanel, isWide && styles.workspacePanelWide]}>
            <NexoraSectionHeader
              title="Import Queue"
              detail="Each item shows the current local processing step."
              compact
            />
            <View style={styles.queueList}>
              {intakeQueue.map((item) => (
                <QueueRow key={item.id} item={item} />
              ))}
            </View>
          </NexoraPanel>

          <NexoraPanel style={[styles.pipelinePanel, isWide && styles.workspacePanelWide]}>
            <NexoraSectionHeader
              title="Free AI Pipeline"
              detail="This is the capture foundation before premium cloud reasoning."
              compact
            />
            <View style={styles.stepList}>
              {intakeSteps.map((step, index) => (
                <View key={step.label} style={styles.stepRow}>
                  <View style={[styles.stepNumber, { borderColor: activeColor }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepCopy}>
                    <Text style={styles.stepTitle} selectable>
                      {step.label}
                    </Text>
                    <Text style={styles.stepDetail} selectable>
                      {step.detail}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </NexoraPanel>
        </View>
      </ScrollView>
    </SmartBackground>
  );
}

function SourceCard({
  source,
  selected,
  onPress,
}: {
  source: CaptureSource;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.sourceCard,
        selected && { borderColor: source.accent, backgroundColor: `${source.accent}1F` },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.sourceIcon, { backgroundColor: `${source.accent}24` }]}>
        <View style={[styles.sourceIconDot, { backgroundColor: source.accent }]} />
      </View>
      <Text style={styles.sourceTitle} selectable>
        {source.label}
      </Text>
      <Text style={styles.sourceDetail} numberOfLines={2} selectable>
        {source.signal}
      </Text>
    </Pressable>
  );
}

function QueueRow({ item }: { item: (typeof intakeQueue)[number] }) {
  const color = Colors.categories[item.category].color;

  return (
    <View style={styles.queueRow}>
      <View style={styles.queueHeader}>
        <View style={styles.queueTitleBlock}>
          <Text style={[styles.queueSource, { color }]} selectable>
            {item.source}
          </Text>
          <Text style={styles.queueTitle} selectable>
            {item.title}
          </Text>
        </View>
        <Text style={styles.queueProgressLabel}>{item.progress}%</Text>
      </View>
      <Text style={styles.queueDetail} selectable>
        {item.detail}
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.tokenWrap}>
        <NexoraTag label={item.step} color={color} />
        {item.localSignals.slice(0, 2).map((signal) => (
          <NexoraTag key={signal} label={signal} color={Colors.electricTeal} />
        ))}
      </View>
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
    maxWidth: 1160,
    width: '100%',
  },
  hero: {
    gap: Spacing.four,
  },
  liveBadge: {
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
  liveDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  liveBadgeText: {
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
  sourcesPanel: {
    gap: Spacing.three,
  },
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  sourceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.one,
    minHeight: 128,
    minWidth: 142,
    padding: Spacing.three,
    width: '47%',
  },
  sourceIcon: {
    alignItems: 'center',
    borderRadius: Layout.borderRadius.sm,
    height: 38,
    justifyContent: 'center',
    marginBottom: Spacing.one,
    width: 38,
  },
  sourceIconDot: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  sourceTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  sourceDetail: {
    color: 'rgba(255, 255, 255, 0.56)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  detailPanel: {
    gap: Spacing.three,
  },
  detailHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  detailCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  detailEyebrow: {
    color: Colors.electricTeal,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailTitle: {
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
  adapterBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.one,
    padding: Spacing.three,
  },
  adapterLabel: {
    color: 'rgba(255, 255, 255, 0.52)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  adapterText: {
    color: Colors.white,
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  tokenWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  queuePanel: {
    gap: Spacing.three,
  },
  queueList: {
    gap: Spacing.three,
  },
  queueRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  queueHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  queueTitleBlock: {
    flex: 1,
    gap: Spacing.one,
  },
  queueSource: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  queueTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  queueProgressLabel: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  queueDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  progressTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: Layout.borderRadius.sm,
    height: '100%',
  },
  pipelinePanel: {
    gap: Spacing.three,
  },
  stepList: {
    gap: Spacing.three,
  },
  stepRow: {
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
  stepCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  stepTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  stepDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  pressed: {
    opacity: 0.74,
  },
});
