import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import { courseService } from "../../services/courseService";
import apiClient from "../../services/apiClient";
import styles from "./ApplyCourse.module.css";

function ApplyCourse() {
  const location = useLocation();
  const { user } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [courses, setCourses] = useState([]);
  const [appliedCourseIds, setAppliedCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [profileData, coursesData, appsData] = await Promise.all([
          user?.email ? studentService.getProfile(user.email) : Promise.resolve(null),
          courseService.getCourses(),
          apiClient.get("/api/applications/").catch(() => null),
        ]);

        // Check Profile Completion
        const isComplete = profileData ? studentService.isProfileComplete(profileData) : false;
        setProfileCompleted(isComplete);

        // Process Courses List
        const rawCourses = Array.isArray(coursesData) ? coursesData : coursesData?.results || coursesData?.data || [];
        setCourses(rawCourses);

        // Collect Applied Course IDs from both Backend API and Local Storage
        const appliedSet = new Set(JSON.parse(localStorage.getItem("sure_applied_course_ids") || "[]"));

        const apps = Array.isArray(appsData?.data) ? appsData.data : (appsData?.data?.results || []);
        apps.forEach((a) => {
          const cId = a.course?.id || (typeof a.course === "string" ? a.course : a.course_id);
          if (cId) appliedSet.add(cId);
        });

        // Also check local applications records
        const localApps = JSON.parse(localStorage.getItem("sure_student_applications") || "[]");
        localApps.forEach((la) => {
          if (la.course_id) appliedSet.add(la.course_id);
        });

        setAppliedCourseIds(appliedSet);
      } catch (err) {
        console.error("Failed to load apply-course data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, location.state?.profileCompleted]);

  return (
    <div className={styles.coursePage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Available Internship Courses</h1>
          <p>
            Browse the available internship courses. Complete your profile to apply for your desired track.
          </p>
        </div>

        {/* 🚨 PROFILE INCOMPLETE WARNING BANNER 🚨 */}
        {!loading && !profileCompleted && (
          <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fcd34d", padding: "1rem 1.5rem", borderRadius: "12px", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#92400e", fontWeight: "bold", fontSize: "14px" }}>
              ⚠️ Your student profile is incomplete. Please complete your profile details first to unlock course applications.
            </span>
            <Link to="/student/profile" style={{ padding: "8px 18px", backgroundColor: "#d97706", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
              Complete Profile Now
            </Link>
          </div>
        )}

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading courses from the database...</p>
        ) : (
          <div className={styles.courseGrid}>
            {courses.map((course) => {
              const hasApplied = appliedCourseIds.has(course.id);

              return (
                <div key={course.id} className={styles.courseCard}>
                  <span
                    className={styles.badge}
                    style={{
                      backgroundColor: hasApplied ? "#059669" : "#2563eb",
                      color: "#ffffff",
                    }}
                  >
                    {hasApplied ? "Applied Track" : "Published"}
                  </span>
                  <h2>{course.name}</h2>
                  <p>{course.description}</p>

                  <div className={styles.info}>
                    <div>
                      <strong>Course Code</strong>
                      <span>{course.code}</span>
                    </div>
                    <div>
                      <strong>Domain</strong>
                      <span>{course.domain}</span>
                    </div>
                    <div>
                      <strong>Duration</strong>
                      <span>{course.duration_weeks ? `${course.duration_weeks} Weeks` : "24 Weeks"}</span>
                    </div>
                    <div>
                      <strong>Difficulty</strong>
                      <span>{course.difficulty}</span>
                    </div>
                  </div>

                  <div className={styles.buttons}>
                    {hasApplied ? (
                      <Link
                        to="/student/applications"
                        className={styles.detailsBtn}
                        style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", textAlign: "center" }}
                      >
                        ✓ Already Applied (View Status)
                      </Link>
                    ) : profileCompleted ? (
                      <Link to={`/student/course/${course.id}`} className={styles.detailsBtn}>
                        View Details & Apply
                      </Link>
                    ) : (
                      <Link to="/student/profile" className={styles.detailsBtn} style={{ backgroundColor: "#d97706", color: "#ffffff", border: "none" }}>
                        Complete Profile First
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplyCourse;