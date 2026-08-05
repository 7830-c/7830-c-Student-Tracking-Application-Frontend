import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";

import styles from "./TrusteeLayout.module.css";

function TrusteeLayout() {
  const { user } = useAuth();
  
  // In a real scenario, this would come from the backend profile
  // Defaulting to VOLUNTEER for demo/fallback purposes
  const trusteeType = user?.trusteeType || "VOLUNTEER";

  const volunteerLinks = [
    { label: "Command Center", path: "/trustee/volunteer/dashboard" },
    { label: "System Alerts", path: "/trustee/volunteer/alerts" },
    { label: "Schedule Classes", path: "/trustee/volunteer/schedule" },
    { label: "Attendance & CSV", path: "/trustee/volunteer/attendance" },
    { label: "User Moderation", path: "/trustee/volunteer/users" },
  ];

  const commercialLinks = [
    { label: "Dashboard Overview", path: "/trustee/commercial/dashboard" },
    { label: "Announcements", path: "/trustee/commercial/announcements" },
    { label: "Achievements", path: "/trustee/commercial/achievements" },
    { label: "Commercial Updates", path: "/trustee/commercial/updates" },
  ];

  const activeLinks = trusteeType === "COMMERCIAL" ? commercialLinks : volunteerLinks;
  const layoutTitle = trusteeType === "COMMERCIAL" ? "Commercial Partner" : "Volunteer Ops";

  if (user?.role !== "TRUSTEE") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className={styles.layout}>
        <Sidebar title={layoutTitle} links={activeLinks} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default TrusteeLayout;
