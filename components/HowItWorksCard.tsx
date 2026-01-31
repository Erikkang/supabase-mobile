import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export function HowItWorksCard() {
  return (
    <ThemedView>
      <ThemedText type="subtitle">ℹ️ How It Works</ThemedText>

      <ThemedText style={styles.text}>
        This tool uses simulated image analysis to identify potential skin
        conditions. In a production environment, this would connect to a
        machine learning model trained on dermatological images.
      </ThemedText>

      <ThemedText style={styles.text}>
        For best results, upload a well-lit, clear photo of the affected
        area. Avoid filters or heavy makeup that might affect the analysis.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: 6,
  },
});
