import api from './axios';

export const markAttendance = (hoursWorked) =>
    api.post(`/attendance/mark?hoursWorked=${hoursWorked}`);

export const getAttendanceByEmployee = (employeeId) =>
    api.get(`/attendance/employee/${employeeId}`);