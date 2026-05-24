import { ClassificationResultsScreen } from '@/components/Classificationresultsscreen';
import { HowItWorksCard } from '@/components/HowItWorksCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UploadBox } from '@/components/UploadBox';
import { UploadedPreviewCard } from '@/components/UploadedPreviewCard';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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

// Skin conditions data with descriptions 
const SKIN_CONDITIONS = [
  {
    id: 'acne',
    name: 'Acne',
    icon: '🔴',
    color: '#FF6B6B',
    bgColor: '#FFE5E5',
    description: 'A common skin condition where hair follicles become clogged with oil and dead skin cells, causing pimples, blackheads, and whiteheads. Often appears on face, forehead, chest, and back.',
    detection: 'Detected by analyzing patterns of inflamed spots, comedones, and skin texture variations.',
  },
  {
    id: 'rosacea',
    name: 'Rosacea',
    icon: '🩸',
    color: '#FF6B6B',
    bgColor: '#faedfeac',
    description: 'A chronic skin condition causing redness, visible blood vessels, and small, red, pus-filled bumps on the face. Often triggered by various factors like sun exposure and stress.',
    detection: 'Identified through facial redness patterns, visible blood vessels, and skin texture analysis.',
  },
  {
    id: 'milia',
    name: 'Milia',
    icon: '🧂',
    color: '#3B82F6', 
    bgColor: '#EFF6FF', 
    description: 'Small, white bumps that appear on the skin when keratin becomes trapped beneath the surface. Common around eyes, cheeks, and nose.',
    detection: 'Recognized by characteristic small, white, pearl-like bumps beneath the skin surface.',
  },
  {
    id: 'keratosis',
    name: 'Keratosis',
    icon: '☀️',
    color: '#F39C12',
    bgColor: '#FEF5E7',
    description: 'A growth of keratin on the skin, often appearing as rough, scaly patches. Can include actinic keratosis (from sun damage) or seborrheic keratosis (wart-like growths).',
    detection: 'Detected through analysis of skin texture, scale patterns, and lesion characteristics.',
  },
  {
    id: 'eczema',
    name: 'Eczema',
    icon: '🩹',
    color: '#27AE60',
    bgColor: '#E8F5E9',
    description: 'A condition where skin becomes inflamed, red, itchy, and cracked. Often related to genetics, environment, and immune system responses.',
    detection: 'Identified by analyzing skin inflammation patterns, moisture levels, and characteristic rash distribution.',
  },
  {
    id: 'carcinoma',
    name: 'Carcinoma',
    icon: '⚠️',
    color: '#E74C3C',
    bgColor: '#FDEDEC',
    description: 'A type of skin cancer that develops in the skin cells. Basal cell carcinoma and squamous cell carcinoma are the most common types. Early detection is crucial.',
    detection: 'Analyzed for irregular borders, asymmetry, color variation, and size changes in skin lesions.',
  },
];

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ModelResult[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);

  const [selectedCondition, setSelectedCondition] = useState<typeof SKIN_CONDITIONS[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const infoHeightAnim = useRef(new Animated.Value(1)).current;

  const API_BASE_URL = "https://kitmac03-facial-backend.hf.space";

  useEffect(() => {
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

  const toggleInfo = () => {
    setIsInfoExpanded(!isInfoExpanded);
    Animated.timing(infoHeightAnim, {
      toValue: isInfoExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

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
      // ✅ FIXED: updated to match new backend error messages
      let errorMsg = 'Unable to analyze this image. Please upload a clear, close-up photo of the affected skin area on the face in good lighting.';

      if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMsg = 'Error. Check your network and try again.';
     
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

  // ✅ FIXED: updated to match new backend error messages
  const errorTitle = errorMessage?.includes('Unable to detect') || errorMessage?.includes('not a skin')
    ? 'Invalid Image'
    : 'Connection Error';

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
            <ActivityIndicator size="large" color="#2563EB" style={styles.loadingSpinner} />
            <ThemedText style={styles.loadingText}>Analyzing skin condition...</ThemedText>
            <ThemedText style={styles.loadingSubtext}>This may take a few seconds</ThemedText>
          </Animated.View>
        </View>
      </SafeAreaView>
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
    <>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
            {/* Header Section */}
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

            {/* Error Message */}
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
                  <ThemedText style={styles.errorTitle}>{errorTitle}</ThemedText>
                  <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
                </View>
              </Animated.View>
            )}

            {/* Upload Section */}
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

            {/* Information Section */}
            <ThemedView style={styles.infoSection}>
              <TouchableOpacity 
                onPress={toggleInfo}
                style={styles.infoHeader}
                activeOpacity={0.7}
              >
                <View style={styles.infoTitleWrapper}>
                  <ThemedText style={styles.infoTitle}>Conditions</ThemedText>
                  <View style={styles.infoTitleAccent} />
                </View>
                <View style={styles.infoToggleContainer}>
                  <ThemedText style={styles.infoToggle}>
                    {isInfoExpanded ? '−' : '+'}
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <Animated.View style={[
                styles.infoContent,
                {
                  maxHeight: infoHeightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 500]
                  }),
                  opacity: infoHeightAnim,
                }
              ]}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.conditionsScroll}
                  contentContainerStyle={styles.conditionsContainer}
                >
                  {SKIN_CONDITIONS.map((condition) => (
                    <TouchableOpacity
                      key={condition.id}
                      style={[styles.conditionCard, { backgroundColor: condition.bgColor }]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedCondition(condition);
                        setModalVisible(true);
                      }}
                    >
                      <View style={[styles.conditionIconContainer, { backgroundColor: condition.color + '20' }]}>
                        <ThemedText style={styles.conditionIcon}>{condition.icon}</ThemedText>
                      </View>
                      <ThemedText style={[styles.conditionName, { color: condition.color }]}>
                        {condition.name}
                      </ThemedText>
                      <ThemedText style={styles.conditionDescription} numberOfLines={3}>
                        {condition.description}
                      </ThemedText>
                      <View style={styles.detectionBadge}>
                        <ThemedText style={styles.detectionText} numberOfLines={2}>
                          🔍 {condition.detection}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            </ThemedView>

            {/* How It Works */}
            <ThemedView style={styles.stepContainer}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>How It Works</ThemedText>
                <View style={styles.sectionAccent} />
              </View>
              <HowItWorksCard />
            </ThemedView>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedCondition(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            
            {/* Header with icon and close button */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <ThemedText style={styles.modalIcon}>{selectedCondition?.icon || '🔬'}</ThemedText>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  setSelectedCondition(null);
                }}
                style={styles.modalCloseButton}
              >
                <ThemedText style={styles.modalCloseText}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Condition Name */}
            <ThemedText style={[styles.modalConditionName, { color: selectedCondition?.color || '#000' }]}>
              {selectedCondition?.name || 'Skin Condition'}
            </ThemedText>

            {/* Scrollable Content */}
            <ScrollView style={styles.modalScrollView}>
              {/* Description */}
              <View style={styles.modalSection}>
                <ThemedText style={styles.modalSectionTitle}>Description</ThemedText>
                <View style={styles.modalTextContainer}>
                  <ThemedText style={styles.modalDescription}>
                    {selectedCondition?.description || 'No description available.'}
                  </ThemedText>
                </View>
              </View>

              {/* Detection Method */}
              <View style={styles.modalSection}>
                <ThemedText style={styles.modalSectionTitle}>Detection Method</ThemedText>
                <View style={styles.modalTextContainer}>
                  <ThemedText style={styles.modalDetectionText}>
                    🔍 {selectedCondition?.detection || 'No detection information available.'}
                  </ThemedText>
                </View>
              </View>

              {/* Disclaimer */}
              <View style={styles.modalFooter}>
                <ThemedText style={styles.modalDisclaimer}>
                  This information is for educational purposes only. Always consult with a dermatologist for proper diagnosis.
                </ThemedText>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20, 
    paddingHorizontal: 20,
    marginBottom: 4, 
  },
  headerIconWrapper: {
    position: 'relative',
    marginBottom: 20, 
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 4, 
    color: '#1F2937',
    letterSpacing: -0.5,
    lineHeight: 34, 
  },
  headerSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 12, 
    maxWidth: 300,
    lineHeight: 20, 
  },
  disclaimerBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 6, 
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
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
    marginBottom: 24,
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
  infoSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  infoTitleWrapper: {
    position: 'relative',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  infoTitleAccent: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    width: 30,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  infoToggleContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoToggle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563EB',
  },
  infoContent: {
    overflow: 'hidden',
  },
  conditionsScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  conditionsContainer: {
    paddingRight: 20,
    gap: 12,
  },
  conditionCard: {
    width: 280,
    padding: 16,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  conditionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  conditionIcon: {
    fontSize: 24,
  },
  conditionName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  conditionDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
    height: 54,
  },
  detectionBadge: {
    backgroundColor: '#FFFFFF80',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 50,
  },
  detectionText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
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
    alignSelf: 'center',
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 24,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalConditionName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalTextContainer: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 12,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  modalDetectionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  modalFooter: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalDisclaimer: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});