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

  // Called when an image is picked in UploadBox
  const pickImage = (uri: string) => {
    setSelectedImage(uri);
  };

  // Called when Confirm & Analyze is pressed
  const handleConfirm = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      console.log('Analyzing image:', selectedImage);

      // ============================================
      // INTEGRATE YOUR ML MODEL HERE
      // ============================================
      
      // Step 1: Convert image URI to tensor/blob
      // This depends on which ML framework you're using:
      // - TensorFlow.js: Use tf.browser.fromPixels()
      // - ONNX Runtime: Convert to appropriate format
      // - Your own framework: Follow its input requirements

      // const imageBlob = await uriToBlob(selectedImage);
      
      // Step 2: Run your trained model on the image
      // Example for TensorFlow.js:
      // const predictions = await model.predict(imageTensor);
      // OR
      // const predictions = await callYourModelAPI(imageBlob);

      // Step 3: Format the results to match ModelResult structure
      const allModelResults = generateMockResults();
      
      // Step 4: Store results in state
      setResults(allModelResults);

    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Called when Change Image is pressed
  const handleChange = () => {
    setSelectedImage(null);
    setResults(null);
  };

  // Called when Analyze Another Image is pressed
  const handleAnalyzeAnother = () => {
    setSelectedImage(null);
    setResults(null);
  };

  // ============================================
  // HELPER: Convert image URI to Blob (if needed)
  // ============================================
  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  // ============================================
  // TEMPORARY: Mock results generator (for testing)
  // Replace this with actual model predictions
  // ============================================
  const generateMockResults = (): ModelResult[] => {
    return [
      {
        modelName: 'MobileNetV2',
        modelType: 'Baseline 1',
        metrics: {
          accuracy: Math.random() * 8 + 82,
          precision: Math.random() * 10 + 80,
          f1Score: Math.random() * 8 + 81,
        },
        predictions: generateMockSkinConditions(0.8),
      },
      {
        modelName: 'DenseNet-121',
        modelType: 'Baseline 2',
        metrics: {
          accuracy: Math.random() * 8 + 86,
          precision: Math.random() * 10 + 84,
          f1Score: Math.random() * 8 + 85,
        },
        predictions: generateMockSkinConditions(0.85),
      },
      {
        modelName: 'Hybrid Model',
        modelType: 'Proposed Model',
        metrics: {
          accuracy: Math.random() * 6 + 92,
          precision: Math.random() * 6 + 91,
          f1Score: Math.random() * 6 + 91,
        },
        predictions: generateMockSkinConditions(0.95),
      },
    ];
  };

  const generateMockSkinConditions = (performanceMultiplier: number): SkinCondition[] => {
    return [
      {
        name: 'Acne',
        confidence: (Math.random() * 35 + 15) * performanceMultiplier,
        description:
          'Inflammatory skin condition characterized by comedones, papules, pustules, or cysts.',
        recommendations: [
          'Use non-comedogenic products',
          'Consider salicylic acid or benzoyl peroxide treatments',
          'Consult a dermatologist for persistent or severe acne',
        ],
      },
      {
        name: 'Rosacea',
        confidence: (Math.random() * 30 + 10) * performanceMultiplier,
        description:
          'Chronic inflammatory condition causing facial redness, visible blood vessels, and sometimes pustules.',
        recommendations: [
          'Avoid triggers like spicy foods, alcohol, and extreme temperatures',
          'Use gentle, fragrance-free products',
          'Consider prescription treatments from a dermatologist',
        ],
      },
      {
        name: 'Eczema',
        confidence: (Math.random() * 30 + 8) * performanceMultiplier,
        description: 'Atopic dermatitis causing itchy, inflamed, and sometimes scaly patches of skin.',
        recommendations: [
          'Keep skin well-moisturized with thick emollients',
          'Avoid harsh soaps and known allergens',
          'Use prescribed topical corticosteroids if recommended by a doctor',
        ],
      },
      {
        name: 'Keratosis',
        confidence: (Math.random() * 25 + 5) * performanceMultiplier,
        description: 'Rough, scaly patches caused by buildup of keratin, often from sun damage.',
        recommendations: [
          'Use daily broad-spectrum sunscreen (SPF 30+)',
          'Consider retinoid creams or chemical exfoliants',
          'See a dermatologist for evaluation and possible removal',
        ],
      },
      {
        name: 'Carcinoma',
        confidence: (Math.random() * 20 + 3) * performanceMultiplier,
        description: 'Abnormal growth that may indicate skin cancer. Requires immediate medical evaluation.',
        recommendations: [
          'URGENT: Schedule an appointment with a dermatologist immediately',
          'Do not delay seeking professional medical evaluation',
          'Avoid sun exposure and always use sunscreen',
        ],
      },
      {
        name: 'Milia',
        confidence: (Math.random() * 25 + 5) * performanceMultiplier,
        description: 'Small, white keratin-filled cysts that appear as tiny bumps on the skin.',
        recommendations: [
          'Avoid picking or squeezing the bumps',
          'Use gentle exfoliants with AHA or BHA',
          'Consider professional extraction by a dermatologist',
        ],
      },
    ];
  };

  // ============================================
  // CONDITIONAL RENDERING BASED ON STATE
  // ============================================

  // 1. Analyzing state
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
        </View>
      </ParallaxScrollView>
    );
  }

  // 2. Results state
  if (results && selectedImage) {
    return (
      <ClassificationResultsScreen
        imageUri={selectedImage}
        results={results}
        onAnalyzeAnother={handleAnalyzeAnother}
      />
    );
  }

  // 3. Upload/Preview state (DEFAULT)
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F4F7FF', dark: '#0F172A' }}
      headerImage={<View />}
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
});