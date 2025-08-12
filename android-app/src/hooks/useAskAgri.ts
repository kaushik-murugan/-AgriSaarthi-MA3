import { useMutation } from '@tanstack/react-query';
import { askQuestion } from '../api/agriApi';

export const useAskAgri = () => {
  return useMutation({
    mutationFn: (formData: FormData) => askQuestion(formData),
  });
};
