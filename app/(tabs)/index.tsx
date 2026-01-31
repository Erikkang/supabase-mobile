import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { supabase } from '../../supabase';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


export default function HomeScreen() {
  useEffect(() => {
    testSupabase();
  }, []);

  const testSupabase = async () => {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.log('❌ Supabase error:', error.message);
    } else {
      console.log('✅ Supabase connected! Data:', data);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F4F7FF', dark: '#0F172A' }}
    >
      {/* TITLE */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Skin Condition Analyzer</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.subtitle}>
          Upload a facial image to analyze skin conditions
        </ThemedText>
        <ThemedText style={styles.disclaimer}>
          This is a demo tool for educational purposes only. Consult a
          dermatologist for medical advice.
        </ThemedText>
      </ThemedView>

      {/* UPLOAD AREA */}
      <ThemedView style={styles.stepContainer}>
        <ThemedView style={styles.uploadBox}>
          <ThemedText style={styles.uploadIcon}>⬆️</ThemedText>
          <ThemedText style={styles.uploadText}>
            Drag and drop an image here, or click to select
          </ThemedText>
          <ThemedText style={styles.supportText}>
            Supports: JPG, PNG, WEBP
          </ThemedText>

          <TouchableOpacity style={styles.button}>
            <ThemedText style={styles.buttonText}>
              Choose Image
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* HOW IT WORKS */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">ℹ️ How It Works</ThemedText>
        <ThemedText style={styles.infoText}>
          This tool uses simulated image analysis to identify potential skin
          conditions. In a production environment, this would connect to a
          machine learning model trained on dermatological images.
        </ThemedText>
        <ThemedText style={styles.infoText}>
          For best results, upload a well-lit, clear photo of the affected
          area. Avoid filters or heavy makeup that might affect the analysis.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  stepContainer: {
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 16,
  },

  subtitle: {
    textAlign: 'center',
  },

  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
  },

  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },

  uploadIcon: {
    fontSize: 28,
  },

  uploadText: {
    textAlign: 'center',
  },

  supportText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  infoText: {
    fontSize: 13,
    opacity: 0.8,
  },
});
