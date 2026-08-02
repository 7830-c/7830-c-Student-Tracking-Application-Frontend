import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const PROFILE_STORAGE_KEY_PREFIX = "sure_student_profile_";

const normalizeProfile = (profile = {}) => ({
  firstName: profile.firstName || profile.first_name || "",
  lastName: profile.lastName || profile.last_name || "",
  email: profile.email || "",
  phoneNumber: profile.phoneNumber || profile.phone_number || "",
  dob: profile.dob || "",
  gender: profile.gender || "",
  collegeName: profile.collegeName || profile.college || "",
  university: profile.university || "",
  degree: profile.degree || "",
  branch: profile.branch || profile.specialization || "",
  currentYear: profile.currentYear || "",
  cgpa: profile.cgpa || "",
  graduationYear: profile.graduationYear || profile.graduation_year || "",
  address: profile.address || profile.bio || "",
  city: profile.city || "",
  district: profile.district || "",
  state: profile.state || "",
  pincode: profile.pincode || "",
  technicalSkills: profile.technicalSkills || profile.tagline || "",
});

export const isProfileComplete = (profile = {}) => {
  const normalized = normalizeProfile(profile);

  return Boolean(
    normalized.firstName &&
      normalized.lastName &&
      normalized.email &&
      normalized.phoneNumber &&
      normalized.collegeName &&
      normalized.degree &&
      normalized.branch &&
      normalized.graduationYear
  );
};

export const studentService = {
  // ─── Backend API Methods ──────────────────────────────────────
  async getStudentProfiles(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.STUDENTS.BASE, { params });
    return response.data;
  },

  async getStudentById(id) {
    const response = await apiClient.get(API_ENDPOINTS.STUDENTS.BY_ID(id));
    return response.data;
  },

  async createStudentProfile(data) {
    const response = await apiClient.post(API_ENDPOINTS.STUDENTS.BASE, data);
    return response.data;
  },

  async updateStudentProfile(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.STUDENTS.BY_ID(id), data);
    return response.data;
  },

  async patchStudentProfile(id, data) {
    const response = await apiClient.patch(API_ENDPOINTS.STUDENTS.BY_ID(id), data);
    return response.data;
  },

  async deleteStudentProfile(id) {
    const response = await apiClient.delete(API_ENDPOINTS.STUDENTS.BY_ID(id));
    return response.data;
  },

  // ─── Profile Methods (Backend-First with localStorage Fallback) ──

  /**
   * Register a new student profile.
   * Tries the backend API first; falls back to localStorage if backend is unreachable.
   */
  async registerStudentProfile(signupData) {
    const { firstName, lastName, email, phoneNumber } = signupData;
    const cleanEmail = (email || "").trim().toLowerCase();

    try {
      const userData = {
        email: cleanEmail,
        first_name: firstName ? firstName.trim() : "",
        last_name: lastName ? lastName.trim() : "",
        phone_number: phoneNumber ? phoneNumber.trim() : "",
        password: signupData.password || "Temp@12345",
        role: "STUDENT",
      };
      const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, userData);
      return {
        id: response.data.id,
        firstName: response.data.first_name || "",
        lastName: response.data.last_name || "",
        email: response.data.email,
        phoneNumber: response.data.phone_number || "",
      };
    } catch (err) {
      console.warn("Registration request failed:", err.message || err);
      return {
        firstName: firstName ? firstName.trim() : "",
        lastName: lastName ? lastName.trim() : "",
        email: cleanEmail,
        phoneNumber: phoneNumber ? phoneNumber.trim() : "",
      };
    }
  },

  /**
   * Get a student profile.
   * Tries localStorage first (for speed), then backend API.
   */
  async getProfile(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const key = `${PROFILE_STORAGE_KEY_PREFIX}${cleanEmail}`;

    try {
      const response = await apiClient.get(API_ENDPOINTS.STUDENTS.BASE);
      const students = Array.isArray(response.data) ? response.data : [response.data];
      const profile = students.find((item) => {
        const user = item.user || {};
        return (user.email || "").toLowerCase() === cleanEmail || (item.email || "").toLowerCase() === cleanEmail;
      }) || students[0];

      if (profile) {
        const user = profile.user || {};
        const mapped = normalizeProfile({
          ...profile,
          firstName: profile.first_name || profile.firstName || user.first_name || user.firstName || "",
          lastName: profile.last_name || profile.lastName || user.last_name || user.lastName || "",
          email: profile.email || user.email || cleanEmail,
          phoneNumber: profile.phone_number || profile.phoneNumber || user.phone_number || user.phoneNumber || "",
          collegeName: profile.college || profile.collegeName || "",
          branch: profile.specialization || profile.branch || "",
          graduationYear: profile.graduation_year || profile.graduationYear || "",
          address: profile.bio || profile.address || "",
          technicalSkills: profile.tagline || profile.technicalSkills || "",
        });
        localStorage.setItem(key, JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn("Backend profile fetch failed:", err.message || err);
    }

    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored profile", e);
      }
    }

    return null;
  },

  /**
   * Save/update a student profile.
   * Saves to localStorage and tries to sync to backend API.
   */
  async saveProfile(email, profileData) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const key = `${PROFILE_STORAGE_KEY_PREFIX}${cleanEmail}`;

    const existing = (await this.getProfile(cleanEmail)) || {};
    const updated = {
      ...existing,
      ...profileData,
      email: cleanEmail,
      firstName: profileData.firstName || existing.firstName || "",
      lastName: profileData.lastName || existing.lastName || "",
      phoneNumber: profileData.phoneNumber || existing.phoneNumber || "",
    };

    localStorage.setItem(key, JSON.stringify(updated));

    try {
      const profileResponse = await apiClient.get(API_ENDPOINTS.STUDENTS.BASE);
      const students = Array.isArray(profileResponse.data) ? profileResponse.data : [profileResponse.data];
      const backendProfile = students[0];

      const payload = {
        college: updated.collegeName || "",
        degree: updated.degree || "",
        specialization: updated.branch || "",
        graduation_year: updated.graduationYear ? Number(updated.graduationYear) : null,
        city: updated.city || "",
        state: updated.state || "",
        bio: updated.address || "",
        tagline: updated.technicalSkills || "",
      };

      if (backendProfile?.id) {
        await this.patchStudentProfile(backendProfile.id, payload);
      } else {
        await this.createStudentProfile(payload);
      }

      const meResponse = await apiClient.get(API_ENDPOINTS.USERS.ME);
      const userId = meResponse?.data?.id;
      if (userId) {
        await apiClient.patch(API_ENDPOINTS.USERS.BY_ID(userId), {
          first_name: updated.firstName || "",
          last_name: updated.lastName || "",
          phone_number: updated.phoneNumber || "",
        });
      }
    } catch (err) {
      console.warn("Backend profile save failed:", err.message || err);
      throw err;
    }

    return updated;
  },
};
