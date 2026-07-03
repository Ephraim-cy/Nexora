import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '../theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface SmartBackgroundProps {
  category: keyof typeof Colors.categories;
  children?: React.ReactNode;
}

export function SmartBackground({ category, children }: SmartBackgroundProps) {
  const hasMounted = useRef(false);
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    fadeAnim.value = 0;
    fadeAnim.value = withTiming(1, { duration: 600 });
  }, [category, fadeAnim]);

  const activeGradient = Colors.categories[category]?.gradient || Colors.categories.General.gradient;

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.absolute, { backgroundColor: Colors.darkBackground }]} />

      <AnimatedLinearGradient
        colors={activeGradient}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={[styles.absolute, overlayStyle]}
      />

      <LinearGradient
        colors={['rgba(52, 213, 255, 0.28)', 'rgba(241, 91, 181, 0.08)', 'rgba(4, 7, 22, 0)']}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={[styles.absolute, styles.auroraWash]}
      />

      <View style={[styles.absolute, styles.tintSheet]} />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  absolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  tintSheet: {
    backgroundColor: 'rgba(4, 7, 22, 0.78)',
  },
  auroraWash: {
    opacity: 0.78,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
