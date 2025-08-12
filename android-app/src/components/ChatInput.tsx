import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Or your icon library

interface ChatInputProps {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your question..."
        value={text}
        onChangeText={setText}
        multiline
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      {/* Voice Button */}
      <TouchableOpacity style={styles.voiceButton} onPress={() => {
        // Integrate your voice input logic here
      }}>
        <Ionicons name="mic" size={24} color="#fff" />
      </TouchableOpacity>
      {/* Send Button */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Ionicons name="send" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
    marginRight: 8,
  },
  voiceButton: {
    backgroundColor: '#047857',
    borderRadius: 20,
    padding: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#047857',
    borderRadius: 20,
    padding: 10,
  },
});

export default ChatInput;
