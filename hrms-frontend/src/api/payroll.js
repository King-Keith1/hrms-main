import api from './axios';

export const generatePayroll = (employeeId, month) =>
    api.post(`/payroll/generate/${employeeId}?month=${month}`);

export const getAllPayroll = () => api.get('/payroll');
export const getPayrollByEmployee = (employeeId) =>
    api.get(`/payroll/employee/${employeeId}`);