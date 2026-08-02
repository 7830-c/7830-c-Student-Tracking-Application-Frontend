export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    TOKEN: "/api/auth/token/",
    REFRESH: "/api/auth/token/refresh/",
    LINKEDIN_CONNECT: "/api/auth/linkedin/connect/",
    LINKEDIN_CALLBACK: "/api/auth/linkedin/callback/",
    LINKEDIN_DISCONNECT: "/api/auth/linkedin/disconnect/",
  },

  // Users
  USERS: {
    BASE: "/api/users/",
    BY_ID: (id) => `/api/users/${id}/`,
    ME: "/api/users/me/",
    RESET_PASSWORD: "/api/users/reset-password/",
  },

  // Students / Student Profiles
  STUDENTS: {
    BASE: "/api/students/",
    BY_ID: (id) => `/api/students/${id}/`,
  },

  // Courses
  COURSES: {
    BASE: "/api/courses/",
    BY_ID: (id) => `/api/courses/${id}/`,
  },

  // Applications
  APPLICATIONS: {
    BASE: "/api/applications/",
    BY_ID: (id) => `/api/applications/${id}/`,
    ASSIGN_COHORT: (id) => `/api/applications/${id}/assign-cohort/`,
    CHECK_COMPLETION: (id) => `/api/applications/${id}/check-completion/`,
  },

  // Cohorts
  COHORTS: {
    BASE: "/api/cohorts/",
    BY_ID: (id) => `/api/cohorts/${id}/`,
  },

  // Exams & Questions
  EXAMS: {
    BASE: "/api/exams/",
    BY_ID: (id) => `/api/exams/${id}/`,
    SUBMIT: (id) => `/api/exams/${id}/submit/`,
  },
  QUESTIONS: {
    BASE: "/api/questions/",
    BY_ID: (id) => `/api/questions/${id}/`,
  },

  // Assignments & Submissions
  ASSIGNMENTS: {
    BASE: "/api/assignments/",
    BY_ID: (id) => `/api/assignments/${id}/`,
  },
  SUBMISSIONS: {
    BASE: "/api/submissions/",
    BY_ID: (id) => `/api/submissions/${id}/`,
  },

  // Attendance
  ATTENDANCE: {
    BASE: "/api/attendance/",
    BY_ID: (id) => `/api/attendance/${id}/`,
  },

  // Certificates
  CERTIFICATES: {
    BASE: "/api/certificates/",
    BY_ID: (id) => `/api/certificates/${id}/`,
    VERIFY: "/api/certificates/verify/",
  },

  // Companies
  COMPANIES: {
    BASE: "/api/companies/",
    BY_ID: (id) => `/api/companies/${id}/`,
  },
};
