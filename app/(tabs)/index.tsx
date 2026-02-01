import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';


import { supabase } from '../../supabase';

import { HowItWorksCard } from '@/components/HowItWorksCard';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UploadBox } from '@/components/UploadBox';

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

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission to access gallery is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
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

      {/* SUBTITLE */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.subtitle}>
          Upload a facial image to analyze skin conditions
        </ThemedText>
        <ThemedText style={styles.disclaimer}>
          This is a demo tool for educational purposes only. Consult a
          dermatologist for medical advice.
        </ThemedText>
      </ThemedView>

      {/* UPLOAD */}
      <ThemedView style={styles.stepContainer}>
        <UploadBox onPickImage={pickImage} />
      </ThemedView>

      {/* IMAGE PREVIEW */}
      {selectedImage && (
        <ThemedView style={styles.stepContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.previewImage}
            contentFit="cover"
          />
        </ThemedView>
      )}

      {/* HOW IT WORKS */}
      <ThemedView style={styles.stepContainer}>
        <HowItWorksCard />
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

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
});
