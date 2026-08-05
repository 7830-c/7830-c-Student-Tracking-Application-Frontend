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

  const [apologies, setApologies] = useState({});

  const handleResolveWarning = async (warningId) => {
    try {
      const apologyText = apologies[warningId];
      if (!apologyText || apologyText.trim() === '') {
        alert("Please write your apology or reason first.");
        return;
      }
      await attendanceService.resolveWarning(warningId, apologyText);
      setWarnings(prev => prev.map(w => w.id === warningId ? { ...w, status: 'APOLOGIZED' } : w));
    } catch (err) {
      alert("Failed to submit apology.");
    }
  };

  const handleApologyChange = (warningId, text) => {
    setApologies(prev => ({ ...prev, [warningId]: text }));
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

      <div className={styles.immersiveHero}>
        <div className={styles.heroGlow}></div>

        <div className={styles.heroContent}>
          <p className={styles.streamLabel}>Your Active Stream</p>
          <h2 className={styles.streamTitle}>{profile?.domain || "No Domain Assigned"}</h2>
          <p className={styles.streamSubtitle}>Mastering concepts from silicon to systems. Access your live sessions and materials below.</p>
        </div>

        <div className={styles.floatingLiveSection}>
          <h3 className={styles.sectionTitle}>Live Session</h3>

          {todayClasses.length === 0 ? (
            <div className={styles.cleanStatus}>
              <span className={styles.pulseDot}></span> No active sessions scheduled right now.
            </div>
          ) : (
            todayClasses.map((cls, idx) => {
              const classStart = new Date(cls.class_date + "T" + cls.start_time);
              const nowDiff = (new Date() - classStart) / 1000 / 60;
              const classOpen = cls.conducted !== false && nowDiff >= -10 && nowDiff <= 5;
              const hasEnded = cls.conducted === false || cls.status === 'ENDED' || nowDiff > 5;

              if (hasEnded) {
                const endTime = cls.updated_at ? new Date(cls.updated_at) : new Date(classStart.getTime() + (60 * 60 * 1000));
                if ((new Date() - endTime) / 1000 / 60 > 30) return null;
              }

              return (
                <div key={idx} className={styles.classCardWrapper}>
                  <div className={styles.glassRow}>
                    <div className={styles.glassInfo}>
                      <h4>{cls.session_type || "Domain Session"}</h4>
                      <p>{classStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    {classOpen ? (
                      <button onClick={() => handleJoinClass(cls)} disabled={isJoining || !cls.meeting_link} className={styles.btnExtreme}>
                        {!isJoining ? 'Join Live' : 'Connecting...'}
                      </button>
                    ) : hasEnded ? (
                      <span className={styles.statusEnded}>Ended</span>
                    ) : (
                      <span className={styles.statusWaiting}>Opens in 10m</span>
                    )}
                  </div>

                  {/* New Instructions Block */}
                  <div className={styles.classInstructions}>
                    <p>📸 <strong>Requirement:</strong> Camera must be ON to track attendance.</p>
                    <p>⏱️ <strong>Note:</strong> Attendance is calculated based on your active time in the meeting.</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className={styles.minimalResources}>
        <h3 className={styles.sectionTitleDark}>Domain Resources</h3>
        {availableResources.length === 0 ? (
          <p className={styles.cleanText}>Your trainer hasn't uploaded materials yet.</p>
        ) : (
          <div className={styles.resourceListClean}>
            {availableResources.map((file, idx) => (
              <div key={idx} className={styles.cleanResourceRow}>
                <span className={styles.fileIcon}>📄</span>
                <span className={styles.fileName}>{file.name}</span>
                <button onClick={() => handleDownload(file.name)} className={styles.cleanDownloadBtn}>Download</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {warnings.length > 0 && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000, display: "flex", flexDirection: "column", gap: "10px" }}>
          {warnings.filter(w => w.status !== 'ACCEPTED').map(w => (
            <div key={w.id} style={{ background: "#fee2e2", border: "1px solid #ef4444", padding: "16px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxWidth: "350px" }}>
              <h4 style={{ color: "#991b1b", margin: "0 0 8px 0" }}>⚠️ Absence Warning</h4>
              <p style={{ color: "#7f1d1d", fontSize: "14px", margin: "0 0 12px 0" }}>
                You attended less than 40% of the class: <strong>{w.session_title}</strong> on {w.class_date}. Kindly ask permission and resolve this otherwise you will be removed.
              </p>
              
              {w.status === 'PENDING' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <textarea
                    placeholder="Write your apology or reason here..."
                    value={apologies[w.id] || ''}
                    onChange={(e) => handleApologyChange(w.id, e.target.value)}
                    rows={3}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #fca5a5", fontSize: "14px", resize: 'none' }}
                  />
                  <button onClick={() => handleResolveWarning(w.id)} style={{ background: "#dc2626", color: "white", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Submit Apology</button>
                </div>
              ) : (
                <div style={{ padding: "8px", background: "#fef2f2", color: "#b91c1c", borderRadius: "6px", fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>
                  Apology submitted. Waiting for admin approval.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;