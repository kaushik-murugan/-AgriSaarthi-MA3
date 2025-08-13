// src/api/loanApi.ts
import axios from 'axios';
import { backendBaseURL } from './apiConfig';

export const applyForLoan = async (formData: FormData) => {
  const res = await axios.post(`${backendBaseURL}/api/loan/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getLoanStatus = async (loanId: string, userId: string) => {
  const res = await axios.get(`${backendBaseURL}/api/loan/status/${loanId}`, {
    params: { userId }
  });
  return res.data;
};

export const getRepaymentAlerts = async (userId: string) => {
  const res = await axios.get(`${backendBaseURL}/api/loan/repayment-alerts`, {
    params: { userId }
  });
  return res.data;
};
