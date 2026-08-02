import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const cohortService = {
  async getCohorts(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.COHORTS.BASE, { params });
    return response.data;
  },

  async getCohortById(id) {
    const response = await apiClient.get(API_ENDPOINTS.COHORTS.BY_ID(id));
    return response.data;
  },

  async createCohort(cohortData) {
    const response = await apiClient.post(API_ENDPOINTS.COHORTS.BASE, cohortData);
    return response.data;
  },

  async updateCohort(id, cohortData) {
    const response = await apiClient.put(API_ENDPOINTS.COHORTS.BY_ID(id), cohortData);
    return response.data;
  },

  async patchCohort(id, cohortData) {
    const response = await apiClient.patch(API_ENDPOINTS.COHORTS.BY_ID(id), cohortData);
    return response.data;
  },

  async deleteCohort(id) {
    const response = await apiClient.delete(API_ENDPOINTS.COHORTS.BY_ID(id));
    return response.data;
  },
};
