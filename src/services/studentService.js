import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const PROFILE_STORAGE_KEY_PREFIX = "sure_student_profile_";

const normalizeProfile = (profile = {}) => ({
  firstName: profile.firstName || profile.first_name || (profile.user?.first_name) || "",
  lastName: profile.lastName || profile.last_name || (profile.user?.last_name) || "",
  email: profile.email || (profile.user?.email) || "",
  phoneNumber: profile.phoneNumber || profile.phone_number || (profile.user?.phone_number) || "",
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
  isExistingStudent: profile.isExistingStudent || (profile.is_existing_student ? "yes" : "no"),
  domain: profile.domain || "",
  courseBatch: profile.courseBatch || profile.course_batch || "",
});

export const isProfileComplete = (profile = {}) => {
  if (!profile) return false;
  const normalized = normalizeProfile(profile);

  // Consider profile complete if email exists, name exists, and at least college or phone or degree is filled
  const hasIdentity = Boolean(normalized.email || normalized.firstName);
  const hasDetails = Boolean(
    normalized.collegeName ||
      normalized.phoneNumber ||
      normalized.degree ||
      normalized.branch ||
      profile.id
  );

  return Boolean(hasIdentity && hasDetails);
};

export const studentService = {
  isProfileComplete,

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

  async getProfile(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const key = `${PROFILE_STORAGE_KEY_PREFIX}${cleanEmail}`;

    try {
      const response = await apiClient.get(API_ENDPOINTS.STUDENTS.BASE);
      const resData = response.data;
      const students = Array.isArray(resData) ? resData : (resData?.results || [resData]);
      const profile = students.find((item) => {
        const user = item.user || {};
        return (user.email || "").toLowerCase() === cleanEmail || (item.email || "").toLowerCase() === cleanEmail;
      }) || students[0];

      if (profile && profile.id) {
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
          isExistingStudent: profile.is_existing_student ? "yes" : profile.isExistingStudent || "no",
          domain: profile.domain || "",
          courseBatch: profile.course_batch || profile.courseBatch || "",
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

    const storageCopy = { ...updated, offerLetter: null };
    localStorage.setItem(key, JSON.stringify(storageCopy));

    try {
      const profileResponse = await apiClient.get(API_ENDPOINTS.STUDENTS.BASE);
      const resData = profileResponse.data;
      const students = Array.isArray(resData) ? resData : (resData?.results || [resData]);
      const backendProfile = students.find((p) => p && p.id) || (students[0]?.id ? students[0] : null);

      const formData = new FormData();
      formData.append("college", updated.collegeName || "");
      formData.append("degree", updated.degree || "");
      formData.append("specialization", updated.branch || "");
      if (updated.graduationYear && !isNaN(Number(updated.graduationYear))) {
        formData.append("graduation_year", Number(updated.graduationYear));
      }
      formData.append("city", updated.city || "");
      formData.append("state", updated.state || "");
      formData.append("bio", updated.address || "");
      formData.append("tagline", updated.technicalSkills || "");

      formData.append("firstName", updated.firstName || "");
      formData.append("first_name", updated.firstName || "");
      formData.append("lastName", updated.lastName || "");
      formData.append("last_name", updated.lastName || "");
      formData.append("phoneNumber", updated.phoneNumber || "");
      formData.append("phone_number", updated.phoneNumber || "");

      formData.append("is_existing_student", updated.isExistingStudent === "yes");
      formData.append("domain", updated.domain || "");
      formData.append("course_batch", updated.courseBatch || "");

      if (updated.status) {
        formData.append("status", updated.status);
      }

      if (profileData.offerLetter instanceof File) {
        formData.append("uploaded_offer_letter", profileData.offerLetter);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (backendProfile?.id) {
        await apiClient.patch(API_ENDPOINTS.STUDENTS.BY_ID(backendProfile.id), formData, config);
      } else {
        await apiClient.post(API_ENDPOINTS.STUDENTS.BASE, formData, config);
      }

      try {
        const meResponse = await apiClient.get(API_ENDPOINTS.USERS.ME);
        const userId = meResponse?.data?.id;
        if (userId) {
          await apiClient.patch(API_ENDPOINTS.USERS.BY_ID(userId), {
            first_name: updated.firstName || "",
            last_name: updated.lastName || "",
            phone_number: updated.phoneNumber || "",
          });
        }
      } catch (e) {
        console.warn("Optional User me endpoint update warning:", e);
      }
    } catch (err) {
      console.error("Backend profile save failed details:", err.response?.data || err.message || err);
      throw err;
    }

    return updated;
  },
};
