// src/hooks/useAskAgri.ts
import { useMutation } from '@tanstack/react-query';
import { askQuestion } from '../api/agriApi';

export const useAskAgri = () => {
  return useMutation((formData: FormData) => askQuestion(formData));
};
