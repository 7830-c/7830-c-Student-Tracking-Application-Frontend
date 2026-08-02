import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const certificateService = {
  async getCertificates(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.CERTIFICATES.BASE, { params });
    return response.data;
  },

  async getCertificateById(id) {
    const response = await apiClient.get(API_ENDPOINTS.CERTIFICATES.BY_ID(id));
    return response.data;
  },

  async createCertificate(data) {
    const response = await apiClient.post(API_ENDPOINTS.CERTIFICATES.BASE, data);
    return response.data;
  },

  async updateCertificate(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.CERTIFICATES.BY_ID(id), data);
    return response.data;
  },

  async patchCertificate(id, data) {
    const response = await apiClient.patch(API_ENDPOINTS.CERTIFICATES.BY_ID(id), data);
    return response.data;
  },

  async deleteCertificate(id) {
    const response = await apiClient.delete(API_ENDPOINTS.CERTIFICATES.BY_ID(id));
    return response.data;
  },

  async verifyCertificate(code) {
    const response = await apiClient.get(API_ENDPOINTS.CERTIFICATES.VERIFY, {
      params: { code },
    });
    return response.data;
  },
};
