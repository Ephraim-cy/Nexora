import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  cleanerGroups,
  cleanerRules,
  cleanerStats,
  type CleanerGroup,
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

export function GalleryCleanerScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const [selectedGroupId, setSelectedGroupId] = useState(cleanerGroups[0]?.id);

  const selectedGroup = useMemo(() => {
    return cleanerGroups.find((group) => group.id === selectedGroupId) ?? cleanerGroups[0];
  }, [selectedGroupId]);

  const activeCategory = selectedGroup?.category ?? 'Media';
  const activeColor = Colors.categories[activeCategory].color;

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
            eyebrow="Smart gallery cleaner"
            title="Clean photos without losing trust."
            detail="Group duplicates, blurry images, screenshots, and receipt copies locally. Nexora suggests what to keep, then waits for confirmation."
          />
          <View style={[styles.badge, { borderColor: activeColor }]}>
            <View style={[styles.badgeDot, { backgroundColor: activeColor }]} />
            <Text style={styles.badgeText}>No automatic deletion</Text>
          </View>
        </View>

        <View style={[styles.metricGrid, isWide && styles.metricGridWide]}>
          {cleanerStats.map((stat, index) => (
            <NexoraMetric
              key={stat.label}
              value={stat.value}
              label={stat.label}
              detail={stat.detail}
              color={[Colors.electricTeal, Colors.auroraGreen, Colors.auroraAmber][index]}
            />
          ))}
        </View>

        <View style={[styles.workspaceGrid, isWide && styles.workspaceGridWide]}>
          <NexoraPanel style={[styles.groupPanel, isWide && styles.workspacePanelWide]}>
            <NexoraSectionHeader
              title="Review Groups"
              detail="Local duplicate and blur candidates, grouped for user review."
              compact
            />
            <View style={styles.groupList}>
              {cleanerGroups.map((group) => (
                <CleanerGroupCard
                  key={group.id}
                  group={group}
                  selected={group.id === selectedGroup?.id}
                  onPress={() => setSelectedGroupId(group.id)}
                />
              ))}
            </View>
          </NexoraPanel>

          {selectedGroup ? (
            <NexoraPanel style={[styles.detailPanel, isWide && styles.workspacePanelWide]}>
              <View style={styles.detailHeader}>
                <View style={styles.detailCopy}>
                  <Text style={styles.detailEyebrow} selectable>
                    {selectedGroup.count} items found
                  </Text>
                  <Text style={styles.detailTitle} selectable>
                    {selectedGroup.title}
                  </Text>
                </View>
                <NexoraStatusPill label={`${selectedGroup.confidence}% local`} color={activeColor} />
              </View>

              <Text style={styles.bodyText} selectable>
                {selectedGroup.reason}
              </Text>

              <View style={styles.thumbnailGrid}>
                {selectedGroup.items.map((item, index) => (
                  <View
                    key={item}
                    style={[
                      styles.thumbnail,
                      index === 0 && { borderColor: activeColor, backgroundColor: `${activeColor}20` },
                    ]}
                  >
                    <View style={[styles.thumbnailGlow, { backgroundColor: activeColor }]} />
                    <Text style={styles.thumbnailText} numberOfLines={2} selectable>
                      {item}
                    </Text>
                    {index === 0 ? (
                      <Text style={[styles.keepLabel, { color: activeColor }]} selectable>
                        keep
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>

              <View style={styles.keepBox}>
                <Text style={styles.keepBoxLabel} selectable>
                  Recommended keep
                </Text>
                <Text style={styles.keepBoxTitle} selectable>
                  {selectedGroup.recommendedKeep}
                </Text>
                <Text style={styles.keepBoxDetail} selectable>
                  Possible savings: {selectedGroup.savings}
                </Text>
              </View>

              <View style={styles.tokenWrap}>
                <NexoraTag label={selectedGroup.category} color={activeColor} />
                <NexoraTag label="requires confirmation" color={Colors.auroraAmber} />
                <NexoraTag label="local hash scan" color={Colors.electricTeal} />
              </View>
            </NexoraPanel>
          ) : null}
        </View>

        <NexoraPanel>
          <NexoraSectionHeader
            title="Cleaner Rules"
            detail="The privacy boundaries from the master plan are built into the workflow."
            compact
          />
          <View style={[styles.ruleGrid, isWide && styles.ruleGridWide]}>
            {cleanerRules.map((rule, index) => (
              <View key={rule} style={styles.ruleCard}>
                <View style={[styles.ruleNumber, { borderColor: activeColor }]}>
                  <Text style={styles.ruleNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.ruleText} selectable>
                  {rule}
                </Text>
              </View>
            ))}
          </View>
        </NexoraPanel>
      </ScrollView>
    </SmartBackground>
  );
}

function CleanerGroupCard({
  group,
  selected,
  onPress,
}: {
  group: CleanerGroup;
  selected: boolean;
  onPress: () => void;
}) {
  const color = Colors.categories[group.category].color;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.groupCard,
        selected && { borderColor: color, backgroundColor: `${color}1F` },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.groupHeader}>
        <View style={styles.groupTitleBlock}>
          <Text style={[styles.groupCategory, { color }]} selectable>
            {group.category}
          </Text>
          <Text style={styles.groupTitle} selectable>
            {group.title}
          </Text>
        </View>
        <Text style={styles.groupCount}>{group.count}</Text>
      </View>
      <Text style={styles.groupDetail} selectable>
        {group.reason}
      </Text>
      <View style={styles.groupFooter}>
        <NexoraTag label={group.savings} color={color} />
        <NexoraTag label={`${group.confidence}%`} color={Colors.electricTeal} />
      </View>
    </Pressable>
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
  badge: {
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
  badgeText: {
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
  groupPanel: {
    gap: Spacing.three,
  },
  groupList: {
    gap: Spacing.three,
  },
  groupCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  groupHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  groupTitleBlock: {
    flex: 1,
    gap: Spacing.one,
  },
  groupCategory: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  groupTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  groupCount: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
  },
  groupDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  groupFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
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
  thumbnailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  thumbnail: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.one,
    justifyContent: 'space-between',
    minHeight: 104,
    minWidth: 116,
    overflow: 'hidden',
    padding: Spacing.three,
    width: '47%',
  },
  thumbnailGlow: {
    borderRadius: 10,
    height: 20,
    opacity: 0.78,
    width: 20,
  },
  thumbnailText: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
    lineHeight: 18,
  },
  keepLabel: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  keepBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.one,
    padding: Spacing.three,
  },
  keepBoxLabel: {
    color: 'rgba(255, 255, 255, 0.52)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  keepBoxTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  keepBoxDetail: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
  },
  tokenWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  ruleGrid: {
    gap: Spacing.three,
  },
  ruleGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ruleCard: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 92,
    padding: Spacing.three,
  },
  ruleNumber: {
    alignItems: 'center',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  ruleNumberText: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  ruleText: {
    color: 'rgba(255, 255, 255, 0.72)',
    flex: 1,
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.74,
  },
});
