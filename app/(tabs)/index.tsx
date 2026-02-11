import { ClassificationResultsScreen } from '@/components/Classificationresultsscreen';
import { HowItWorksCard } from '@/components/HowItWorksCard';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UploadBox } from '@/components/UploadBox';
import { UploadedPreviewCard } from '@/components/UploadedPreviewCard';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface SkinCondition {
  name: string;
  confidence: number;
  description: string;
  recommendations: string[];
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  f1Score: number;
}

interface ModelResult {
  modelName: string;
  modelType: string;
  metrics: ModelMetrics;
  predictions: SkinCondition[];
}

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ModelResult[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE_URL = "http://192.168.254.118:8000";

  const pickImage = (uri: string) => {
    setSelectedImage(uri);
    setErrorMessage(null);
  };

  // ============================================
  // CALL BACKEND API (UPDATED)
  // ============================================
  const callBackendAPI = async (imageUri: string): Promise<ModelResult[]> => {
    const formData = new FormData();

    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'skin-image.jpg',
    } as any);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleConfirm = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      console.log('Sending to backend:', `${API_BASE_URL}/analyze`);

      const allModelResults = await callBackendAPI(selectedImage);

      console.log('Received results:', allModelResults);
      setResults(allModelResults);

    } catch (error: any) {
      console.error('Analysis failed:', error);

      let errorMsg = 'Failed to analyze image. Please try again.';

      if (error.message?.includes('Network')) {
        errorMsg = 'Network error. Make sure:\n1. Backend is running\n2. IP address is correct\n3. Phone is on same WiFi';
      } else if (error.message?.includes('API Error')) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
      alert(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChange = () => {
    setSelectedImage(null);
    setResults(null);
    setErrorMessage(null);
  };

  const handleAnalyzeAnother = () => {
    setSelectedImage(null);
    setResults(null);
    setErrorMessage(null);
  };

  if (isAnalyzing) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#F4F7FF', dark: '#0F172A' }}
        headerImage={<View />}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <ThemedText style={styles.loadingText}>Analyzing skin condition...</ThemedText>
          <ThemedText style={styles.loadingSubtext}>This may take a few seconds</ThemedText>
          <ThemedText style={styles.apiUrl}>({API_BASE_URL})</ThemedText>
        </View>
      </ParallaxScrollView>
    );
  }

  if (results && selectedImage) {
    return (
      <ClassificationResultsScreen
        imageUri={selectedImage}
        results={results}
        onAnalyzeAnother={handleAnalyzeAnother}
      />
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F4F7FF', dark: '#0F172A' }}
      headerImage={<View />}
    >
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

      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.apiStatus}>
          🔌 Backend: {API_BASE_URL}
        </ThemedText>
        <ThemedText style={styles.apiStatusSmall}>
          Make sure backend is running: python app.py
        </ThemedText>
      </ThemedView>

      {errorMessage && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ {errorMessage}</ThemedText>
        </ThemedView>
      )}

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

      <ThemedView style={styles.stepContainer}>
        <HowItWorksCard />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.instructionsTitle}>📋 Setup Instructions:</ThemedText>
        <ThemedText style={styles.instructionText}>
          1. Get your PC IP: Open PowerShell and run:{'\n'}
          <ThemedText style={styles.code}>ipconfig | findstr "IPv4"</ThemedText>
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          2. Replace IP in this file (line ~50):{'\n'}
          <ThemedText style={styles.code}>const API_BASE_URL = "http://YOUR_IP:8000"</ThemedText>
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          3. Make sure backend is running:{'\n'}
          <ThemedText style={styles.code}>python app.py</ThemedText>
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          4. Both phone and PC must be on same WiFi network
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
  apiStatus: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  apiStatusSmall: {
    textAlign: 'center',
    fontSize: 11,
    opacity: 0.6,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.6,
  },
  apiUrl: {
    marginTop: 8,
    fontSize: 10,
    opacity: 0.5,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 8,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 11,
  },
});
