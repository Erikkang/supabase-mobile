import { IconSymbol } from '@/components/IconSymbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export function HowItWorksCard() {
  return (
    <ThemedView style={styles.container}>
      {/* TITLE WITH ICON */}
      <ThemedView style={styles.titleRow}>
        <IconSymbol
          name="information-circle-outline"
          size={20}
          color="#2563EB"
        />
        <ThemedText type="subtitle" style={styles.titleText}>
          How It Works
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.stepContainer}>
          <ThemedView style={styles.stepIconContainer}>
            <IconSymbol name="camera-outline" size={16} color="#2563EB" />
          </ThemedView>
          <ThemedView style={styles.stepTextContainer}>
            <ThemedText style={styles.stepTitle}>1. Upload a Photo</ThemedText>
            <ThemedText style={styles.stepDescription}>
              Take or upload a clear, well-lit photo of the affected skin area
            </ThemedText>
          </ThemedView>
        </ThemedView>

       <ThemedView style={styles.stepContainer}>
  <ThemedView style={styles.stepIconContainer}>
    <IconSymbol name="document-text-outline" size={16} color="#2563EB" />
  </ThemedView>
  <ThemedView style={styles.stepTextContainer}>
    <ThemedText style={styles.stepTitle}>2. Get Results</ThemedText>
    <ThemedText style={styles.stepDescription}>
      Receive detailed insights and recommendations for next steps
    </ThemedText>
  </ThemedView>
</ThemedView>

        <ThemedView style={styles.divider} />

        {/* Simulation Notice */}
        <ThemedView style={styles.messageContainer}>
          <IconSymbol name="information-circle-outline" size={16} color="#9CA3AF" />
          <ThemedText style={styles.messageText}>
            This tool uses simulated image analysis to identify potential skin conditions. In a production environment, this would connect to a machine learning model trained on dermatological images.
          </ThemedText>
        </ThemedView>

        {/* Tips */}
        <ThemedView style={styles.messageContainer}>
          <IconSymbol name="bulb-outline" size={16} color="#9CA3AF" />
          <ThemedText style={styles.messageText}>
            For best results, upload a well-lit, clear photo of the affected area. Avoid filters or heavy makeup that might affect the analysis.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  contentContainer: {
    gap: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextContainer: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  stepDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
});