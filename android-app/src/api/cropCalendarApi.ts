import axios from 'axios';
import { backendBaseURL } from './apiConfig';

export interface CropCalendarEntry {
  crop: string;
  month: string;
  activity: string;
}

export const fetchCropCalendar = async (): Promise<CropCalendarEntry[]> => {
  try {
    const { data } = await axios.get(`${backendBaseURL}/crop-calendar`);
    return data as CropCalendarEntry[];
  } catch (error) {
    console.error('Failed to fetch crop calendar:', error);
    throw new Error('Unable to load crop calendar at the moment.');
  }
};
