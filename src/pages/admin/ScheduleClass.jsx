import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../../services/courseService";
import { attendanceService } from "../../services/attendanceService";
import { normalizeListResponse } from "../../services/apiClient";
import apiClient from "../../services/apiClient";
import styles from "./ScheduleClass.module.css";

function ScheduleClass() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 🚨 State for the Live Radar
  const [activeAdminClasses, setActiveAdminClasses] = useState([]);

  const [request, setRequest] = useState({
    sessionType: "Domain",
    streamId: "",
    groupName: "",
    lstBatchNumber: "",
    startTime: "",
    endTime: "",
    guestEmails: [],
  });

  const [showGuestInput, setShowGuestInput] = useState(false);
  const [newGuestEmail, setNewGuestEmail] = useState("");

  // 🚨 Function to fetch live radar data
  const loadActiveClasses = async () => {
    try {
      const res = await attendanceService.getAttendanceRecords({ status: "ACTIVE" });
      const rawData = res.data || res;
      // Safely extract Django's paginated results
      const sessionsArray = Array.isArray(rawData.results) ? rawData.results : (Array.isArray(rawData) ? rawData : []);
      setActiveAdminClasses(sessionsArray);
    } catch (err) {
      console.error("Failed to load radar classes:", err);
    }
  };

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await courseService.getCourses();
        setCourses(normalizeListResponse(res));
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    }
    loadCourses();
    loadActiveClasses(); // Load radar on page load
  }, []);

  const addGuestEmail = (e) => {
    if (e) e.preventDefault();
    if (newGuestEmail && newGuestEmail.includes("@")) {
      setRequest((prev) => ({
        ...prev,
        guestEmails: [...prev.guestEmails, newGuestEmail.trim()],
      }));
      setNewGuestEmail("");
    }
  };

  const removeGuestEmail = (index) => {
    setRequest((prev) => ({
      ...prev,
      guestEmails: prev.guestEmails.filter((_, i) => i !== index),
    }));
  };

  // 1. Update the force end class function to use attendanceService
  const handleForceEndClass = async (classId) => {
    if (!window.confirm("Are you sure you want to end this class and calculate attendance?")) return;
    try {
      setActiveAdminClasses(prev => prev.filter(c => c.id !== classId));

      // Uses your built-in attendanceService PATCH method
      await attendanceService.patchAttendanceRecord(classId, { conducted: false });

      alert("Class ended successfully. Attendance calculated and CSV generated.");
    } catch (err) {
      console.error("Failed to end class:", err);
      loadActiveClasses();
      alert("Failed to end class. Check backend endpoints.");
    }
  };

  const scheduleClass = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 1. Dynamically search for the strict Cohort UUID using your project's apiClient
      const cohortRes = await apiClient.get('/api/cohorts/');
      const cohortData = cohortRes.data;
      const allCohorts = Array.isArray(cohortData?.results) ? cohortData.results : (Array.isArray(cohortData) ? cohortData : []);

      const typedGroup = request.groupName.trim().toLowerCase();
      const matchedCohort = allCohorts.find(c =>
        (c.name?.toLowerCase() === typedGroup || c.batch_name?.toLowerCase() === typedGroup)
      );

      // 2. Get the valid User UUID safely
      const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
      let currentUserId = currentUser.id || currentUser.pk || currentUser.user_id;

      if (!currentUserId || currentUserId === 1) {
        const usersRes = await apiClient.get('/api/users/');
        const usersData = usersRes.data;
        const usersList = Array.isArray(usersData?.results) ? usersData.results : (Array.isArray(usersData) ? usersData : []);
        const validUser = usersList.find(u => u.email === currentUser.email) || usersList[0];
        currentUserId = validUser?.id;
      }

      const finalGroupName = request.groupName ? request.groupName.trim().toUpperCase() : "";

      const formattedData = {
        title: `${request.sessionType} Session - ${finalGroupName || request.lstBatchNumber || 'General'}`.toUpperCase(),
        class_date: request.startTime.split("T")[0],
        start_time: request.startTime.split("T")[1] + ":00",
        end_time: request.endTime.split("T")[1] + ":00",
        conducted_by: currentUserId,
        cohort: matchedCohort ? matchedCohort.id : null,
        attendees: [],
        notes: request.guestEmails.length > 0 ? `Whitelisted Guests: ${request.guestEmails.join(", ")}` : "",
        session_type: request.sessionType,
        group_name: finalGroupName,
        stream_id: request.streamId,
        lst_batch: request.lstBatchNumber,
        guest_emails: request.guestEmails
      };

      const res = await attendanceService.scheduleSession(formattedData);

      const expectedCount = res?.data?.expected_attendees_count || res?.expected_attendees_count || 0;
      setSuccessMessage(`Live class scheduled! Expected Attendees: ${expectedCount}`);

      setRequest({
        sessionType: "Domain",
        streamId: "",
        groupName: "",
        lstBatchNumber: "",
        startTime: "",
        endTime: "",
        guestEmails: [],
      });

      loadActiveClasses();

    } catch (err) {
      if (err.customError) {
        setErrorMessage(err.customError);
      } else {
        const serverError = err.response?.data ? JSON.stringify(err.response.data) : err.message;
        setErrorMessage(`Backend rejected the form: ${serverError}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", width: "100%" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "#111827", margin: 0 }}>Schedule Live Class</h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem", margin: "4px 0 0 0" }}>Configure automated Google Meets for Domains, LST, or Celebrations.</p>
        </div>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "2rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", width: "100%" }}>
        {successMessage && <div style={{ padding: "1rem", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "1.5rem", fontWeight: "bold" }}>✅ {successMessage}</div>}
        {errorMessage && <div style={{ padding: "1rem", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "1.5rem", fontWeight: "bold" }}>❌ {errorMessage}</div>}

        <form onSubmit={scheduleClass} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#374151" }}>Target Audience (Session Type) *</label>
            <select
              value={request.sessionType}
              onChange={(e) => setRequest({ ...request, sessionType: e.target.value })}
              required
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }}
            >
              <option value="Domain">Technical Domain (Specific Group)</option>
              <option value="LST">Life Skills Training (Entire Batch)</option>
              <option value="Celebration">Universal Celebration (Everyone)</option>
            </select>
          </div>

          {request.sessionType === "Domain" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem", backgroundColor: "#faf5ff", borderRadius: "8px", border: "1px solid #e9d5ff" }}>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#581c87" }}>Select Stream *</label>
                <select value={request.streamId} onChange={(e) => setRequest({ ...request, streamId: e.target.value })} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d8b4fe" }}>
                  <option value="">-- Select Stream --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name || c.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#581c87" }}>Group Code *</label>
                <input type="text" value={request.groupName} onChange={(e) => setRequest({ ...request, groupName: e.target.value })} placeholder="e.g. G16" required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d8b4fe", textTransform: "uppercase" }} />
              </div>
            </div>
          )}

          {request.sessionType === "LST" && (
            <div style={{ padding: "1rem", backgroundColor: "#e0e7ff", borderRadius: "8px", border: "1px solid #c7d2fe" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#312e81" }}>LST Batch Number *</label>
              <select value={request.lstBatchNumber} onChange={(e) => setRequest({ ...request, lstBatchNumber: e.target.value })} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #a5b4fc" }}>
                <option value="">-- Select Batch --</option>
                <option value="1">Batch 1</option>
                <option value="2">Batch 2</option>
              </select>
            </div>
          )}

          <div style={{ padding: "1.25rem", backgroundColor: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showGuestInput ? "1rem" : "0" }}>
              <div>
                <label style={{ display: "block", fontWeight: "bold", color: "#1e3a8a" }}>Whitelist Custom Emails (Optional)</label>
                <p style={{ fontSize: "12px", color: "#1d4ed8", margin: 0 }}>Add trainers, trustees, or students to bypass the Meet waiting room.</p>
              </div>
              <button type="button" onClick={() => setShowGuestInput(!showGuestInput)} style={{ padding: "0.5rem 1rem", backgroundColor: "#2563eb", color: "white", fontWeight: "bold", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                {showGuestInput ? "Hide" : "+ Add Emails"}
              </button>
            </div>

            {showGuestInput && (
              <div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="email" value={newGuestEmail} onChange={(e) => setNewGuestEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGuestEmail(e)} placeholder="e.g. rohansir@gmail.com" style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid #93c5fd" }} />
                  <button type="button" onClick={addGuestEmail} style={{ padding: "0.75rem 1.5rem", backgroundColor: "#bfdbfe", color: "#1e3a8a", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: "pointer" }}>Add</button>
                </div>

                {request.guestEmails.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem", padding: "0.75rem", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "8px" }}>
                    {request.guestEmails.map((email, i) => (
                      <span key={i} style={{ padding: "0.25rem 0.75rem", backgroundColor: "white", border: "1px solid #93c5fd", color: "#1e40af", fontSize: "14px", fontWeight: "bold", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {email}
                        <button type="button" onClick={() => removeGuestEmail(i)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", padding: 0 }}>&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#374151" }}>Start Time *</label>
              <input type="datetime-local" value={request.startTime} onChange={(e) => setRequest({ ...request, startTime: e.target.value })} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.5rem", color: "#374151" }}>End Time *</label>
              <input type="datetime-local" value={request.endTime} onChange={(e) => setRequest({ ...request, endTime: e.target.value })} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db" }} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
            <button type="submit" disabled={isLoading} style={{ width: "100%", padding: "1rem", backgroundColor: "#facc15", color: "#4c1d95", fontWeight: "900", fontSize: "1.1rem", borderRadius: "8px", border: "none", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? "Scheduling..." : "Schedule & Generate Meet Link"}
            </button>
          </div>
        </form>
      </div>

      {/* 🚨 ADMIN LIVE RADAR UI 🚨 */}
      <div style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", width: "100%" }}>
        <h2 style={{ color: "#0f172a", marginBottom: "1.5rem", fontSize: "1.5rem" }}>📡 Live Class Radar</h2>

        <div style={{ display: "grid", gap: "1rem" }}>
          {activeAdminClasses.map(cls => (
            <div key={cls.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>

              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#1e293b", fontSize: "1.2rem" }}>{cls.title}</h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  {/* 🚨 FIX: Now uses the safe generator_info from the fixed serializer */}
                  Generated by: <strong>{cls.generator_info || "Admin/Mentor"}</strong> |
                  Attendees Mapped: <strong>{cls.attendees?.length || 0}</strong>
                </p>
                <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "12px" }}>
                  Scheduled For: {new Date(cls.class_date + "T" + cls.start_time).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    hour12: true
                  })}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  onClick={() => window.open(cls.meeting_link?.startsWith('http') ? cls.meeting_link : `https://${cls.meeting_link}`, '_blank')}
                  disabled={!cls.meeting_link}
                  style={{ padding: "10px 16px", backgroundColor: cls.meeting_link ? "#3b82f6" : "#cbd5e1", color: "white", border: "none", borderRadius: "6px", cursor: cls.meeting_link ? "pointer" : "not-allowed", fontWeight: "bold" }}>
                  👁️ Spectate
                </button>

                <button
                  onClick={() => handleForceEndClass(cls.id)}
                  style={{ padding: "10px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                  🛑 End Class
                </button>
              </div>

            </div>
          ))}
          {activeAdminClasses.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", backgroundColor: "white", borderRadius: "8px" }}>
              No active classes generated yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScheduleClass;