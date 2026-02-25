import { IconSymbol } from '@/components/IconSymbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export function HowItWorksCard() {
  return (
    <ThemedView style={styles.container}>
      {/* HOW IT WORKS SECTION */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.titleRow}>
          <IconSymbol name="information-circle-outline" size={20} color="#2563EB" />
          <ThemedText type="subtitle" style={styles.titleText}>
            User's Guide
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
        </ThemedView>
      </ThemedView>

      {/* SETUP INSTRUCTIONS SECTION */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.titleRow}>
          <IconSymbol name="terminal-outline" size={20} color="#2563EB" />
          <ThemedText type="subtitle" style={styles.titleText}>
            Setup Guide
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.contentContainer}>
          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.stepIconContainer}>
              <IconSymbol name="code-outline" size={15} color="#2563EB" />
            </ThemedView>
            <ThemedView style={styles.stepTextContainer}>
              <ThemedText style={styles.stepTitle}>Find your PC's IP</ThemedText>
              <ThemedView style={styles.codeBlock}>
                <ThemedText style={styles.codeText}>ipconfig | findstr "IPv4"</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.stepIconContainer}>
              <IconSymbol name="link-outline" size={15} color="#2563EB" />
            </ThemedView>
            <ThemedView style={styles.stepTextContainer}>
              <ThemedText style={styles.stepTitle}>Update API endpoint</ThemedText>
              <ThemedView style={styles.codeBlock}>
                <ThemedText style={styles.codeText}>API_BASE_URL = "http://YOUR_IP:8000"</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.stepContainer}>
            <ThemedView style={styles.stepIconContainer}>
              <IconSymbol name="play-outline" size={15} color="#2563EB" />
            </ThemedView>
            <ThemedView style={styles.stepTextContainer}>
              <ThemedText style={styles.stepTitle}>Start backend server</ThemedText>
              <ThemedView style={styles.codeBlock}>
                <ThemedText style={styles.codeText}>python app.py</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.noteBox}>
            <IconSymbol name="wifi-outline" size={16} color="#2563EB" />
            <ThemedText style={styles.noteText}>
              Connect your phone and PC to the same WiFi network
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* INFO MESSAGES */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.messageContainer}>
          <IconSymbol name="information-circle-outline" size={16} color="#9CA3AF" />
          <ThemedText style={styles.messageText}>
            This tool uses simulated image analysis to identify potential skin conditions. In a production environment, this would connect to a machine learning model trained on dermatological images.
          </ThemedText>
        </ThemedView>

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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  section: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
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
    gap: 6,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  codeBlock: {
    backgroundColor: '#F8F8FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    marginTop: 2,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#2563EB',
    letterSpacing: -0.2,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8F8FA',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    marginTop: 4,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 18,
    fontWeight: '400',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
});