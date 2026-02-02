import { HowItWorksCard } from '@/components/HowItWorksCard';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UploadBox } from '@/components/UploadBox';
import { UploadedPreviewCard } from '@/components/UploadedPreviewCard';
import { useState } from 'react';
import { StyleSheet } from 'react-native';




export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Called when an image is picked in UploadBox
  const pickImage = (uri: string) => {
    setSelectedImage(uri);
  };

  // Called when Confirm & Analyze is pressed
  const handleConfirm = () => {
    console.log('Analyzing image:', selectedImage);
    // TODO: add analysis function here
  };

  // Called when Change Image is pressed
  const handleChange = () => {
    setSelectedImage(null);
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

      {/* UPLOAD OR PREVIEW */}
      <ThemedView style={styles.stepContainer}>
        {selectedImage ? (
          <UploadedPreviewCard
            imageUri={selectedImage}
            onConfirm={handleConfirm}
            onChange={handleChange}
          />
        ) : (
          <UploadBox onPickImage={pickImage} />
        )}
      </ThemedView>

      {/* HOW IT WORKS - KEEP AS IS */}
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
});
