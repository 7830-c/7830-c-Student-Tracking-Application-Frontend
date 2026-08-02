import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const companyService = {
  async getCompanies(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.COMPANIES.BASE, { params });
    return response.data;
  },

  async getCompanyById(id) {
    const response = await apiClient.get(API_ENDPOINTS.COMPANIES.BY_ID(id));
    return response.data;
  },

  async createCompany(data) {
    const response = await apiClient.post(API_ENDPOINTS.COMPANIES.BASE, data);
    return response.data;
  },

  async updateCompany(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.COMPANIES.BY_ID(id), data);
    return response.data;
  },

  async patchCompany(id, data) {
    const response = await apiClient.patch(API_ENDPOINTS.COMPANIES.BY_ID(id), data);
    return response.data;
  },

  async deleteCompany(id) {
    const response = await apiClient.delete(API_ENDPOINTS.COMPANIES.BY_ID(id));
    return response.data;
  },
};
