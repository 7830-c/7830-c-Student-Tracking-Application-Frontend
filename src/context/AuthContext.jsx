import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { studentService } from "../services/studentService";
import {
  getAccessToken,
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

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUserInfo();
    if (token && storedUser) {
      setUser(storedUser);
    } else if (token && !token.includes("session_token")) {
      const decoded = parseJwt(token);
      if (decoded) setUser(decoded);
    } else if (storedUser) {
      setUser(storedUser);
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

  const login = async (identifier, password) => {
    setLoading(true);
    const cleanId = (identifier || "").trim().toLowerCase();

    // 1. Check for registered student account/profile in storage
    const registeredProfile = await studentService.getProfile(cleanId);
    if (registeredProfile) {
      const userObj = {
        email: registeredProfile.email,
        firstName: registeredProfile.firstName || "Student",
        lastName: registeredProfile.lastName || "",
        first_name: registeredProfile.firstName || "Student",
        last_name: registeredProfile.lastName || "",
        phoneNumber: registeredProfile.phoneNumber || "",
        phone_number: registeredProfile.phoneNumber || "",
        role: "STUDENT",
      };
      setUser(userObj);
      setUserInfo(userObj);
      setAccessToken("local_session_token");
      setLoading(false);
      return { access: "local_session_token", user: userObj };
    }

    // 2. Check Demo Accounts for quick testing
    if (
      (cleanId === "student@sureproed.com" || cleanId === "student") &&
      password === "student123"
    ) {
      const demoEmail = "student@sureproed.com";
      let studentProfile = await studentService.getProfile(demoEmail);
      if (!studentProfile) {
        studentProfile = await studentService.registerStudentProfile({
          firstName: "Demo",
          lastName: "Student",
          email: demoEmail,
          phoneNumber: "9876543210",
        });
      }
      const studentUser = {
        email: demoEmail,
        username: "student",
        firstName: studentProfile.firstName || "Demo",
        lastName: studentProfile.lastName || "Student",
        first_name: studentProfile.firstName || "Demo",
        last_name: studentProfile.lastName || "Student",
        phoneNumber: studentProfile.phoneNumber || "9876543210",
        role: "STUDENT",
      };
      setUser(studentUser);
      setUserInfo(studentUser);
      setAccessToken("student_session_token");
      setLoading(false);
      return { access: "student_session_token", user: studentUser };
    }

    if (
      (identifier === "admin@sureproed.com" || identifier === "admin") &&
      password === "admin123"
    ) {
      const adminUser = { email: "admin@sureproed.com", username: "admin", role: "ADMIN" };
      setUser(adminUser);
      setUserInfo(adminUser);
      setAccessToken("admin_session_token");
      setLoading(false);
      return { access: "admin_session_token", user: adminUser };
    }

    if (
      (identifier === "mentor@sureproed.com" || identifier === "mentor") &&
      password === "mentor123"
    ) {
      const mentorUser = { email: "mentor@sureproed.com", username: "mentor", role: "MENTOR" };
      setUser(mentorUser);
      setUserInfo(mentorUser);
      setAccessToken("mentor_session_token");
      setLoading(false);
      return { access: "mentor_session_token", user: mentorUser };
    }

    // 3. Fallback: Allow login for any valid email identifier by auto-creating session & profile if needed
    if (cleanId.includes("@")) {
      const initialProfile = await studentService.registerStudentProfile({
        firstName: "Student",
        lastName: "",
        email: cleanId,
        phoneNumber: "",
      });
      const userObj = {
        email: cleanId,
        firstName: initialProfile.firstName,
        lastName: initialProfile.lastName,
        first_name: initialProfile.firstName,
        last_name: initialProfile.lastName,
        phoneNumber: initialProfile.phoneNumber,
        role: "STUDENT",
      };
      setUser(userObj);
      setUserInfo(userObj);
      setAccessToken("local_session_token");
      setLoading(false);
      return { access: "local_session_token", user: userObj };
    }

    // 4. Attempt Live Backend API Login
    try {
      const data = await authService.login(identifier, password);
      const decoded = parseJwt(data.access) || { email: identifier, role: "STUDENT" };
      setUser(decoded);
      setUserInfo(decoded);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
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

