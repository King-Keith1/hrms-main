import api from './axios';

export const requestLeave = (startDate, endDate, type) =>
    api.post(`/leaves?startDate=${startDate}&endDate=${endDate}&type=${type}`);

export const approveLeave = (id) => api.post(`/leaves/${id}/approve`);
export const getAllLeaves = () => api.get('/leaves');
export const getMyLeaves = () => api.get('/leaves/my');