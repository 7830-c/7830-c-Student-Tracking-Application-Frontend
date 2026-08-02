import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";

import styles from "./MentorLayout.module.css";

const mentorLinks = [
  { label: "Dashboard", path: "/mentor/dashboard" },
  { label: "My Cohorts", path: "/mentor/cohorts" },
  { label: "Class Schedule", path: "/mentor/class-schedule" },
  { label: "Meeting Links", path: "/mentor/meeting-links" },
  { label: "My Students", path: "/mentor/students" },
  { label: "Attendance", path: "/mentor/attendance" },
  { label: "Assignments", path: "/mentor/assignments" },
  { label: "Profile", path: "/mentor/profile" },
  { label: "Settings", path: "/mentor/settings" },
];

function MentorLayout() {
  return (
    <>
      <Navbar />
      <div className={styles.layout}>
        <Sidebar
          title="Mentor"
          links={mentorLinks}
        />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}

export default MentorLayout;