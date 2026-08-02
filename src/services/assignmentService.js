import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const assignmentService = {
  // Assignments
  async getAssignments(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BASE, { params });
    return response.data;
  },

  async getAssignmentById(id) {
    const response = await apiClient.get(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id));
    return response.data;
  },

  async createAssignment(data) {
    const response = await apiClient.post(API_ENDPOINTS.ASSIGNMENTS.BASE, data);
    return response.data;
  },

  async updateAssignment(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id), data);
    return response.data;
  },

  async patchAssignment(id, data) {
    const response = await apiClient.patch(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id), data);
    return response.data;
  },

  async deleteAssignment(id) {
    const response = await apiClient.delete(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id));
    return response.data;
  },

  // Submissions
  async getSubmissions(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.SUBMISSIONS.BASE, { params });
    return response.data;
  },

  async getSubmissionById(id) {
    const response = await apiClient.get(API_ENDPOINTS.SUBMISSIONS.BY_ID(id));
    return response.data;
  },

  async createSubmission(data) {
    const response = await apiClient.post(API_ENDPOINTS.SUBMISSIONS.BASE, data);
    return response.data;
  },

  async updateSubmission(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.SUBMISSIONS.BY_ID(id), data);
    return response.data;
  },

  async patchSubmission(id, data) {
    const response = await apiClient.patch(API_ENDPOINTS.SUBMISSIONS.BY_ID(id), data);
    return response.data;
  },

  async deleteSubmission(id) {
    const response = await apiClient.delete(API_ENDPOINTS.SUBMISSIONS.BY_ID(id));
    return response.data;
  },
};
