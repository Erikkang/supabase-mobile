import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from './IconSymbol';

export function UploadBox({ onPickImage }: { onPickImage: (uri: string) => void }) {
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

  const openCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        onPickImage(uri);
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Gallery permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        onPickImage(uri);
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  return (
    <ThemedView style={styles.uploadBox}>
      <IconSymbol name="cloud-upload" style={styles.uploadIcon} />

      <ThemedText style={styles.uploadText}>
        Tap to select an image
      </ThemedText>

      <ThemedText style={styles.supportText}>
        Supports: JPG, PNG, WEBP
      </ThemedText>

      <TouchableOpacity style={styles.button} onPress={chooseImage}>
        <ThemedText style={styles.buttonText}>Choose Image</ThemedText>
      </TouchableOpacity>

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