import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const courseService = {
  async getCourses(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.BASE, { params });
    return response.data;
  },

  async getCourseById(id) {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.BY_ID(id));
    return response.data;
  },

  async createCourse(courseData) {
    const response = await apiClient.post(API_ENDPOINTS.COURSES.BASE, courseData);
    return response.data;
  },

  async updateCourse(id, courseData) {
    const response = await apiClient.put(API_ENDPOINTS.COURSES.BY_ID(id), courseData);
    return response.data;
  },

  async patchCourse(id, courseData) {
    const response = await apiClient.patch(API_ENDPOINTS.COURSES.BY_ID(id), courseData);
    return response.data;
  },

  async deleteCourse(id) {
    const response = await apiClient.delete(API_ENDPOINTS.COURSES.BY_ID(id));
    return response.data;
  },
};
