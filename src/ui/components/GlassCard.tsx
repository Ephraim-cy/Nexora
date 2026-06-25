import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Layout } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'extraLight' | 'default';
  borderRadius?: number;
  bordered?: boolean;
}

export function GlassCard({
  children,
  style,
  intensity = 55,
  tint,
  borderRadius = Layout.borderRadius.lg,
  bordered = true,
}: GlassCardProps) {
  const systemScheme = useColorScheme();
  
  // Decide active tint based on user preference or explicit prop
  const activeTint = tint || (systemScheme === 'dark' ? 'dark' : 'light');

  const cardStyle = [
    styles.card,
    { borderRadius },
    bordered && styles.bordered,
    style,
  ];

  return (
    <BlurView
      intensity={intensity}
      tint={activeTint}
      style={cardStyle}
    >
      <View style={styles.content}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    ...Layout.cardShadow,
  },
  bordered: {
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  content: {
    width: '100%',
    height: '100%',
  },
});
