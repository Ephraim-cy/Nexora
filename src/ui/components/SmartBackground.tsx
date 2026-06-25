import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../theme';

// Create an animated version of the LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface SmartBackgroundProps {
  category: keyof typeof Colors.categories;
  children?: React.ReactNode;
}

export function SmartBackground({ category, children }: SmartBackgroundProps) {
  const [currentCategory, setCurrentCategory] = useState(category);
  const [prevCategory, setPrevCategory] = useState<keyof typeof Colors.categories | null>(null);
  
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    if (category !== currentCategory) {
      setPrevCategory(currentCategory);
      setCurrentCategory(category);
      fadeAnim.value = 0;
      fadeAnim.value = withTiming(1, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(setPrevCategory)(null);
        }
      });
    }
  }, [category, currentCategory, fadeAnim]);

  const activeGradient = Colors.categories[currentCategory]?.gradient || Colors.categories.General.gradient;
  const prevGradient = prevCategory
    ? Colors.categories[prevCategory]?.gradient || Colors.categories.General.gradient
    : null;

  // Background overlay stylesheet
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Base Layer: Midnight background color */}
      <View style={[styles.absolute, { backgroundColor: Colors.darkBackground }]} />

      {/* Previous Gradient Layer (underneath) */}
      {prevGradient && (
        <LinearGradient
          colors={prevGradient}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.absolute}
        />
      )}

      {/* Current/Active Gradient Layer (cross-fading in) */}
      <AnimatedLinearGradient
        colors={activeGradient}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={[styles.absolute, overlayStyle]}
      />

      {/* Dark tint sheet to ensure readability of foreground content */}
      <View style={[styles.absolute, styles.tintSheet]} />

      {/* Content wrapper */}
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
    backgroundColor: 'rgba(3, 0, 30, 0.72)', // Midnight overlay to blend gradients and keep text legible
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
