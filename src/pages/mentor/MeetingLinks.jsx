import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./MeetingLinks.module.css";

function MeetingLinks() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMeetings = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COHORTS.BASE);
        if (isMounted) setMeetings(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load meeting links:", err);
        if (isMounted) setMeetings([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMeetings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Meeting Links</h1>
        <p>Manage class meeting links</p>
      </div>

      {loading ? (
        <p>Loading meeting links from the database...</p>
      ) : meetings.length === 0 ? (
        <p>No cohort meeting links have been configured yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Course</th>
              <th>Meeting Link</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting.id}>
                <td>{meeting.name || meeting.code || "N/A"}</td>
                <td>{meeting.course?.name || meeting.course || "N/A"}</td>
                <td>
                  {meeting.meeting_link ? (
                    <a href={meeting.meeting_link} target="_blank" rel="noreferrer">
                      Join Meeting
                    </a>
                  ) : (
                    "Not available"
                  )}
                </td>
                <td>
                  <Link to="/mentor/edit-meeting-link">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MeetingLinks;