import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";

import styles from "./AdminLayout.module.css";

const adminLinks = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Students", path: "/admin/students" },
  { label: "Mentors", path: "/admin/mentors" },
  { label: "Companies", path: "/admin/companies" },
  { label: "Courses", path: "/admin/courses" },
  { label: "Applications", path: "/admin/applications" },
  { label: "Exams", path: "/admin/exams" },
  { label: "Cohorts", path: "/admin/cohorts" },
  { label: "Schedule Class", path: "/admin/schedule" },
  { label: "Attendance", path: "/admin/attendance" },
  { label: "Assignments", path: "/admin/assignments" },
  { label: "Certificates", path: "/admin/certificates" },
  { label: "Notifications", path: "/admin/notifications" },
  { label: "Reports", path: "/admin/reports" },
  { label: "Settings", path: "/admin/settings" },
];

function AdminLayout() {
  return (
    <>
      <Navbar />

      <div className={styles.layout}>
        <Sidebar
          title="Admin"
          links={adminLinks}
        />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}

export default AdminLayout;