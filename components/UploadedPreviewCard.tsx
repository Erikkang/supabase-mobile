import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export function UploadedPreviewCard({
  imageUri,
  onConfirm,
  onChange,
}: {
  imageUri: string;
  onConfirm: () => void;
  onChange: () => void;
}) {
  return (
    <View style={styles.wrapper}>
      <ThemedView style={styles.container}>
        {/* Image Preview */}
        <View style={styles.imageSection}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        {/* Text Content */}
        <View style={styles.content}>
          <ThemedText style={styles.title}>
            ✓ Ready for Analysis
          </ThemedText>
          
          <ThemedText style={styles.description}>
            Confirm this image clearly shows your skin condition.
          </ThemedText>

          {/* Analyze Button */}
          <TouchableOpacity style={styles.analyzeButton} onPress={onConfirm}>
            <ThemedText style={styles.analyzeButtonText}>
              Analyze Skin
            </ThemedText>
          </TouchableOpacity>

          {/* Change Button */}
          <TouchableOpacity style={styles.changeButton} onPress={onChange}>
            <ThemedText style={styles.changeButtonText}>
              Change Image
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#F8FAFF',
  },
  
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  
  imageSection: {
    position: 'relative',
    height: 200,
    backgroundColor: '#F1F5F9',
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  content: {
    padding: 24,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
  },
  
  analyzeButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  changeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  
  changeButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
});