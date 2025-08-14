// src/api/agriApi.ts
import axios from 'axios';
import { backendBaseURL } from './apiConfig';

const api = axios.create({
  baseURL: backendBaseURL,
  timeout: 10000,
});

export const askQuestion = async (formData: FormData) => {
  try {
    const response = await api.post('/ask', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};

export const askGemini = async (formData: FormData) => {
  try {
    const response = await api.post('/gemini-ask', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};