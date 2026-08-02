import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";

import styles from "./StudentLayout.module.css";

const studentLinks = [
  { label: "Profile", path: "/student/profile" },
  { label: "Apply Course", path: "/student/apply-course" },
  { label: "Applications", path: "/student/applications" },
  { label: "Exams", path: "/student/exam-instructions" },
  { label: "Cohort", path: "/student/cohort" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "Assignments", path: "/student/assignments" },
  { label: "Certificates", path: "/student/certificates" },
];

function StudentLayout() {
  return (
    <>
      <Navbar />

      <div className={styles.layout}>
        <Sidebar
          title="Student"
          links={studentLinks}
        />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}

export default StudentLayout;