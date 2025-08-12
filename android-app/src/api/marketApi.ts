// src/api/marketApi.ts
import axios from 'axios';

export interface CropPrice {
  crop: string;
  price: number;
  market: string;
  date: string;
  unit: string;
}

const backendApi = axios.create({
  baseURL: 'http://172.16.11.236:3000', // Replace with your deployed backend URL
  timeout: 10000,
});

export const fetchMarketPrices = async (): Promise<CropPrice[]> => {
  try {
    const response = await backendApi.get('/market-prices');
    return response.data as CropPrice[];
  } catch (error) {
    console.error('Failed to fetch market prices:', error);
    throw new Error('Unable to load market prices at the moment.');
  }
};
