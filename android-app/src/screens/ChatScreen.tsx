import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ChatInput from '../components/ChatInput';
import ImageCapture from '../components/ImageCapture';
import { useAskAgri } from '../hooks/useAskAgri';
import { ThemeContext } from '../context/ThemeContext'; // import ThemeContext

interface Message {
  from: 'user' | 'bot';
  text: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hello! How can I help you today?' },
  ]);

  const mutation = useAskAgri();
  const { isDark } = useContext(ThemeContext); // get dark mode value

  const sendQuery = async (text: string, imageUri?: string) => {
    if (!text && !imageUri) {
      Alert.alert('Please enter a question or capture an image.');
      return;
    }

    // Add user message
    if (text) setMessages((prev) => [...prev, { from: 'user', text }]);
    else if (imageUri)
      setMessages((prev) => [
        ...prev,
        { from: 'user', text: '[📷 Image question sent]' },
      ]);

    // Loading bubble
    setMessages((prev) => [...prev, { from: 'bot', text: '...' }]);

    // Prepare FormData
    const formData = new FormData();
    if (text) formData.append('question', text);
    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);
    }

    try {
      const data = await mutation.mutateAsync(formData);
      const answer = (data as any).answer || 'No answer received';
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: 'bot', text: answer };
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          from: 'bot',
          text: '⚠ Error getting response from backend.',
        };
        return updated;
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#121212' : '#F9FAFB' } // background in dark/light
      ]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* Chat messages */}
      <ScrollView style={styles.messages} contentContainerStyle={{ paddingVertical: 10 }}>
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.bubble,
              msg.from === 'user'
                ? { backgroundColor: '#047857', alignSelf: 'flex-end' }
                : {
                    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                    alignSelf: 'flex-start',
                    borderColor: isDark ? '#333' : '#E5E7EB',
                    borderWidth: 1,
                  }
            ]}
          >
            {mutation.isPending && msg.text === '...' ? (
              <ActivityIndicator color="#047857" />
            ) : (
              <Text
                style={[
                  styles.bubbleText,
                  msg.from === 'user'
                    ? { color: '#FFFFFF' }
                    : { color: isDark ? '#FFFFFF' : '#111827' }
                ]}
              >
                {msg.text}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Image capture feature */}
      <ImageCapture
        onImageCaptured={(uri) => {
          sendQuery('', uri);
        }}
      />

      {/* Text + Voice input */}
      <ChatInput
        onSend={(text) => {
          sendQuery(text);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messages: { flex: 1, paddingHorizontal: 12 },
  bubble: {
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
  },
  bubbleText: { fontSize: 14 },
});
