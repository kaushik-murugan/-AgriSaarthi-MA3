import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalization } from '../context/LanguageContext';

interface AnswerCardProps {
  answer: string;
  confidence?: number;
  explanation?: string;
  sources?: string[];
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer, confidence, explanation, sources }) => {
  const { t } = useLocalization();
  return (
    <View style={styles.card}>
      <ScrollView>
        <Text style={styles.answer}>{answer}</Text>
        {confidence !== undefined && <Text style={styles.confidence}>{t('confidence')}: {(confidence * 100).toFixed(1)}%</Text>}
        {explanation && <Text style={styles.explanation}>{t('explanation')}: {explanation}</Text>}
        {sources && sources.length > 0 && (
          <View>
            <Text style={styles.sourcesHeader}>{t('sources')}:</Text>
            {sources.map((src, i) => (
              <Text key={i} style={styles.sourceItem}>- {src}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, margin: 12, backgroundColor: '#eef6fd', borderRadius: 8 },
  answer: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  confidence: { fontSize: 14, fontStyle: 'italic', marginBottom: 8 },
  explanation: { fontSize: 14, marginBottom: 8 },
  sourcesHeader: { fontWeight: '700' },
  sourceItem: { fontSize: 12, marginLeft: 12 },
});

export default AnswerCard;