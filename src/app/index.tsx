import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SmartBackground, SmartCard, GlassCard } from '../ui/components';
import { Colors, Spacing, Typography, Layout } from '../ui/theme';

// Mock database of captures
const MOCK_CAPTURES = [
  {
    id: '1',
    title: 'Neural Network Architectures',
    subtitle: 'Extracted 4 concepts • Whiteboard Scan',
    category: 'Study' as const,
    description: 'Deep Learning lecture slides outlining feedforward and recurrent layers.',
  },
  {
    id: '2',
    title: 'Blue Bottle Coffee',
    subtitle: '$4.75 • Finance Tracker',
    category: 'Finance' as const,
    description: 'Merchant: Blue Bottle Cafe. Decaf Latte. Saved 10:14 AM.',
  },
  {
    id: '3',
    title: 'Rome Flight Ticket - AZ402',
    subtitle: 'Boarding Gate B12 • July 14',
    category: 'Travel' as const,
    description: 'Rome (FCO) to New York (JFK). Alitalia. Seat 12A.',
  },
  {
    id: '4',
    title: 'Project Alpha Wireframes',
    subtitle: 'UI/UX Specs • Shared Workspace',
    category: 'Work' as const,
    description: 'Figma screenshot highlighting dashboard components and layout grid.',
  },
  {
    id: '5',
    title: 'Noise Cancelling Headphones',
    subtitle: '$299 • Amazon Price Alert',
    category: 'Shopping' as const,
    description: 'Sony WH-1000XM4. Silver edition. 10% price drop noticed.',
  },
  {
    id: '6',
    title: 'Weekly Workout Schedule',
    subtitle: '3 Active items • Health & Fitness',
    category: 'Health' as const,
    description: 'Cardio Mon/Wed, Strength Tue/Thu. Hydration goal: 3L.',
  },
  {
    id: '7',
    title: 'Sunset over Lake Como',
    subtitle: 'Favorite • Scenic Photo',
    category: 'Media' as const,
    description: 'Scenic landscape photo from vacation. Perceptual hash calculated.',
  },
  {
    id: '8',
    title: 'Ideas for newsletter post',
    subtitle: 'Draft • Note',
    category: 'Personal' as const,
    description: 'Topics include: offline-first databases, on-device AI efficiency.',
  },
];

type CategoryType = keyof typeof Colors.categories;

export default function HomeScreen() {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === 'dark';
  const [activeCategory, setActiveCategory] = useState<CategoryType>('General');

  // Categories list starting with General
  const categoriesList: CategoryType[] = [
    'General',
    'Study',
    'Finance',
    'Travel',
    'Work',
    'Shopping',
    'Health',
    'Personal',
    'Media',
  ];

  // Filter cards based on selected category. If "General", show all.
  const filteredCaptures = activeCategory === 'General'
    ? MOCK_CAPTURES
    : MOCK_CAPTURES.filter((card) => card.category === activeCategory);

  return (
    <SmartBackground category={activeCategory}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Glassmorphic Header */}
        <View style={styles.headerWrapper}>
          <GlassCard intensity={40} style={styles.headerCard} borderRadius={Layout.borderRadius.md}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.appTitle}>NEXORA</Text>
                <Text style={styles.appSubtitle}>Your second brain. Fully yours.</Text>
              </View>
              <View style={[styles.avatarDot, { backgroundColor: Colors.categories[activeCategory]?.color || Colors.electricViolet }]} />
            </View>
          </GlassCard>
        </View>

        {/* Scrollable Category Selector */}
        <View style={styles.categorySelectorContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorScroll}
          >
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat;
              const catConfig = Colors.categories[cat] || Colors.categories.General;
              const activeColor = catConfig.color;

              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[
                    styles.categoryPill,
                    isActive && {
                      backgroundColor: activeColor + '25',
                      borderColor: activeColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      { color: isActive ? activeColor : 'rgba(255, 255, 255, 0.6)' },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Captures Collection list */}
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {filteredCaptures.length > 0 ? (
            filteredCaptures.map((capture) => (
              <SmartCard
                key={capture.id}
                title={capture.title}
                subtitle={capture.subtitle}
                category={capture.category}
                onPress={() => console.log('Tapped card:', capture.title)}
              />
            ))
          ) : (
            <GlassCard intensity={30} style={styles.emptyCard}>
              <Text style={styles.emptyText}>No memories captured in this category yet.</Text>
            </GlassCard>
          )}
        </ScrollView>
      </SafeAreaView>
    </SmartBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  headerCard: {
    padding: Spacing.four,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.one,
  },
  appTitle: {
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1.5,
  },
  appSubtitle: {
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  avatarDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  categorySelectorContainer: {
    height: 50,
    marginBottom: Spacing.two,
  },
  selectorScroll: {
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  categoryPill: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  categoryPillText: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
  },
  scrollList: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
  },
  emptyCard: {
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.six,
  },
  emptyText: {
    fontFamily: Typography.fonts?.text,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: Typography.sizes.base,
    textAlign: 'center',
  },
});
