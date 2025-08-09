import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';

interface ChatInputProps {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        setText(event.value[0]);
      }
      setIsListening(false);
    };
    Voice.onSpeechError = () => {
      setIsListening(false);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    setIsListening(true);
    try {
      await Voice.start('en-US'); // Or 'hi-IN' for Hindi
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        placeholder="Ask your question..."
        onChangeText={setText}
        style={styles.input}
        multiline
      />
      <Button title={isListening ? "Listening..." : "🎤"} onPress={startListening} disabled={isListening} />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  input: { flex: 1, marginRight: 8, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
});

export default ChatInput;
