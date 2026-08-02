import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const attendanceService = {
  async getAttendanceRecords(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.BASE, { params });
    return response.data;
  },

  async getAttendanceById(id) {
    const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.BY_ID(id));
    return response.data;
  },

  async createAttendanceRecord(data) {
    const response = await apiClient.post(API_ENDPOINTS.ATTENDANCE.BASE, data);
    return response.data;
  },

  async updateAttendanceRecord(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.ATTENDANCE.BY_ID(id), data);
    return response.data;
  },

  async patchAttendanceRecord(id, data) {
    const response = await apiClient.patch(API_ENDPOINTS.ATTENDANCE.BY_ID(id), data);
    return response.data;
  },

  async deleteAttendanceRecord(id) {
    const response = await apiClient.delete(API_ENDPOINTS.ATTENDANCE.BY_ID(id));
    return response.data;
  },
};
