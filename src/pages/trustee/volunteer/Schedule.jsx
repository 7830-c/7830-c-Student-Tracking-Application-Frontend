import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getStreams,
  createSession,
} from "../../../services/trusteeService";
import styles from "./Schedule.module.css";

function VolunteerSchedule() {
  const navigate = useNavigate();

  const [streams, setStreams] = useState([]);
  const [sessionType, setSessionType] = useState("LST");
  const [streamId, setStreamId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [lstBatchNumber, setLstBatchNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showGuestInput, setShowGuestInput] = useState(false);
  const [guestEmails, setGuestEmails] = useState([]);
  const [newGuestEmail, setNewGuestEmail] = useState("");

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const data = await getStreams();
        setStreams(data);
      } catch (err) {
        console.warn("Could not load streams:", err);
      }
    };
    fetchStreams();
  }, []);

  const handleAddGuestEmail = (e) => {
    e?.preventDefault();
    if (newGuestEmail && newGuestEmail.includes("@")) {
      setGuestEmails([...guestEmails, newGuestEmail.trim()]);
      setNewGuestEmail("");
    }
  };

  const handleRemoveGuestEmail = (index) => {
    setGuestEmails(guestEmails.filter((_, i) => i !== index));
  };

  const handleScheduleClass = async () => {
    if (!startTime || !endTime) {
      alert("Please fill in the start and end times.");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 60000);

    const payload = {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      expectedDurationMinutes: duration,
      sessionType,
      streamId: sessionType === "Domain" ? streamId || null : null,
      groupName: sessionType === "Domain" ? groupName : null,
      lstBatchNumber: sessionType === "LST" ? lstBatchNumber : null,
      guestEmails,
    };

    setIsSubmitting(true);
    try {
      await createSession(payload);
      alert("Class Scheduled Successfully! Link is generating.");
      navigate("/trustee/volunteer/dashboard");
    } catch (err) {
      alert("Failed to schedule class: " + (err.response?.data?.detail || err.message));
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Schedule Session</h2>
        <Link to="/trustee/volunteer/dashboard" className="btn btnSecondary">
          ← Back to Dashboard
        </Link>
      </div>

      <div className={styles.formCard}>
        <div className="formGroup">
          <label className="formLabel">Session Type *</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="formSelect"
          >
            <option value="LST">Life Skills Training (LST)</option>
            <option value="Domain">Domain Specific Class</option>
            <option value="Celebration">Global Celebration (Everyone)</option>
          </select>
        </div>

        {sessionType === "Domain" && (
          <div className={styles.domainSection}>
            <div className={styles.splitGrid}>
              <div className="formGroup">
                <label className="formLabel">Select Domain *</label>
                <select
                  value={streamId}
                  onChange={(e) => setStreamId(e.target.value)}
                  className="formSelect"
                >
                  <option value="">Select a domain...</option>
                  {streams.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.streamName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="formLabel">Group / Batch Name *</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., G1-26"
                  className="formInput"
                />
              </div>
            </div>
          </div>
        )}

        {sessionType === "LST" && (
          <div className={styles.lstSection}>
            <div className="formGroup" style={{ marginBottom: 0 }}>
              <label className="formLabel">LST Batch Number (Optional)</label>
              <input
                type="number"
                value={lstBatchNumber}
                onChange={(e) => setLstBatchNumber(e.target.value)}
                placeholder="e.g., 1"
                className="formInput"
              />
              <p className={styles.helperText}>
                Leave blank to invite ALL students to this LST.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Emails */}
        <div className={styles.emailsSection}>
          <div className={styles.emailsHeader}>
            <div>
              <label className="formLabel">Whitelist Custom Emails (Optional)</label>
              <p className={styles.helperText}>
                Add trainers or guests to bypass the waiting room.
              </p>
            </div>
            <button
              type="button"
              className={styles.btnToggle}
              onClick={() => setShowGuestInput(!showGuestInput)}
            >
              {showGuestInput ? "Hide" : "+ Add Emails"}
            </button>
          </div>

          {showGuestInput && (
            <div className={styles.emailsBody}>
              <div className={styles.emailInputRow}>
                <input
                  type="email"
                  value={newGuestEmail}
                  onChange={(e) => setNewGuestEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGuestEmail();
                    }
                  }}
                  placeholder="e.g. trainer@example.com"
                  className="formInput"
                />
                <button
                  type="button"
                  className={styles.btnAddEmail}
                  onClick={handleAddGuestEmail}
                >
                  Add
                </button>
              </div>

              {guestEmails.length > 0 && (
                <div className={styles.emailTagsRow}>
                  {guestEmails.map((email, i) => (
                    <span key={i} className={styles.emailTag}>
                      {email}
                      <button
                        type="button"
                        className={styles.removeTag}
                        onClick={() => handleRemoveGuestEmail(i)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.splitGrid} style={{ marginTop: "2rem" }}>
          <div className="formGroup">
            <label className="formLabel">Start Time *</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="formInput"
            />
          </div>
          <div className="formGroup">
            <label className="formLabel">End Time *</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="formInput"
            />
          </div>
        </div>

        <button
          className={styles.submitBtn}
          onClick={handleScheduleClass}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Provisioning..." : "Schedule & Generate Link"}
        </button>
      </div>
    </div>
  );
}

export default VolunteerSchedule;
