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
    <ThemedView style={styles.container}>
      {/* IMAGE */}
      <Image source={{ uri: imageUri }} style={styles.image} />

      {/* CONTENT */}
      <View style={styles.right}>
        <ThemedText style={styles.title}>
          Ready to Analyze
        </ThemedText>

        <ThemedText style={styles.desc}>
          Please confirm that the image is clear and shows the skin condition you
          want to analyze.
        </ThemedText>

        <TouchableOpacity style={styles.primary} onPress={onConfirm}>
          <ThemedText style={styles.primaryText}>
            Confirm & Analyze
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary} onPress={onChange}>
          <ThemedText style={styles.secondaryText}>
            Change Image
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
  },

   image: {
    width: 110,      // 🔼 slightly bigger
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },


  right: {
    flex: 1,
    gap: 8,
  },

   title: {
    fontSize: 14,    // 🔽 smaller than subtitle
    fontWeight: '600',
    lineHeight: 18,
    color: '#000',
    alignItems: 'center',
  },

  desc: {
    fontSize: 12,
    color: '#4B5563', // better contrast
    lineHeight: 16,
  },

 
  primary: {
    backgroundColor: '#2563EB',
    paddingVertical: 6,     // 🔽 smaller
    borderRadius: 8,        // 🔽 less round
    alignItems: 'center',
    marginTop: 4,
  },

  primaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,           // 🔽 smaller text
  },

  secondary: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,     // 🔽 smaller
    borderRadius: 8,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#111827',
    fontSize: 12,           // 🔽 smaller
  },
});
