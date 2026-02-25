import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as ImagePicker from 'expo-image-picker';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from './IconSymbol';

export function UploadBox({ onPickImage }: { onPickImage: (uri: string) => void }) {
  const chooseImage = () => {
    Alert.alert(
      'Select Image',
      '',
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
        onPickImage(result.assets[0].uri);
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
        onPickImage(result.assets[0].uri);
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 16,
    color: '#A0A0A0',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 4,
    textAlign: 'center',
  },
  supportText: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});