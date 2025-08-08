// src/api/agriApi.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-backend-url.com',  // Replace with your actual backend URL
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
