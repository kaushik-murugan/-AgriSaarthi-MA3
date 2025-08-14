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
import { ThemeContext } from '../context/ThemeContext';
import { askGemini } from '../api/agriApi';

interface Message {
  from: 'user' | 'bot';
  text: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hello! How can I help you with farming today?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useContext(ThemeContext);

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
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('question', text);

      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('image', blob, 'photo.jpg');
      }

      const result = await askGemini(formData);

      const answer =
        result.answer ||
        "No answer received";

      // Update bot reply
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: 'bot', text: answer };
        return updated;
      });
    } catch (err) {
      console.error("Gemini API error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          from: 'bot',
          text: '⚠ Error getting response from the backend.',
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#121212' : '#F9FAFB' }
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
            {isLoading && msg.text === '...' ? (
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

      {/* Image capture */}
      <ImageCapture
        onImageCaptured={(uri) => {
          sendQuery('', uri);
        }}
      />

      {/* Text input */}
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
