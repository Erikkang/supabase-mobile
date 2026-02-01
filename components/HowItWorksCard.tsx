import { StyleSheet } from 'react-native';

import { IconSymbol } from '@/components/IconSymbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export function HowItWorksCard() {
  return (
    <ThemedView>
      {/* TITLE WITH ICON */}
      <ThemedView style={styles.titleRow}>
  <IconSymbol
    name="information-circle-outline"
    size={18}
    color="#2563EB"
  />
  <ThemedText type="subtitle">How It Works</ThemedText>
</ThemedView>


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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  text: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: 6,
  },
});
