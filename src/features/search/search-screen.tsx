import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  analyzeCaptureOffline,
  capturedMemories,
  memoryCategories,
  type CapturedMemory,
  type MemoryCategory,
} from '@/core/ai/nexora-ai-architecture';
import { SmartBackground } from '@/ui/components';
import { Colors, Layout, Spacing, Typography } from '@/ui/theme';

type SearchScope = 'All' | MemoryCategory;

type ScoredMemory = CapturedMemory & {
  score: number;
  reasons: string[];
  analysis: ReturnType<typeof analyzeCaptureOffline>;
};

const quickQueries = [
  'receipt',
  'whiteboard',
  'flight',
  'trip',
  'study notes',
  'shopping',
];

const defaultRecentQueries = ['July 14 flight', 'coffee receipt', 'study whiteboard'];

export function SearchScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('All');
  const [recentQueries, setRecentQueries] = useState(defaultRecentQueries);
  const [selectedId, setSelectedId] = useState<string | undefined>(capturedMemories[0]?.id);

  const deferredQuery = useDeferredValue(query);

  const scoredMemories = useMemo(() => {
    return buildSearchResults(deferredQuery, scope);
  }, [deferredQuery, scope]);

  const visibleSelectedId = scoredMemories.some((memory) => memory.id === selectedId)
    ? selectedId
    : scoredMemories[0]?.id;
  const selectedMemory = scoredMemories.find((memory) => memory.id === visibleSelectedId) ?? scoredMemories[0];
  const selectedAnalysis = selectedMemory?.analysis ?? null;
  const activeCategory = scope === 'All' ? 'General' : scope;
  const activeColor = Colors.categories[activeCategory].color;

  const handleQueryCommit = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    if (!trimmed) {
      return;
    }

    setRecentQueries((current) => {
      const next = [trimmed, ...current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())];
      return next.slice(0, 5);
    });
  };

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
          <View style={styles.heroCopy}>
            <Text style={styles.kicker} selectable>
              LOCAL SEARCH
            </Text>
            <Text style={styles.title} selectable>
              Find anything you captured, without leaving the device.
            </Text>
            <Text style={styles.subtitle} selectable>
              Nexora searches titles, OCR-ready text, categories, notes, and AI signals locally
              first, so the common path stays fast and private.
            </Text>
          </View>
          <View style={[styles.badge, { borderColor: activeColor }]}>
            <View style={[styles.badgeDot, { backgroundColor: activeColor }]} />
            <Text style={styles.badgeText}>Offline index ready</Text>
          </View>
        </View>

        <View style={[styles.summaryGrid, isWide && styles.summaryGridWide]}>
          <SummaryCard value={String(scoredMemories.length)} label="results" detail="current query scope" />
          <SummaryCard value="0" label="cloud calls" detail="stays local by default" />
          <SummaryCard value={recentQueries.length.toString()} label="recent queries" detail="short memory trail" />
          <SummaryCard value="1s" label="target search" detail="plan target for memory lookup" />
        </View>

        <View style={[styles.dualGrid, isWide && styles.dualGridWide]}>
          <Panel style={isWide && styles.dualPanelWide}>
            <View style={styles.searchBar}>
              <Text style={styles.searchLabel} selectable>
                Search
              </Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={(event) => handleQueryCommit(event.nativeEvent.text)}
                placeholder="Search screenshots, receipts, trips, study notes..."
                placeholderTextColor="rgba(255, 255, 255, 0.36)"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                style={styles.searchInput}
              />
              <Pressable
                onPress={() => {
                  setQuery('');
                  setSelectedId(undefined);
                }}
                style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <SectionTitle title="Scopes" detail="Filter the local index" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {(['All', ...memoryCategories] as SearchScope[]).map((item) => {
                  const isActive = item === scope;
                  const color = item === 'All' ? '#8ff3dd' : Colors.categories[item].color;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setScope(item)}
                      style={({ pressed }) => [
                        styles.chip,
                        {
                          borderColor: isActive ? color : 'rgba(255, 255, 255, 0.12)',
                          backgroundColor: isActive ? `${color}24` : 'rgba(255, 255, 255, 0.05)',
                          opacity: pressed ? 0.76 : 1,
                        },
                      ]}
                    >
                      <Text style={[styles.chipText, { color: isActive ? color : 'rgba(255, 255, 255, 0.7)' }]}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <SectionTitle title="Quick queries" detail="Tap to search the obvious stuff first" />
              <View style={styles.quickGrid}>
                {quickQueries.map((chip) => (
                  <Pressable
                    key={chip}
                    onPress={() => {
                      setQuery(chip);
                      handleQueryCommit(chip);
                      setSelectedId(undefined);
                    }}
                    style={({ pressed }) => [styles.quickChip, pressed && styles.pressed]}
                  >
                    <Text style={styles.quickChipText}>{chip}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionTitle title="Recent queries" detail="Short local history of what you looked for" />
              <View style={styles.recentRow}>
                {recentQueries.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setQuery(item);
                      handleQueryCommit(item);
                      setSelectedId(undefined);
                    }}
                    style={({ pressed }) => [styles.recentChip, pressed && styles.pressed]}
                  >
                    <Text style={styles.recentChipText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Panel>

          {selectedMemory && selectedAnalysis && (
            <Panel style={[styles.detailPanel, isWide && styles.dualPanelWide]}>
              <View style={styles.detailHeader}>
                <View style={styles.detailHeaderCopy}>
                  <Text style={styles.detailEyebrow} selectable>
                    Local match
                  </Text>
                  <Text style={styles.detailTitle} selectable>
                    {selectedMemory.title}
                  </Text>
                  <Text style={styles.detailSubtitle} selectable>
                    {selectedMemory.subtitle}
                  </Text>
                </View>
                <View style={styles.confidenceBox}>
                  <Text style={styles.confidenceValue}>{selectedAnalysis.confidence}%</Text>
                  <Text style={styles.confidenceLabel}>confidence</Text>
                </View>
              </View>

              <Text style={styles.bodyText} selectable>
                {selectedAnalysis.summary}
              </Text>

              <View style={styles.metaRow}>
                <Tag label={selectedMemory.category} color={Colors.categories[selectedMemory.category].color} />
                <Tag label={selectedMemory.contentType} color={activeColor} />
                <Tag label={selectedMemory.capturedAt} color="#8ff3dd" />
              </View>

              <View style={styles.sectionDivider} />

              <View style={styles.section}>
                <SectionTitle title="What matched" detail="Signals the local index used" />
                <View style={styles.tokenWrap}>
                  {selectedAnalysis.localSignals.map((signal) => (
                    <Tag key={signal} label={signal} color={Colors.categories[selectedMemory.category].color} />
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <SectionTitle title="Suggested free actions" detail="Useful without a cloud lookup" />
                <View style={styles.actionList}>
                  {selectedAnalysis.actions.map((action) => (
                    <View key={action.label} style={styles.actionRow}>
                      <View style={[styles.actionDot, { backgroundColor: activeColor }]} />
                      <View style={styles.actionCopy}>
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
              </View>
            </Panel>
          )}
        </View>

        <View style={styles.section}>
          <SectionTitle title="Results" detail="Ranked by local relevance" />
          {scoredMemories.length > 0 ? (
            <View style={[styles.resultsGrid, isWide && styles.resultsGridWide]}>
              {scoredMemories.map((memory) => (
                <SearchResultCard
                  key={memory.id}
                  memory={memory}
                  active={memory.id === selectedMemory?.id}
                  onPress={() => setSelectedId(memory.id)}
                />
              ))}
            </View>
          ) : (
            <Panel>
              <Text style={styles.emptyTitle} selectable>
                No local matches.
              </Text>
              <Text style={styles.emptyText} selectable>
                Try a shorter query, switch scopes, or tap one of the quick searches above.
              </Text>
            </Panel>
          )}
        </View>
      </ScrollView>
    </SmartBackground>
  );
}

function buildSearchResults(query: string, scope: SearchScope): ScoredMemory[] {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(' ').filter(Boolean);

  return capturedMemories
    .filter((memory) => scope === 'All' || memory.category === scope)
    .map((memory, index) => {
      const analysis = analyzeCaptureOffline(memory);
      const searchText = normalize(
        [
          memory.title,
          memory.subtitle,
          memory.category,
          memory.contentType,
          memory.description,
          analysis.summary,
          analysis.localSignals.join(' '),
          analysis.detectedText.join(' '),
        ].join(' '),
      );

      if (!tokens.length) {
        return {
          ...memory,
          score: 100 - index,
          reasons: ['recent capture'],
          analysis,
        };
      }

      let score = 0;
      const reasons: string[] = [];

      for (const token of tokens) {
        if (memory.title.toLowerCase().includes(token)) {
          score += 50;
          reasons.push('title');
          continue;
        }

        if (memory.subtitle.toLowerCase().includes(token)) {
          score += 30;
          reasons.push('subtitle');
          continue;
        }

        if (memory.category.toLowerCase().includes(token) || memory.contentType.toLowerCase().includes(token)) {
          score += 35;
          reasons.push('type');
          continue;
        }

        if (searchText.includes(token)) {
          score += 16;
          reasons.push('body');
          continue;
        }

        score -= 4;
      }

      score += Math.max(0, 18 - index);

      return {
        ...memory,
        score,
        reasons: Array.from(new Set(reasons)),
        analysis,
      };
    })
    .filter((memory) => !tokens.length || memory.score > 0)
    .sort((a, b) => b.score - a.score);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function SearchResultCard({
  memory,
  active,
  onPress,
}: {
  memory: ScoredMemory;
  active: boolean;
  onPress: () => void;
}) {
  const color = Colors.categories[memory.category].color;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.resultCard,
        active && { borderColor: color, backgroundColor: `${color}18` },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.resultHeader}>
        <View style={[styles.resultMarker, { backgroundColor: color }]} />
        <View style={styles.resultMeta}>
          <Text style={[styles.resultCategory, { color }]} selectable>
            {memory.category}
          </Text>
          <Text style={styles.resultTime} selectable>
            {memory.capturedAt}
          </Text>
        </View>
      </View>
      <Text style={styles.resultTitle} numberOfLines={1} selectable>
        {memory.title}
      </Text>
      <Text style={styles.resultSubtitle} numberOfLines={2} selectable>
        {memory.subtitle}
      </Text>
      <View style={styles.resultFooter}>
        <Tag label={memory.contentType} color={color} />
        {memory.reasons.slice(0, 2).map((reason) => (
          <Tag key={reason} label={reason} color="#8ff3dd" />
        ))}
      </View>
    </Pressable>
  );
}

function SummaryCard({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <Panel style={styles.summaryCard}>
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

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tag, { borderColor: `${color}66`, backgroundColor: `${color}18` }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

function SectionTitle({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.sectionTitleBlock}>
      <Text style={styles.sectionTitle} selectable>
        {title}
      </Text>
      <Text style={styles.sectionDetail} selectable>
        {detail}
      </Text>
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
    maxWidth: 860,
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
    fontWeight: '700',
  },
  summaryGrid: {
    gap: Spacing.three,
  },
  summaryGridWide: {
    flexDirection: 'row',
  },
  summaryCard: {
    flex: 1,
    minHeight: 112,
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
  searchBar: {
    gap: Spacing.two,
  },
  searchLabel: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    color: Colors.white,
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.base,
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  clearButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  clearButtonText: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitleBlock: {
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
  chipRow: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  chip: {
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  chipText: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  quickChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  quickChipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
  },
  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  recentChip: {
    backgroundColor: 'rgba(143, 243, 221, 0.12)',
    borderColor: 'rgba(143, 243, 221, 0.24)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  recentChipText: {
    color: '#8ff3dd',
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '800',
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
  detailHeaderCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  detailEyebrow: {
    color: '#8ff3dd',
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
  detailSubtitle: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  confidenceBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    minWidth: 76,
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
  bodyText: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  sectionDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 1,
  },
  tokenWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
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
  actionList: {
    gap: Spacing.two,
  },
  actionRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionDot: {
    borderRadius: 6,
    height: 12,
    marginTop: 4,
    width: 12,
  },
  actionCopy: {
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
  resultsGrid: {
    gap: Spacing.three,
  },
  resultsGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.one,
    minHeight: 112,
    padding: Spacing.three,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  resultMarker: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  resultMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
    flex: 1,
  },
  resultCategory: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  resultTime: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.xs,
  },
  resultTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  resultSubtitle: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  resultFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  emptyTitle: {
    color: Colors.white,
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.base,
    fontWeight: '800',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
  },
  panel: {
    backgroundColor: 'rgba(6, 10, 31, 0.66)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    gap: Spacing.three,
    padding: Spacing.four,
  },
  pressed: {
    opacity: 0.74,
  },
});
