import axios from 'axios';
import { backendBaseURL } from './apiConfig';

export interface Scheme {
  name: string;
  description: string;
  eligibility: string;
  link: string;
}

// This now simply fetches online data and returns it
export const fetchSchemes = async (): Promise<Scheme[]> => {
  try {
    const { data } = await axios.get(`${backendBaseURL}/schemes`);
    return data as Scheme[];
  } catch (error) {
    console.error('Failed to fetch schemes:', error);
    throw new Error('Unable to load schemes at the moment.');
  }
};
