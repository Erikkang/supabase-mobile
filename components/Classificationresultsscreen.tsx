import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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

interface ClassificationResultsScreenProps {
  imageUri: string;
  results: ModelResult[];
  onAnalyzeAnother: () => void;
}

export function ClassificationResultsScreen({
  imageUri,
  results,
  onAnalyzeAnother,
}: ClassificationResultsScreenProps) {
  const [activeModel, setActiveModel] = useState(0);

  const currentModel = results[activeModel];
  const topPrediction = currentModel.predictions[0];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 60) return '#DC2626';
    if (confidence >= 40) return '#EA580C';
    return '#16A34A';
  };

  const getConfidenceTextColor = (confidence: number) => {
    if (confidence >= 60) return '#991B1B';
    if (confidence >= 40) return '#9A3412';
    return '#166534';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Preview */}
      <View style={styles.imageSection}>
        <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
      </View>

      {/* Analysis Complete Header */}
      <ThemedView style={styles.headerSection}>
        <ThemedText style={styles.successIcon}>✓</ThemedText>
        <ThemedText style={styles.completeText}>Analysis Complete</ThemedText>
        <ThemedText style={styles.topPrediction}>
          Primary Finding: <ThemedText style={styles.predictionName}>{topPrediction.name}</ThemedText>
        </ThemedText>
      </ThemedView>

      {/* Model Selection Tabs — only 2 tabs */}
      <View style={styles.tabsSection}>
        <ThemedText style={styles.tabsLabel}>Model Selection</ThemedText>
        <View style={styles.tabsContainer}>
          {results.map((model, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveModel(index)}
              style={[
                styles.tab,
                activeModel === index && [
                  styles.tabActive,
                  model.modelType === 'Proposed Model' ? styles.tabProposed : null,
                ],
              ]}
            >
              <ThemedText
                style={[styles.tabText, activeModel === index && styles.tabTextActive]}
              >
                {model.modelName}
              </ThemedText>
              <ThemedText
                style={[styles.tabSubtext, activeModel === index && styles.tabSubtextActive]}
              >
                {model.modelType}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    
      {/* Detection Results */}
      <ThemedView style={styles.resultsSection}>
        <ThemedText style={styles.resultsTitle}>Detection Results</ThemedText>

        {currentModel.predictions.map((condition, index) => (
          <View key={index} style={styles.conditionCard}>
            <View style={styles.conditionHeader}>
              <ThemedText style={styles.conditionName}>{condition.name}</ThemedText>
              <ThemedText
                style={[styles.confidence, { color: getConfidenceTextColor(condition.confidence) }]}
              >
                {condition.confidence.toFixed(1)}%
              </ThemedText>
            </View>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(condition.confidence, 100)}%`,
                    backgroundColor: getConfidenceColor(condition.confidence),
                  },
                ]}
              />
            </View>

            <ThemedText style={styles.description}>{condition.description}</ThemedText>

            {condition.confidence >= 30 && (
              <View style={styles.recommendationsSection}>
                <ThemedText style={styles.recommendationsTitle}>Recommendations:</ThemedText>
                {condition.recommendations.map((rec, idx) => (
                  <View key={idx} style={styles.recommendationItem}>
                    <ThemedText style={styles.bullet}>•</ThemedText>
                    <ThemedText style={styles.recommendationText}>{rec}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {currentModel.predictions.every((r) => r.confidence < 50) && (
          <ThemedView style={styles.noHighConfidenceBox}>
            <ThemedText style={styles.noHighConfidenceText}>
              No high-confidence conditions detected. Your skin appears to be in relatively good
              condition. Continue with regular skincare and sun protection.
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      {/* Disclaimer */}
      <ThemedView style={styles.disclaimerSection}>
        <ThemedText style={styles.disclaimerTitle}>⚠️ Important Disclaimer</ThemedText>
        <ThemedText style={styles.disclaimerText}>
          This analysis is for informational purposes only and should not be considered medical
          advice. Always consult with a qualified dermatologist or healthcare provider for proper
          diagnosis and treatment of skin conditions.
        </ThemedText>
      </ThemedView>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.analyzeButton} onPress={onAnalyzeAnother}>
          <ThemedText style={styles.analyzeButtonText}>Analyze Another Image</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageSection: { width: '100%', height: 250, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  headerSection: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16, marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  successIcon: { fontSize: 40, marginBottom: 8 },
  completeText: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  topPrediction: { fontSize: 14 },
  predictionName: { fontWeight: '700', color: '#0F172A' },
  tabsSection: { paddingHorizontal: 16, marginBottom: 20 },
  tabsLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tabsContainer: { flexDirection: 'row', gap: 10 },
  tab: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center' },
  tabActive: { backgroundColor: '#2563EB' },
  tabProposed: { backgroundColor: '#16A34A' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  tabTextActive: { color: '#FFFFFF' },
  tabSubtext: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  tabSubtextActive: { color: '#FFFFFF', opacity: 0.9 },
  resultsSection: { marginHorizontal: 16, marginBottom: 20, padding: 16, borderRadius: 12 },
  resultsTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  conditionCard: { marginBottom: 16, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  conditionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  conditionName: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  confidence: { fontSize: 14, fontWeight: '600' },
  progressBarContainer: { width: '100%', height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 12, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 },
  description: { fontSize: 12, color: '#4B5563', lineHeight: 18, marginBottom: 8 },
  recommendationsSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  recommendationsTitle: { fontSize: 12, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  recommendationItem: { flexDirection: 'row', marginBottom: 6 },
  bullet: { color: '#2563EB', marginRight: 8, fontWeight: '600' },
  recommendationText: { fontSize: 12, color: '#4B5563', flex: 1, lineHeight: 16 },
  noHighConfidenceBox: { padding: 12, backgroundColor: '#DBEAFE', borderRadius: 8, marginTop: 12 },
  noHighConfidenceText: { fontSize: 12, color: '#1E40AF', lineHeight: 16 },
  disclaimerSection: { marginHorizontal: 16, marginBottom: 20, padding: 16, borderRadius: 12, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FCD34D' },
  disclaimerTitle: { fontSize: 13, fontWeight: '600', color: '#92400E', marginBottom: 8 },
  disclaimerText: { fontSize: 12, color: '#78350F', lineHeight: 16 },
  buttonSection: { paddingHorizontal: 16, marginBottom: 20 },
  analyzeButton: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  analyzeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});