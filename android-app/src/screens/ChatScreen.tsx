import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ImageCapture from '../components/ImageCapture';
import { ThemeContext } from '../context/ThemeContext';
import { askGemini } from '../api/agriApi';
import Voice from '@react-native-voice/voice';
import { useLocalization } from '../context/LanguageContext';

interface Message {
  from: 'user' | 'bot';
  text: string;
}

interface GeminiResult {
  answer?: string;
}

export default function ChatScreen() {
  const { t } = useLocalization();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: t('initial_bot_message') },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useContext(ThemeContext);

  // For text and voice input
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Setup voice recognition listeners on mount/unmount
  useEffect(() => {
    Voice.onSpeechResults = (e: { value?: string[] }) => {
      if (e.value && e.value.length > 0) setInputText(e.value[0]);
    };
    Voice.onSpeechError = (e: unknown) => {
      setIsRecording(false);
      const error = e as { error?: { message?: string } };
      Alert.alert(t('voice_error'), error.error?.message || t('speech_recognition_error'));
    };
    return () => {
      Voice.removeAllListeners();
      // Voice.destroy(); // Optionally call for full cleanup; ignore async
    };
  }, []);

  const startVoice = async () => {
    setIsRecording(true);
    try {
      await Voice.start('en-IN');
    } catch (e: unknown) {
      const error = e as Error;
      Alert.alert(t('voice_error'), error.message || String(e));
      setIsRecording(false);
    }
  };

  const stopVoice = async () => {
    setIsRecording(false);
    try {
      await Voice.stop();
    } catch (e: unknown) {
      const error = e as Error;
      Alert.alert(t('voice_error'), error.message || String(e));
    }
  };

  // Main send handler, used for both text and image
  const sendQuery = async (text: string, imageUri?: string) => {
    if (!text && !imageUri) {
      Alert.alert(t('enter_question_or_image'));
      return;
    }

    if (text) setMessages((prev) => [...prev, { from: 'user', text }]);
    else if (imageUri) {
      setMessages((prev) => [
        ...prev,
        { from: 'user', text: t('image_question_sent') },
      ]);
    }

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

      const result = await askGemini(formData) as GeminiResult;

      const answer = result.answer ?? t('no_answer_received');

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: 'bot', text: answer };
        return updated;
      });
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Gemini API error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          from: 'bot',
          text: t('error_backend_response'),
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
      {/* Chat Messages */}
      <ScrollView
        style={styles.messages}
        contentContainerStyle={{ paddingVertical: 10 }}
        keyboardShouldPersistTaps="always"
      >
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

      {/* Image capture for crop disease/etc */}
      <ImageCapture
        onImageCaptured={(uri) => {
          sendQuery('', uri);
        }}
      />

      {/* Input + Voice Row */}
      <View style={styles.inputRow}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          style={[
            styles.input,
            { backgroundColor: isDark ? '#232323' : '#F3F4F6', color: isDark ? '#fff' : '#111' }
          ]}
          placeholder={t('type_or_speak')}
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={isRecording ? stopVoice : startVoice}
          style={styles.micButton}
          disabled={isLoading}
        >
          <Text style={{ fontSize: 22 }}>{isRecording ? "🛑" : "🎤"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (inputText.trim()) {
              sendQuery(inputText.trim());
              setInputText("");
            }
          }}
          style={styles.sendButton}
          disabled={isLoading || !inputText.trim()}
        >
          <Text style={{ fontSize: 16, color: "#047857" }}>{t('send')}</Text>
        </TouchableOpacity>
      </View>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    borderRadius: 12,
    padding: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  micButton: { marginLeft: 8, padding: 6 },
  sendButton: { marginLeft: 8, padding: 6 },
});