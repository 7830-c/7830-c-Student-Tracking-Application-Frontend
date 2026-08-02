import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const PROFILE_STORAGE_KEY_PREFIX = "sure_student_profile_";
const REGISTERED_ACCOUNTS_KEY = "sure_registered_accounts";

export const studentService = {
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

  /**
   * Modular Student Profile Persistence Methods
   * Structured for seamless backend API integration.
   */
  async registerStudentProfile(signupData) {
    const { firstName, lastName, email, phoneNumber } = signupData;
    const cleanEmail = (email || "").trim().toLowerCase();

    const initialProfile = {
      firstName: firstName ? firstName.trim() : "",
      lastName: lastName ? lastName.trim() : "",
      email: cleanEmail,
      phoneNumber: phoneNumber ? phoneNumber.trim() : "",
      dob: "",
      gender: "",
      collegeName: "",
      university: "",
      degree: "",
      branch: "",
      currentYear: "",
      cgpa: "",
      graduationYear: "",
      address: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      technicalSkills: "",
    };

    if (cleanEmail) {
      // 1. Store initial profile under email key
      const key = `${PROFILE_STORAGE_KEY_PREFIX}${cleanEmail}`;
      localStorage.setItem(key, JSON.stringify(initialProfile));

      // 2. Maintain account registry (without password) for login lookup
      try {
        const existingAccountsStr = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
        const existingAccounts = existingAccountsStr ? JSON.parse(existingAccountsStr) : {};
        existingAccounts[cleanEmail] = {
          email: cleanEmail,
          firstName: initialProfile.firstName,
          lastName: initialProfile.lastName,
          phoneNumber: initialProfile.phoneNumber,
        };
        localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(existingAccounts));
      } catch (e) {
        console.error("Error updating registered accounts registry", e);
      }
    }

    return initialProfile;
  },

  async getProfile(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const key = `${PROFILE_STORAGE_KEY_PREFIX}${cleanEmail}`;
    
    // Check local persistence store first
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored profile", e);
      }
    }

    // Check account registry if specific profile key isn't set yet
    try {
      const existingAccountsStr = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      if (existingAccountsStr) {
        const existingAccounts = JSON.parse(existingAccountsStr);
        if (existingAccounts[cleanEmail]) {
          const acc = existingAccounts[cleanEmail];
          return {
            firstName: acc.firstName || "",
            lastName: acc.lastName || "",
            email: cleanEmail,
            phoneNumber: acc.phoneNumber || "",
            dob: "", gender: "", collegeName: "", university: "",
            degree: "", branch: "", currentYear: "", cgpa: "",
            graduationYear: "", address: "", city: "", district: "",
            state: "", pincode: "", technicalSkills: "",
          };
        }
      }
    } catch (e) {
      console.error("Error fetching account from registry", e);
    }

    return null;
  },

  async saveProfile(email, profileData) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const key = `${PROFILE_STORAGE_KEY_PREFIX}${cleanEmail}`;

    const existing = (await this.getProfile(cleanEmail)) || {};
    const updated = {
      ...existing,
      ...profileData,
      email: cleanEmail,
    };

    // Save to local storage
    localStorage.setItem(key, JSON.stringify(updated));

    // Update account registry basic metadata
    try {
      const existingAccountsStr = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      const existingAccounts = existingAccountsStr ? JSON.parse(existingAccountsStr) : {};
      existingAccounts[cleanEmail] = {
        email: cleanEmail,
        firstName: updated.firstName || "",
        lastName: updated.lastName || "",
        phoneNumber: updated.phoneNumber || "",
      };
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(existingAccounts));
    } catch (e) {
      console.error("Error updating registered accounts registry during saveProfile", e);
    }

    // Backend API hook for future integration
    try {
      if (profileData.id) {
        await this.updateStudentProfile(profileData.id, updated);
      }
    } catch (err) {
      console.warn("Backend API sync pending (using frontend persistence):", err);
    }

    return updated;
  },
};

