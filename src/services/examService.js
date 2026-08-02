import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const examService = {
  // Exams
  async getExams(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.EXAMS.BASE, { params });
    return response.data;
  },

  async getExamById(id) {
    const response = await apiClient.get(API_ENDPOINTS.EXAMS.BY_ID(id));
    return response.data;
  },

  async createExam(examData) {
    const response = await apiClient.post(API_ENDPOINTS.EXAMS.BASE, examData);
    return response.data;
  },

  async updateExam(id, examData) {
    const response = await apiClient.put(API_ENDPOINTS.EXAMS.BY_ID(id), examData);
    return response.data;
  },

  async patchExam(id, examData) {
    const response = await apiClient.patch(API_ENDPOINTS.EXAMS.BY_ID(id), examData);
    return response.data;
  },

  async deleteExam(id) {
    const response = await apiClient.delete(API_ENDPOINTS.EXAMS.BY_ID(id));
    return response.data;
  },

  async submitExam(id, answers) {
    const response = await apiClient.post(API_ENDPOINTS.EXAMS.SUBMIT(id), answers);
    return response.data;
  },

  // Questions
  async getQuestions(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.QUESTIONS.BASE, { params });
    return response.data;
  },

  async getQuestionById(id) {
    const response = await apiClient.get(API_ENDPOINTS.QUESTIONS.BY_ID(id));
    return response.data;
  },

  async createQuestion(questionData) {
    const response = await apiClient.post(API_ENDPOINTS.QUESTIONS.BASE, questionData);
    return response.data;
  },

  async updateQuestion(id, questionData) {
    const response = await apiClient.put(API_ENDPOINTS.QUESTIONS.BY_ID(id), questionData);
    return response.data;
  },

  async patchQuestion(id, questionData) {
    const response = await apiClient.patch(API_ENDPOINTS.QUESTIONS.BY_ID(id), questionData);
    return response.data;
  },

  async deleteQuestion(id) {
    const response = await apiClient.delete(API_ENDPOINTS.QUESTIONS.BY_ID(id));
    return response.data;
  },
};
