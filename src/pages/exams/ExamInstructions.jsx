import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./ExamInstructions.module.css";

function ExamInstructions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);

  const [profileComplete, setProfileComplete] = useState(true);
  const [appliedCourses, setAppliedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isDisqualified, setIsDisqualified] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadExamContext = async () => {
      try {
        setFetchingData(true);

        // 1. Fetch Profile & Check Completion
        if (user?.email) {
          const profile = await studentService.getProfile(user.email);
          const isComplete = profile ? studentService.isProfileComplete(profile) : true;
          if (isMounted) setProfileComplete(isComplete);
        }

        // 2. Fetch Courses List
        const courseRes = await apiClient.get("/api/courses/").catch(() => null);
        const courses = Array.isArray(courseRes?.data) ? courseRes.data : courseRes?.data?.results || [];
        const coursesMap = {};
        courses.forEach((c) => { if (c?.id) coursesMap[c.id] = c; });

        // 3. Collect ALL Applied Courses (Backend + Local Storage)
        const myAppliedList = [];
        const seenCourseIds = new Set();

        const addAppliedCourse = (cId, fallbackName) => {
          if (cId && !seenCourseIds.has(cId)) {
            seenCourseIds.add(cId);
            const courseObj = coursesMap[cId];
            const name = courseObj?.name || courseObj?.title || fallbackName || "Applied Course";
            myAppliedList.push({ id: cId, name });
          }
        };

        // A. From Backend Applications API
        const appRes = await apiClient.get("/api/applications/").catch(() => null);
        const apps = Array.isArray(appRes?.data) ? appRes.data : appRes?.data?.results || [];
        apps.forEach((a) => {
          const cId = a.course?.id || (typeof a.course === "string" ? a.course : a.course_id);
          addAppliedCourse(cId, a.course_name || a.course_display);
        });

        // B. From Local Storage Application Objects
        const localApps = JSON.parse(localStorage.getItem("sure_student_applications") || "[]");
        localApps.forEach((la) => {
          const cId = la.course_id || la.course;
          addAppliedCourse(cId, la.course_name || la.course_display);
        });

        // C. From Local Storage Applied Course IDs Set
        const localCourseIds = JSON.parse(localStorage.getItem("sure_applied_course_ids") || "[]");
        localCourseIds.forEach((cId) => {
          addAppliedCourse(cId, null);
        });

        // Fallback default courses if no application has been created
        if (myAppliedList.length === 0) {
          myAppliedList.push({ id: "default_med", name: "Medical Coding (General Track)" });
          myAppliedList.push({ id: "default_vlsi", name: "Integrated VLSI Designing" });
        }

        if (isMounted) {
          setAppliedCourses(myAppliedList);
          const initialCourseId = myAppliedList[0].id;
          setSelectedCourse(initialCourseId);

          // 4. Check Disqualification Flag in localStorage
          const disqualifiedFlag = localStorage.getItem(`sure_exam_disqualified_${initialCourseId}`);
          if (disqualifiedFlag === "true") {
            setIsDisqualified(true);
          }
        }
      } catch (err) {
        console.error("Failed to load exam context:", err);
      } finally {
        if (isMounted) setFetchingData(false);
      }
    };

    loadExamContext();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    const disqualifiedFlag = localStorage.getItem(`sure_exam_disqualified_${courseId}`);
    setIsDisqualified(disqualifiedFlag === "true");
  };

  const handleStartExam = async () => {
    if (!profileComplete) {
      alert("⚠️ Please complete your profile first before attempting the screening exam.");
      navigate("/student/profile");
      return;
    }

    if (isDisqualified) {
      alert("🚨 You have been disqualified for anti-cheating violations on this exam. Re-attempts are disabled.");
      return;
    }

    setLoading(true);
    setError(null);

    // Request fullscreen mode
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        await document.documentElement.msRequestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen permission denied or not supported:", e);
    }

    try {
      const selectedCourseObj = appliedCourses.find((c) => c.id === selectedCourse);
      const courseName = selectedCourseObj ? selectedCourseObj.name : "Screening Course";

      const res = await apiClient.post(API_ENDPOINTS.EXAMS.START, {
        course_id: selectedCourse,
        course_name: courseName,
      }).catch(() => null);

      const examSession = res?.data?.exam || res?.data || {
        id: `SESSION-${Date.now()}`,
        course_name: courseName,
        duration_minutes: 30,
        started_at: new Date().toISOString(),
      };

      navigate("/student/exam", { state: { examSession, selectedCourse } });
    } catch (err) {
      console.error("Error starting exam:", err);
      setError(err.response?.data?.error || "Failed to start examination. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Screening Examination Portal</h1>
        <p className={styles.subtitle}>
          Standardized Online Assessment Mode. Select your applied course and read rules before starting.
        </p>

        {/* 🚨 PROFILE INCOMPLETE ALERT BANNER 🚨 */}
        {!profileComplete && (
          <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", padding: "1rem 1.25rem", borderRadius: "10px", marginBottom: "1.5rem", color: "#991b1b", fontWeight: "bold" }}>
            ⚠️ Profile Incomplete: Please complete your profile details (First Name, Email, Phone/College) before attempting the screening test.
            <div style={{ marginTop: "10px" }}>
              <Link to="/student/profile" style={{ padding: "8px 16px", backgroundColor: "#dc2626", color: "white", borderRadius: "6px", textDecoration: "none", fontSize: "14px" }}>
                Complete Profile Now
              </Link>
            </div>
          </div>
        )}

        {/* 🚨 DISQUALIFIED ALERT BANNER 🚨 */}
        {isDisqualified && (
          <div style={{ backgroundColor: "#fef2f2", border: "2px solid #ef4444", padding: "1rem 1.25rem", borderRadius: "10px", marginBottom: "1.5rem", color: "#991b1b", fontWeight: "bold" }}>
            🚨 DISQUALIFIED & FLAGGED: You recorded 3 anti-cheating violations (tab switching / window focus loss) during your previous attempt. Re-attempts for this course are strictly prohibited.
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* 📚 SELECT APPLIED COURSE SECTION 📚 */}
        <div className={styles.section} style={{ backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.1rem", color: "#0f172a" }}>1. Select Applied Course Track ({appliedCourses.length} Available)</h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 12px 0" }}>Choose which course application you are taking the screening exam for:</p>

          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px", fontWeight: "bold", color: "#1e293b" }}
          >
            {appliedCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} (Applied Track)
              </option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <h2>Exam Parameters</h2>
          <ul>
            <li>Total Questions: <strong>30 Multiple Choice Questions (MCQ)</strong></li>
            <li>Duration: <strong>30 Minutes</strong></li>
            <li>Passing Score: <strong>60% Marks</strong></li>
            <li>Selected Domain: <strong>{appliedCourses.find(c => c.id === selectedCourse)?.name || "Applied Course"}</strong></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Security & Anti-Cheating Rules</h2>
          <ul>
            <li>🔒 <strong>Full-Screen Mode:</strong> The exam operates in forced full-screen. Exiting full-screen is logged as a violation.</li>
            <li>🚫 <strong>Max 3 Violations Allowed:</strong> Tab switching, minimizing browser, or window blur will log violations. <strong>On 3 violations, the exam auto-submits & flags you as Disqualified!</strong></li>
            <li>❌ <strong>Copy/Paste Disabled:</strong> Context menu, copy/paste, and dev tool shortcuts are strictly blocked.</li>
            <li>⏱️ <strong>Auto-Submit:</strong> When the 30-minute timer expires, your exam automatically submits.</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          {!profileComplete ? (
            <Link to="/student/profile" style={{ flex: 1, padding: "14px", textAlign: "center", backgroundColor: "#d97706", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "16px" }}>
              Complete Profile First
            </Link>
          ) : (
            <button
              type="button"
              className={styles.startButton}
              onClick={handleStartExam}
              disabled={loading || isDisqualified || fetchingData}
              style={{ flex: 1, opacity: (isDisqualified || fetchingData) ? 0.6 : 1, cursor: (isDisqualified || fetchingData) ? "not-allowed" : "pointer" }}
            >
              {loading ? "Initializing Session..." : isDisqualified ? "Disqualified (Attempt Blocked)" : "Start Examination Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamInstructions;