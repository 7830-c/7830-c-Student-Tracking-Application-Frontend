import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./ClassSchedule.module.css";

function ClassSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadSchedules = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COHORTS.BASE);
        if (isMounted) setSchedules(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load class schedule:", err);
        if (isMounted) setSchedules([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSchedules();
    return () => {
      isMounted = false;
    };
  }, []);

  const [scheduleForm, setScheduleForm] = useState({ title: "", startTime: "", endTime: "", guestEmails: [] });
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setIsScheduling(true);
    try {
      // Pass domain-specific flag to backend
      await apiClient.post(`${API_ENDPOINTS.ATTENDANCE.BASE}schedule/`, { ...scheduleForm, sessionType: "Domain" });
      alert("✅ Domain Session Scheduled!");
      setScheduleForm({ title: "", startTime: "", endTime: "", guestEmails: [] });
    } catch (err) {
      alert("❌ Failed to schedule class.");
    } finally {
      setIsScheduling(false);
    }
  };

  const addGuest = (e) => {
    e.preventDefault();
    if (newGuestEmail.includes("@")) {
      setScheduleForm(prev => ({ ...prev, guestEmails: [...prev.guestEmails, newGuestEmail.trim()] }));
      setNewGuestEmail("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Class Schedule</h1>
      </div>

      {/* Domain-Specific Scheduler for Mentors */}
      <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "2rem", border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#111827" }}>Schedule Domain Session</h2>
        <form onSubmit={handleScheduleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>Meet Title / Topic *</label>
            <input type="text" required value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>Start Time *</label>
              <input type="datetime-local" required value={scheduleForm.startTime} onChange={e => setScheduleForm({...scheduleForm, startTime: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>End Time *</label>
              <input type="datetime-local" required value={scheduleForm.endTime} onChange={e => setScheduleForm({...scheduleForm, endTime: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", fontSize: "14px" }}>Whitelist Guest Emails</span>
              <button type="button" onClick={() => setShowGuestInput(!showGuestInput)} style={{ padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>{showGuestInput ? "Hide" : "+ Add"}</button>
            </div>
            {showGuestInput && (
              <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                <input type="email" placeholder="guest@email.com" value={newGuestEmail} onChange={e => setNewGuestEmail(e.target.value)} style={{ flex: 1, padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }} />
                <button type="button" onClick={addGuest} style={{ padding: "6px 12px", cursor: "pointer" }}>Add</button>
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
              {scheduleForm.guestEmails.map((em, i) => (
                <span key={i} style={{ fontSize: "12px", background: "white", padding: "2px 8px", borderRadius: "12px", border: "1px solid #ccc" }}>{em} <button type="button" onClick={() => setScheduleForm(prev => ({...prev, guestEmails: prev.guestEmails.filter((_, idx) => idx !== i)}))} style={{ border: "none", background: "none", color: "red", cursor: "pointer" }}>x</button></span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isScheduling} style={{ padding: "10px", backgroundColor: "#4f46e5", color: "white", fontWeight: "bold", borderRadius: "6px", border: "none", cursor: "pointer" }}>
            {isScheduling ? "Scheduling..." : "Schedule Session"}
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading cohort schedules from the database...</p>
      ) : schedules.length === 0 ? (
        <p>No cohort schedules are available yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Course</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {schedules.map((item) => (
              <tr key={item.id}>
                <td>{item.name || item.code || "N/A"}</td>
                <td>{item.course?.name || item.course || "N/A"}</td>
                <td>{item.start_date || "N/A"}</td>
                <td>{item.end_date || "N/A"}</td>
                <td>{item.status || "PENDING"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.footer}>
        <Link to="/mentor/cohorts">← Back to Cohorts</Link>
      </div>
    </div>
  );
}

export default ClassSchedule;