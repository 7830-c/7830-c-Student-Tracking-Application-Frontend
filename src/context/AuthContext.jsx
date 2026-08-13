import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import apiClient from "../services/apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import {
  getAccessToken,
  getRefreshToken,
  getUserInfo,
  setUserInfo,
  setAccessToken,
  clearAuthStorage,
  parseJwt,
} from "../utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore user from stored token
  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUserInfo();

    if (token && storedUser) {
      setUser(storedUser);
    } else if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser(decoded);
      }
    }
    setLoading(false);
  }, []);

  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      const updated = { ...prevUser, ...updatedFields };
      setUserInfo(updated);
      return updated;
    });
  };

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
      return response.data;
    } catch (err) {
      console.warn("Could not fetch /api/users/me/:", err.message);
      return null;
    }
  };

  /**
   * Login flow with explicit targetRole override & resilient role resolution
   */
  const login = async (identifier, password, targetRole = null) => {
    setLoading(true);
    const cleanId = (identifier || "").trim().toLowerCase();

    // Determine target role fallback
    let fallbackRole = targetRole;
    if (!fallbackRole) {
      if (cleanId.includes("admin")) fallbackRole = "ADMIN";
      else if (cleanId.includes("mentor") || cleanId.includes("abhishek@mentor.com")) fallbackRole = "MENTOR";
      else if (cleanId.includes("trustee") || cleanId.includes("truste")) fallbackRole = "TRUSTEE";
      else fallbackRole = "STUDENT";
    }

    // ── 1. Attempt Live Backend JWT Login ──────────────────────
    try {
      const data = await authService.login(cleanId, password);

      let userObj;
      if (data?.user) {
        userObj = {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || "",
          firstName: data.user.first_name || "",
          lastName: data.user.last_name || "",
          phone_number: data.user.phone_number || "",
          phoneNumber: data.user.phone_number || "",
          role: data.user.role || fallbackRole,
          is_active: data.user.is_active,
        };
      } else {
        const profile = await fetchUserProfile();
        if (profile) {
          userObj = {
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            firstName: profile.first_name || "",
            lastName: profile.last_name || "",
            phone_number: profile.phone_number || "",
            phoneNumber: profile.phone_number || "",
            role: profile.role || fallbackRole,
            is_active: profile.is_active,
          };
        } else {
          const decoded = parseJwt(data.access) || {};
          userObj = {
            email: decoded.email || cleanId,
            role: decoded.role || fallbackRole,
            user_id: decoded.user_id,
          };
        }
      }

      setUser(userObj);
      setUserInfo(userObj);
      setLoading(false);
      return { ...data, user: userObj };
    } catch (err) {
      if (err.response) {
        setLoading(false);
        throw err;
      }
      console.warn("Backend unreachable, falling back to demo accounts:", err.message);
    }

    // ── 2. Demo / Offline Fallback ──────────────────────────────
    const demoAccounts = {
      "admin@sureproed.com": { role: "ADMIN", first_name: "Admin", last_name: "User" },
      "admin": { role: "ADMIN", first_name: "Admin", last_name: "User", password: "admin123" },
      "mentor@sureproed.com": { role: "MENTOR", first_name: "Demo", last_name: "Mentor" },
      "abhishek@mentor.com": { role: "MENTOR", first_name: "Abhishek", last_name: "Kumar" },
      "mentor": { role: "MENTOR", first_name: "Demo", last_name: "Mentor", password: "mentor123" },
      "student@sureproed.com": { role: "STUDENT", first_name: "Demo", last_name: "Student" },
      "student": { role: "STUDENT", first_name: "Demo", last_name: "Student", password: "student123" },
    };

    const demo = demoAccounts[cleanId];
    if (demo) {
      const requiredPw = demo.password || (cleanId.includes("admin") ? "admin123" : cleanId.includes("mentor") ? "mentor123" : "student123");
      if (password !== requiredPw) {
        setLoading(false);
        throw new Error("Invalid credentials (demo mode)");
      }
      const demoUser = {
        email: cleanId.includes("@") ? cleanId : `${cleanId}@sureproed.com`,
        first_name: demo.first_name,
        last_name: demo.last_name,
        firstName: demo.first_name,
        lastName: demo.last_name,
        role: demo.role,
      };
      setUser(demoUser);
      setUserInfo(demoUser);
      setAccessToken("demo_session_token");
      setLoading(false);
      return { access: "demo_session_token", user: demoUser };
    }

    setLoading(false);
    throw new Error("Backend is not running and no demo account matches this login.");
  };

  const logout = () => {
    clearAuthStorage();
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || "STUDENT",
    isAuthenticated: !!user || !!getAccessToken(),
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
