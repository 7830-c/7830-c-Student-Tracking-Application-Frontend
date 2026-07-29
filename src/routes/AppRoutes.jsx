import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Public */
import Landing from "../pages/landing/Landing";
import Signup from "../pages/signup/Signup";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

/* Student */
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

/* Exams */
import ExamInstructions from "../pages/exams/ExamInstructions";
import Exam from "../pages/exams/Exam";
import ExamResult from "../pages/exams/ExamResult";

/* Admin */
import Dashboard from "../pages/admin/Dashboard";

/* Student Management */
import Students from "../pages/admin/Students";
import StudentDetails from "../pages/admin/StudentDetails";
import AddStudent from "../pages/admin/AddStudent";
import EditStudent from "../pages/admin/EditStudent";

/* Course Management */
import Courses from "../pages/admin/Courses";
import AdminCourseDetails from "../pages/admin/CourseDetails";
import AddCourse from "../pages/admin/AddCourse";
import EditCourse from "../pages/admin/EditCourse";

/* Mentor Management */
import Mentors from "../pages/admin/Mentors";
import AdminMentorDetails from "../pages/admin/MentorDetails";
import AddMentor from "../pages/admin/AddMentor";
import EditMentor from "../pages/admin/EditMentor";

/* Company Management */
import Companies from "../pages/admin/Companies";
import CompanyDetails from "../pages/admin/CompanyDetails";
import AddCompany from "../pages/admin/AddCompany";
import EditCompany from "../pages/admin/EditCompany";

/* Application Management */
import Applications from "../pages/admin/Applications";
import ApplicationDetails from "../pages/admin/ApplicationDetails";
import ApproveApplication from "../pages/admin/ApproveApplication";
import RejectApplication from "../pages/admin/RejectApplication";

/* Exam Management */
import Exams from "../pages/admin/Exams";
import ExamDetails from "../pages/admin/ExamDetails";
import AddExam from "../pages/admin/AddExam";
import EditExam from "../pages/admin/EditExam";

/* Reports */
import Reports from "../pages/admin/Reports";
import StudentReport from "../pages/admin/StudentReport";
import CourseReport from "../pages/admin/CourseReport";
import ExamReport from "../pages/admin/ExamReport";

/* Cohort Management */
import Cohorts from "../pages/admin/Cohorts";
import CohortDetails from "../pages/admin/CohortDetails";
import AddCohort from "../pages/admin/AddCohort";
import EditCohort from "../pages/admin/EditCohort";

/* Attendance Management */
import AttendanceManagement from "../pages/admin/AttendanceManagement";
import AttendanceDetails from "../pages/admin/AttendanceDetails";
import UpdateAttendance from "../pages/admin/UpdateAttendance";
import AttendanceHistoryAdmin from "../pages/admin/AttendanceHistoryAdmin";

/* Assignment Management */
import AssignmentsAdmin from "../pages/admin/AssignmentsAdmin";
import AssignmentAdminDetails from "../pages/admin/AssignmentAdminDetails";
import AddAssignment from "../pages/admin/AddAssignment";
import EditAssignment from "../pages/admin/EditAssignment";

/* Certificate Management */
import CertificatesAdmin from "../pages/admin/CertificatesAdmin";
import CertificateAdminDetails from "../pages/admin/CertificateAdminDetails";
import AddCertificate from "../pages/admin/AddCertificate";
import EditCertificate from "../pages/admin/EditCertificate";

/* Notification Management */
import Notifications from "../pages/admin/Notifications";
import NotificationDetails from "../pages/admin/NotificationDetails";
import AddNotification from "../pages/admin/AddNotification";
import EditNotification from "../pages/admin/EditNotification";

/* Settings */
import Settings from "../pages/admin/Settings";
import ProfileSettings from "../pages/admin/ProfileSettings";
import SecuritySettings from "../pages/admin/SecuritySettings";
import SystemSettings from "../pages/admin/SystemSettings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

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

        {/* Course Management */}
        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/course-details"
          element={<AdminCourseDetails />}
        />

        <Route
          path="/add-course"
          element={<AddCourse />}
        />

        <Route
          path="/edit-course"
          element={<EditCourse />}
        />

        {/* Mentor Management */}
        <Route
          path="/mentors"
          element={<Mentors />}
        />

        <Route
          path="/mentor-details"
          element={<AdminMentorDetails />}
        />

        <Route
          path="/add-mentor"
          element={<AddMentor />}
        />

        <Route
          path="/edit-mentor"
          element={<EditMentor />}
        />

        {/* Company Management */}

        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/company-details"
          element={<CompanyDetails />}
        />

        <Route
          path="/add-company"
          element={<AddCompany />}
        />

        <Route
          path="/edit-company"
          element={<EditCompany />}
        />

        {/* Application Management */}

        <Route
          path="/applications"
          element={<Applications />}
        />

        <Route
          path="/application-details"
          element={<ApplicationDetails />}
        />

        <Route
          path="/approve-application"
          element={<ApproveApplication />}
        />

        <Route
          path="/reject-application"
          element={<RejectApplication />}
        />
        
        {/* Exam Management */}

        <Route
          path="/exams"
          element={<Exams />}
        />

        <Route
          path="/exam-details"
          element={<ExamDetails />}
        />

        <Route
          path="/add-exam"
          element={<AddExam />}
        />

        <Route
          path="/edit-exam"
          element={<EditExam />}
        />

        {/* Reports & Analytics */}

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/student-report"
          element={<StudentReport />}
        />

        <Route
          path="/course-report"
          element={<CourseReport />}
        />

        <Route
          path="/exam-report"
          element={<ExamReport />}
        />

        {/* Cohort Management */}

        <Route
          path="/cohorts"
          element={<Cohorts />}
        />

        <Route
          path="/cohort-details"
          element={<CohortDetails />}
        />

        <Route
          path="/add-cohort"
          element={<AddCohort />}
        />

        <Route
          path="/edit-cohort"
          element={<EditCohort />}
        />

        {/* Attendance Management */}

        <Route
          path="/attendance-management"
          element={<AttendanceManagement />}
        />

        <Route
          path="/attendance-details"
          element={<AttendanceDetails />}
        />

        <Route
          path="/update-attendance"
          element={<UpdateAttendance />}
        />

        <Route
          path="/attendance-history-admin"
          element={<AttendanceHistoryAdmin />}
        />

        {/* Assignment Management */}

        <Route
          path="/assignments-admin"
          element={<AssignmentsAdmin />}
        />

        <Route
          path="/assignment-admin-details"
          element={<AssignmentAdminDetails />}
        />

        <Route
          path="/add-assignment"
          element={<AddAssignment />}
        />

        <Route
          path="/edit-assignment"
          element={<EditAssignment />}
        />

        {/* Certificate Management */}

        <Route
          path="/certificates-admin"
          element={<CertificatesAdmin />}
        />

        <Route
          path="/certificate-admin-details"
          element={<CertificateAdminDetails />}
        />

        <Route
          path="/add-certificate"
          element={<AddCertificate />}
        />

        <Route
          path="/edit-certificate"
          element={<EditCertificate />}
        />

        {/* Notification Management */}

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/notification-details"
          element={<NotificationDetails />}
        />

        <Route
          path="/add-notification"
          element={<AddNotification />}
        />

        <Route
          path="/edit-notification"
          element={<EditNotification />}
        />

        {/* Settings */}

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/profile-settings"
          element={<ProfileSettings />}
        />

        <Route
          path="/security-settings"
          element={<SecuritySettings />}
        />

        <Route
          path="/system-settings"
          element={<SystemSettings />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;