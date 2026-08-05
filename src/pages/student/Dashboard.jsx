import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import { attendanceService } from "../../services/attendanceService";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [todayClasses, setTodayClasses] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      if (!user?.email) return;
      try {
        // 1. Fetch Profile (Use the main secure endpoint since Django auto-filters to the logged-in user)
        const res = await studentService.getStudentProfiles();
        const data = res?.data || res;
        const profileObj = Array.isArray(data?.results) ? data.results[0] : (Array.isArray(data) ? data[0] : data);
        setProfile(profileObj || {});

        // 2. Fetch Active Classes (Filter by student's batch/domain if needed)
        const sessionsRes = await attendanceService.getAttendanceRecords({ status: "ACTIVE" });
        if (sessionsRes && (sessionsRes.data || sessionsRes.results)) {
          // 🚨 FIX: Extract Django's paginated 'results' array safely!
          const rawData = sessionsRes.data || sessionsRes;
          const sessionsArray = Array.isArray(rawData.results) ? rawData.results : (Array.isArray(rawData) ? rawData : []);
          setTodayClasses(sessionsArray);
        }

        // 3. Fetch Absence Warnings
        const warningsRes = await attendanceService.getWarnings();
        if (Array.isArray(warningsRes)) {
            setWarnings(warningsRes);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  const handleJoinClass = async (cls) => {
    setIsJoining(true);
    try {
        await attendanceService.markJoined(cls.id);
    } catch (err) {
        console.error("Failed to mark joined", err);
    }
    setTimeout(() => {
      setIsJoining(false);
      window.open(cls.meeting_link.startsWith('http') ? cls.meeting_link : `https://${cls.meeting_link}`, '_blank');
    }, 1000);
  };

  const handleResolveWarning = async (warningId) => {
    try {
        await attendanceService.resolveWarning(warningId);
        setWarnings(prev => prev.filter(w => w.id !== warningId));
    } catch(err) {
        alert("Failed to resolve warning.");
    }
  };

  const handleDownload = (fileName) => {
    alert(`Initiating download for ${fileName}...\n(Will trigger physical download once backend is ready)`);
  };

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // 🚨 LOCK SCREEN FOR PENDING OR REVOKED STUDENTS 🚨
  const isLocked = profile?.status === "NOT_AVAILABLE" || profile?.status === "BUSY";
  const isRevoked = profile?.status === "NOT_AVAILABLE" && profile?.domain; // If they already submitted domain but got turned off

  if (isLocked) {
    return (
      <div className={styles.lockScreenContainer}>
        <div className={styles.lockCard}>
          <div className={styles.blurOrange}></div>
          <div className={styles.blurPurple}></div>
          <div className={styles.lockContent}>
            <div className={styles.hourglassIcon}>{isRevoked ? "🚫" : "⏳"}</div>
            <h2>{isRevoked ? "Access Revoked" : "Account Pending"}</h2>
            <p>
              {isRevoked
                ? "Your access to live classes and resources has been temporarily revoked by an administrator. Please contact support or wait for review."
                : "Your account has been successfully created! An administrator is currently verifying your offer letter. Access will unlock automatically once approved."}
            </p>

            <div className={styles.domainBadge}>
              <div className={styles.domainInfo}>
                <span className={styles.domainEmoji}>🎓</span>
                <div>
                  <p className={styles.domainLabel}>Registered Domain</p>
                  <p className={styles.domainName}>{profile?.domain || "N/A"} ({profile?.courseBatch || "N/A"})</p>
                </div>
              </div>
              <span className={styles.waitlistedTag}>Waitlisted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🚨 ACTIVE DASHBOARD 🚨
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div>
          <h1>Welcome, {profile?.firstName || user?.first_name || user?.firstName || "Student"} {profile?.lastName || user?.last_name || user?.lastName || ""}!</h1>
          <p>📍 {profile?.collegeName || "Sure ProEd Student"}</p>
        </div>
        <div className={styles.roleBadge}>
          Role: Student
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <div className={styles.streamCard}>
            <div className={styles.streamBlur}></div>
            <p className={styles.streamLabel}>Your Selected Stream</p>
            <h2>{profile?.domain || "No Domain Assigned"}</h2>
            <div className={styles.streamNote}>
              <p>Your domain-specific resources and technical meeting links will appear here.</p>
            </div>
          </div>

          <div className={styles.resourcesCard}>
            <h3><span>📚</span> Domain Resources</h3>
            {availableResources.length === 0 ? (
              <div className={styles.emptyResources}>
                <p className={styles.emptyIcon}>📁</p>
                <p>Your trainer hasn't uploaded any materials yet.</p>
              </div>
            ) : (
              <div className={styles.resourceList}>
                {availableResources.map((file, idx) => (
                  <div key={idx} className={styles.resourceItem}>
                    <div className={styles.resourceInfo}>
                      <span>📄</span>
                      <div>
                        <p className={styles.resourceName}>{file.name}</p>
                        <p className={styles.resourceDate}>Uploaded today</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload(file.name)} className={styles.downloadBtn}>Download</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <h3>Live Training & Classes</h3>

          {todayClasses.length === 0 ? (
            <div className={styles.noClassCard}>
              <p>Sunday Sessions (8 weeks). <br /> Batch Assignment: <strong>{profile?.course_batch || 'Pending Admin Assignment'}</strong></p>
              <span className={styles.noClassTag}>No Class Today</span>
            </div>
          ) : (
            todayClasses.map((cls, idx) => {
              const classStart = new Date(cls.class_date + "T" + cls.start_time);
              const nowDiff = (new Date() - classStart) / 1000 / 60; // difference in minutes
              const classOpen = cls.conducted !== false && nowDiff >= -10 && nowDiff <= 5;
              const hasEnded = cls.conducted === false || nowDiff > 5;

              return (
              <div key={idx} className={styles.classCard}>
                <div>
                  <div className={styles.classHeader}>
                    <div>
                      <h4>{cls.session_type || "Domain Session"}</h4>
                      <p className={styles.classStream}>{cls.title || profile?.domain}</p>
                    </div>
                    {hasEnded ? (
                      <span style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>Ended</span>
                    ) : (
                      <span className={styles.liveTag}>Live Today!</span>
                    )}
                  </div>
                  <div className={styles.classTimes}>
                    <p className={styles.timeMain}>{classStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                {classOpen ? (
                  <button
                    onClick={() => handleJoinClass(cls)}
                    disabled={isJoining || !cls.meeting_link}
                    className={cls.meeting_link ? styles.joinBtnActive : styles.joinBtnDisabled}
                  >
                    {!isJoining && (cls.meeting_link ? '🚀 Enter Secure Class' : '🔒 Generating Link...')}
                    {isJoining && <div className={styles.btnSpinner}></div>}
                  </button>
                ) : hasEnded ? (
                  <button disabled className={styles.joinBtnDisabled} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#e5e7eb", color: "#9ca3af", fontWeight: "bold", cursor: "not-allowed", marginTop: "1rem" }}>
                    🔒 Class Locked
                  </button>
                ) : (
                  <button disabled className={styles.joinBtnDisabled} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#e5e7eb", color: "#9ca3af", fontWeight: "bold", cursor: "not-allowed", marginTop: "1rem" }}>
                    ⏳ Opens 10 mins before
                  </button>
                )}
                <p className={styles.cameraNote}>Camera must be ON to track attendance.</p>
              </div>
            )})
          )}
        </div>
      </div>
      
      {warnings.length > 0 && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000, display: "flex", flexDirection: "column", gap: "10px" }}>
            {warnings.map(w => (
                <div key={w.id} style={{ background: "#fee2e2", border: "1px solid #ef4444", padding: "16px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxWidth: "350px" }}>
                    <h4 style={{ color: "#991b1b", margin: "0 0 8px 0" }}>⚠️ Absence Warning</h4>
                    <p style={{ color: "#7f1d1d", fontSize: "14px", margin: "0 0 12px 0" }}>
                        You missed the class: <strong>{w.session_title}</strong> on {w.class_date}. Kindly ask permission and resolve this otherwise you will be removed.
                    </p>
                    <button onClick={() => handleResolveWarning(w.id)} style={{ background: "#dc2626", color: "white", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Acknowledge & Resolve</button>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;