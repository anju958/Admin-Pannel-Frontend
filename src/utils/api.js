import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getRoles = () => API.get('/roles');
export const getRolePermissions = roleId => API.get(`/roles/${roleId}/permissions`);
export const setRolePermissions = (roleId, moduleName, permissions) =>
  API.post(`/roles/${roleId}/permissions`, { moduleName, permissions });
