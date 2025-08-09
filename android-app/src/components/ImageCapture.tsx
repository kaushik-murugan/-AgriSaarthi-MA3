import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImageCaptureProps {
  onImageCaptured: (uri: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCaptured }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission required');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      base64: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      onImageCaptured(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Capture Crop Image" onPress={takePhoto} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  image: { width: 200, height: 200, marginTop: 10, borderRadius: 8 },
});

export default ImageCapture;
