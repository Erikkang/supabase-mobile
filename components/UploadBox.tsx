import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { IconSymbol } from './IconSymbol';

export function UploadBox() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const chooseImage = () => {
    Alert.alert(
      'Select Image',
      'Choose from:',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri || null);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Gallery error: ', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri || null);
      }
    });
  };

  return (
    <ThemedView style={styles.uploadBox}>
      <IconSymbol name="cloud-upload" style={styles.uploadIcon} />

      <ThemedText style={styles.uploadText}>
        Drag and drop an image here, or click to select
      </ThemedText>

      <ThemedText style={styles.supportText}>
        Supports: JPG, PNG, WEBP
      </ThemedText>

      <TouchableOpacity style={styles.button} onPress={chooseImage}>
        <ThemedText style={styles.buttonText}>Choose Image</ThemedText>
      </TouchableOpacity>

      {/* Show preview if image selected */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
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
    color: '#FFFFFF',
    fontWeight: '600',
  },

  preview: {
    width: 200,
    height: 200,
    marginTop: 16,
    borderRadius: 12,
  },
});
