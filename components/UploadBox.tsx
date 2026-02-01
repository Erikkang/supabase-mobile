import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from './IconSymbol'; // import your fixed component

export function UploadBox() {
  return (
    <ThemedView style={styles.uploadBox}>
      {/* Use Ionicons instead of emoji */}
      <IconSymbol name="cloud-upload" style={styles.uploadIcon} />

      <ThemedText style={styles.uploadText}>
        Drag and drop an image here, or click to select
      </ThemedText>

      <ThemedText style={styles.supportText}>
        Supports: JPG, PNG, WEBP
      </ThemedText>

      <TouchableOpacity style={styles.button}>
        <ThemedText style={styles.buttonText}>
          Choose Image
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },

  uploadIcon: {
    marginBottom: 6,
  },

  uploadText: {
    textAlign: 'center',
  },

  supportText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF', // fixed typo (was "#FFFFF")
    fontWeight: '600',
  },
});
