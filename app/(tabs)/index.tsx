import { ClassificationResultsScreen } from '@/components/Classificationresultsscreen';
import { HowItWorksCard } from '@/components/HowItWorksCard';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UploadBox } from '@/components/UploadBox';
import { UploadedPreviewCard } from '@/components/UploadedPreviewCard';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

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
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const API_BASE_URL = "http://192.168.254.118:8000";

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pickImage = (uri: string) => {
    setSelectedImage(uri);
    setErrorMessage(null);
  };

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
      const allModelResults = await callBackendAPI(selectedImage);
      setResults(allModelResults);
    } catch (error: any) {
      let errorMsg = 'Failed to analyze image. Please try again.';

      if (error.message?.includes('Network')) {
        errorMsg = 'Network error. Make sure:\n1. Backend is running\n2. IP address is correct\n3. Phone is on same WiFi';
      } else if (error.message?.includes('API Error')) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
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
        headerBackgroundColor={{ light: '#F0F4FF', dark: '#0F172A' }}
        headerImage={<View />}
      >
        <View style={styles.loadingContainer}>
          <Animated.View 
            style={[
              styles.loadingCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.loadingAnimation}>
              <View style={styles.pulseRing} />
              <View style={styles.pulseRing2} />
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
            <ThemedText style={styles.loadingText}>Analyzing skin condition...</ThemedText>
            <ThemedText style={styles.loadingSubtext}>This may take a few seconds</ThemedText>
            <View style={styles.apiBadge}>
              <ThemedText style={styles.apiUrl}>📡 {API_BASE_URL}</ThemedText>
            </View>
          </Animated.View>
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
      headerBackgroundColor={{ light: '#F0F4FF', dark: '#0F172A' }}
      headerImage={<View />}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Header Section with Gradient Effect */}
        <ThemedView style={styles.headerContainer}>
          <View style={styles.headerIconWrapper}>
            <View style={styles.headerIconGlow} />
            <View style={styles.headerIcon}>
              <ThemedText style={styles.headerIconText}>🔬</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.headerTitle}>Skin Condition Analyzer</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Upload a photo to analyze skin conditions instantly
          </ThemedText>
          <View style={styles.disclaimerBadge}>
            <ThemedText style={styles.disclaimerText}>
              ⚕️ For educational purposes · Consult a dermatologist
            </ThemedText>
          </View>
        </ThemedView>

        {/* Connection Status */}
        <View style={styles.connectionContainer}>
          <View style={styles.connectionHeader}>
            <View style={[styles.connectionDot, { backgroundColor: '#10B981' }]} />
            <ThemedText style={styles.connectionTitle}>Backend Connected</ThemedText>
          </View>
          <View style={styles.connectionUrlWrapper}>
            <ThemedText style={styles.connectionUrlLabel}>API Endpoint</ThemedText>
            <ThemedText style={styles.connectionUrl}>{API_BASE_URL}</ThemedText>
          </View>
          <ThemedText style={styles.connectionHint}>
            Make sure backend is running: python app.py
          </ThemedText>
        </View>

        {/* Error Message with Animation */}
        {errorMessage && (
          <Animated.View 
            style={[
              styles.errorContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.errorIconContainer}>
              <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
            </View>
            <View style={styles.errorContent}>
              <ThemedText style={styles.errorTitle}>Connection Error</ThemedText>
              <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            </View>
          </Animated.View>
        )}

        {/* Upload Section with Modern Design */}
        <ThemedView style={styles.uploadSection}>
          <View style={styles.uploadHeader}>
            <View style={styles.uploadTitleWrapper}>
              <ThemedText style={styles.uploadTitle}>Upload Image</ThemedText>
              <View style={styles.uploadTitleAccent} />
                      </View>
            
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

        {/* How It Works with Enhanced Styling */}
        <ThemedView style={styles.stepContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>How It Works</ThemedText>
            <View style={styles.sectionAccent} />
          </View>
          <HowItWorksCard />
        </ThemedView>
      </Animated.View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerIconWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  headerIconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB20',
    top: -8,
    left: -8,
    transform: [{ scale: 1.2 }],
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2563EB30',
  },
  headerIconText: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 16,
    maxWidth: 300,
    lineHeight: 22,
  },
  disclaimerBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  connectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  connectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  connectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  connectionUrlWrapper: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  connectionUrlLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  connectionUrl: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    fontFamily: 'monospace',
  },
  connectionHint: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 18,
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    flexDirection: 'row',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  errorIconContainer: {
    marginRight: 14,
    justifyContent: 'center',
  },
  errorIcon: {
    fontSize: 24,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 20,
  },
  uploadSection: {
    marginBottom: 32,
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  uploadTitleWrapper: {
    position: 'relative',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  uploadTitleAccent: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    width: 30,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
 
  uploadFormat: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  uploadContainer: {
    paddingHorizontal: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 12,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  sectionAccent: {
    width: 30,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 120,
    paddingHorizontal: 20,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
    width: '100%',
    maxWidth: 340,
  },
  loadingAnimation: {
    position: 'relative',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB20',
    top: -12,
    left: -12,
    transform: [{ scale: 1.2 }],
  },
  pulseRing2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB10',
    top: -12,
    left: -12,
    transform: [{ scale: 1.5 }],
  },
  loadingText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  apiBadge: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  apiUrl: {
    fontSize: 12,
    color: '#475569',
    fontFamily: 'monospace',
  },
});