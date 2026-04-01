import api from './axios';

export const createEmployee = (data) => api.post('/employees', data);
export const getAllEmployees = () => api.get('/employees');
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const getEmployeesByDepartment = (deptId) => api.get(`/employees/department/${deptId}`);