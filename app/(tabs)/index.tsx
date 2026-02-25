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
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#2563EB" />
            <ThemedText style={styles.loadingText}>Analyzing skin condition...</ThemedText>
            <ThemedText style={styles.loadingSubtext}>This may take a few seconds</ThemedText>
            <View style={styles.apiBadge}>
              <ThemedText style={styles.apiUrl}>📡 {API_BASE_URL}</ThemedText>
            </View>
          </View>
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
      {/* Header Section */}
      <ThemedView style={styles.headerContainer}>
        <View style={styles.headerIcon}>
          <ThemedText style={styles.headerIconText}>🔬</ThemedText>
        </View>
        <ThemedText style={styles.headerTitle}>Skin Condition Analyzer</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Upload a photo to analyze skin conditions.
        </ThemedText>
        <View style={styles.disclaimerBadge}>
          <ThemedText style={styles.disclaimerText}>
            ⚕️ For educational purposes · Consult a dermatologist for medical advice
          </ThemedText>
        </View>
      </ThemedView>

      {/* Connection Status */}
      <ThemedView style={styles.connectionContainer}>
        <View style={styles.connectionHeader}>
          <View style={[styles.connectionDot, { backgroundColor: '#10B981' }]} />
          <ThemedText style={styles.connectionTitle}>Connected to backend</ThemedText>
        </View>
        <ThemedText style={styles.connectionUrl}>{API_BASE_URL}</ThemedText>
        <ThemedText style={styles.connectionHint}>
          Make sure backend is running: python app.py
        </ThemedText>
      </ThemedView>

      {/* Error Message */}
      {errorMessage && (
        <ThemedView style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          </View>
          <View style={styles.errorContent}>
            <ThemedText style={styles.errorTitle}>Connection Error</ThemedText>
            <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
          </View>
        </ThemedView>
      )}

      {/* Upload Section */}
      <ThemedView style={styles.uploadSection}>
        <View style={styles.uploadHeader}>
          <ThemedText style={styles.uploadTitle}>Upload Image</ThemedText>
          <ThemedText style={styles.uploadFormat}>JPG or PNG</ThemedText>
        </View>
        
        <View style={styles.uploadContainer}>
          {selectedImage ? (
            <UploadedPreviewCard
              imageUri={selectedImage}
              onConfirm={handleConfirm}
              onChange={handleChange}
            />
          ) : (
            <UploadBox onPickImage={pickImage} />
          )}
        </View>
      </ThemedView>

      {/* How It Works - Original */}
      <ThemedView style={styles.stepContainer}>
        <HowItWorksCard />
      </ThemedView>

      {/* Setup Instructions */}
      <ThemedView style={styles.instructionsContainer}>
        <View style={styles.instructionsHeader}>
          <ThemedText style={styles.instructionsTitle}>📋 Setup Instructions</ThemedText>
          <ThemedText style={styles.instructionsSubtitle}>For first-time setup</ThemedText>
        </View>

        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>1</ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepLabel}>Get your PC's IP address</ThemedText>
              <View style={styles.codeBlock}>
                <ThemedText style={styles.codeText}>ipconfig | findstr "IPv4"</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>2</ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepLabel}>Update the API URL</ThemedText>
              <View style={styles.codeBlock}>
                <ThemedText style={styles.codeText}>const API_BASE_URL = "http://YOUR_IP:8000"</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>3</ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepLabel}>Start the backend server</ThemedText>
              <View style={styles.codeBlock}>
                <ThemedText style={styles.codeText}>python app.py</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.noteBox}>
            <ThemedText style={styles.noteIcon}>📱</ThemedText>
            <ThemedText style={styles.noteText}>
              Make sure your phone and PC are connected to the same WiFi network
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerIconText: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 12,
    maxWidth: 280,
  },
  disclaimerBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#6B7280',
  },
  connectionContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  connectionUrl: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2563EB',
    marginBottom: 4,
  },
  connectionHint: {
    fontSize: 11,
    color: '#6B7280',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    flexDirection: 'row',
  },
  errorIconContainer: {
    marginRight: 12,
  },
  errorIcon: {
    fontSize: 20,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    lineHeight: 18,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  uploadFormat: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  uploadContainer: {
    paddingHorizontal: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  instructionsContainer: {
    marginBottom: 32,
  },
  instructionsHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  instructionsSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  stepsList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6794f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
    gap: 6,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  codeBlock: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#1F2937',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
  noteIcon: {
    fontSize: 20,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    width: '100%',
    maxWidth: 320,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
  },
  apiBadge: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  apiUrl: {
    fontSize: 11,
    color: '#6B7280',
  },
});