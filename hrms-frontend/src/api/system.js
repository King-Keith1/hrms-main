import api from './axios';

export const advanceDay = () => api.post('/system/next-day');
export const getCurrentDate = () => api.get('/system/current-date');