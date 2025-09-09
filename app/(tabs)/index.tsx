import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    rotation.setValue(0);
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();

    return () => {
      loop.stop();
    };
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ThemedView style={styles.centerContainer}>
      <View style={styles.heroCircle}>
        <Animated.Image
          source={require('../../assets/images/spinner.png')}
          style={[styles.spinner, { transform: [{ rotate: spin }] }]}
          resizeMode="cover"
        />
      </View>
      <ThemedText type="title" style={styles.title}>Okasha Arshad</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>1</ThemedText>
    </ThemedView>
  );
}

const CIRCLE_SIZE = 200;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    marginBottom: 24,
  },
  spinner: {
    width: 150,
    height: 150,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    opacity: 0.8,
  },
});
