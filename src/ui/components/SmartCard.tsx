import React from 'react';
import { StyleSheet, Text, View, Pressable, Image, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Colors, Layout, Spacing, Typography } from '../theme';

interface SmartCardProps {
  title: string;
  subtitle?: string;
  category: keyof typeof Colors.categories;
  imageUrl?: string;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SmartCard({ title, subtitle, category, imageUrl, onPress }: SmartCardProps) {
  const systemScheme = useColorScheme();
  const scale = useSharedValue(1);

  // Micro-interaction: Scale down on press
  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const categoryDetails = Colors.categories[category] || Colors.categories.General;
  const isDark = systemScheme === 'dark';

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.cardContainer, animatedStyle]}
    >
      <BlurView
        intensity={isDark ? 45 : 75}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blurWrapper}
      >
        {/* Card Header image if provided */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.fallbackHeader, { backgroundColor: categoryDetails.color + '20' }]}>
            <View style={[styles.iconDot, { backgroundColor: categoryDetails.color }]} />
          </View>
        )}

        {/* Card Content */}
        <View style={styles.detailsContainer}>
          {/* Category Tag Badge */}
          <View style={[styles.categoryBadge, { borderColor: categoryDetails.color + '40' }]}>
            <Text style={[styles.categoryText, { color: categoryDetails.color }]}>
              {category.toUpperCase()}
            </Text>
          </View>

          {/* Title */}
          <Text
            numberOfLines={2}
            style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}
          >
            {title}
          </Text>

          {/* Subtitle */}
          {subtitle && (
            <Text
              numberOfLines={1}
              style={[
                styles.subtitle,
                { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </BlurView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    ...Layout.cardShadow,
    marginVertical: Spacing.two,
  },
  blurWrapper: {
    width: '100%',
  },
  thumbnail: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  fallbackHeader: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  detailsContainer: {
    padding: Spacing.four,
    gap: Spacing.one,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    marginBottom: Spacing.one,
  },
  categoryText: {
    fontFamily: Typography.fonts?.rounded,
    fontSize: Typography.sizes.xs,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: Typography.fonts?.display,
    fontSize: Typography.sizes.base,
    fontWeight: '600',
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: Typography.fonts?.text,
    fontSize: Typography.sizes.sm,
    lineHeight: 16,
  },
});
