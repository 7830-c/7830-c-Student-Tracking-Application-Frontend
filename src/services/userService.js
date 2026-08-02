import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const userService = {
  async getUsers(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params });
    return response.data;
  },

  async getUserById(id) {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },

  async createUser(userData) {
    const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, userData);
    return response.data;
  },

  async updateUser(id, userData) {
    const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), userData);
    return response.data;
  },

  async patchUser(id, userData) {
    const response = await apiClient.patch(API_ENDPOINTS.USERS.BY_ID(id), userData);
    return response.data;
  },

  async deleteUser(id) {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },
};
