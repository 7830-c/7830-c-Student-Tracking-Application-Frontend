import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/landing/Landing";
import Signup from "../pages/signup/Signup";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Profile from "../pages/student/Profile";
import ApplyCourse from "../pages/student/ApplyCourse";
import CourseDetails from "../pages/student/CourseDetails";
import ApplicationSuccess from "../pages/student/ApplicationSuccess";
import MyApplications from "../pages/student/MyApplications";
import ApplicationStatus from "../pages/student/ApplicationStatus";

import MyCohort from "../pages/student/MyCohort";
import ClassSchedule from "../pages/student/ClassSchedule";
import MentorDetails from "../pages/student/MentorDetails";

import Attendance from "../pages/student/Attendance";
import AttendanceHistory from "../pages/student/AttendanceHistory";

import AssignmentList from "../pages/student/AssignmentList";
import AssignmentDetails from "../pages/student/AssignmentDetails";
import AssignmentSubmission from "../pages/student/AssignmentSubmission";
import AssignmentFeedback from "../pages/student/AssignmentFeedback";

import CertificateList from "../pages/student/CertificateList";
import CertificateView from "../pages/student/CertificateView";
import CertificateVerify from "../pages/student/CertificateVerify";

import ExamInstructions from "../pages/exams/ExamInstructions";
import Exam from "../pages/exams/Exam";
import ExamResult from "../pages/exams/ExamResult";

/* Admin */
import Students from "../pages/admin/Students";
import StudentDetails from "../pages/admin/StudentDetails";
import AddStudent from "../pages/admin/AddStudent";
import EditStudent from "../pages/admin/EditStudent";
import Dashboard from "../pages/admin/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Student */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/apply-course" element={<ApplyCourse />} />
        <Route path="/course/:id" element={<CourseDetails />} />

        <Route
          path="/application-success"
          element={<ApplicationSuccess />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />

        <Route
          path="/application-status"
          element={<ApplicationStatus />}
        />

        {/* Exams */}
        <Route
          path="/exam-instructions"
          element={<ExamInstructions />}
        />

        <Route
          path="/exam"
          element={<Exam />}
        />

        <Route
          path="/exam-result"
          element={<ExamResult />}
        />

        {/* Cohorts */}
        <Route
          path="/my-cohort"
          element={<MyCohort />}
        />

        <Route
          path="/class-schedule"
          element={<ClassSchedule />}
        />

        <Route
          path="/mentor"
          element={<MentorDetails />}
        />

        {/* Attendance */}
        <Route
          path="/attendance"
          element={<Attendance />}
        />

        <Route
          path="/attendance-history"
          element={<AttendanceHistory />}
        />

        {/* Assignments */}
        <Route
          path="/assignments"
          element={<AssignmentList />}
        />

        <Route
          path="/assignment-details"
          element={<AssignmentDetails />}
        />

        <Route
          path="/assignment-submission"
          element={<AssignmentSubmission />}
        />

        <Route
          path="/assignment-feedback"
          element={<AssignmentFeedback />}
        />

        {/* Certificates */}
        <Route
          path="/certificates"
          element={<CertificateList />}
        />

        <Route
          path="/certificate-view"
          element={<CertificateView />}
        />

        <Route
          path="/certificate-verify"
          element={<CertificateVerify />}
        />

        {/* ================= ADMIN ================= */}

        {/* Student Management */}
        <Route
          path="/students"
          element={<Students />}
        />

        <Route
          path="/student-details"
          element={<StudentDetails />}
        />

        <Route
          path="/add-student"
          element={<AddStudent />}
        />

        <Route
          path="/edit-student"
          element={<EditStudent />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;