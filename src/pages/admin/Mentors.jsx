import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import styles from "./Mentors.module.css";

function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohortMap, setSelectedCohortMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Multi-page harvester
  const fetchAllPages = async (endpoint) => {
    let results = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 20) {
      try {
        const separator = endpoint.includes("?") ? "&" : "?";
        const res = await apiClient.get(`${endpoint}${separator}page=${page}&page_size=100`);
        const data = res?.data;

        if (Array.isArray(data)) {
          results = results.concat(data);
          hasMore = false;
        } else if (data && Array.isArray(data.results)) {
          results = results.concat(data.results);
          hasMore = !!data.next;
          page++;
        } else {
          hasMore = false;
        }
      } catch (err) {
        hasMore = false;
      }
    }
    return results;
  };

  const resolveName = (userObj, fallbackEmail) => {
    if (userObj && typeof userObj === "object") {
      const fn = (userObj.first_name || "").trim();
      const ln = (userObj.last_name || "").trim();
      if (fn || ln) return `${fn} ${ln}`.trim();
      if (userObj.email && userObj.email.includes("@")) {
        const prefix = userObj.email.split("@")[0];
        return prefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
    if (fallbackEmail && fallbackEmail.includes("@")) {
      const prefix = fallbackEmail.split("@")[0];
      return prefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return "Demo Mentor";
  };

  useEffect(() => {
    let isMounted = true;
    const loadMentorsData = async () => {
      try {
        const [rawUsers, rawProfiles, rawCourses, rawCohorts] = await Promise.all([
          fetchAllPages("/api/users/"),
          fetchAllPages("/api/mentor-profile/"),
          fetchAllPages("/api/courses/"),
          fetchAllPages("/api/cohorts/"),
        ]);

        const usersMap = {};
        rawUsers.forEach((u) => { if (u?.id) usersMap[u.id] = u; });

        const coursesMap = {};
        rawCourses.forEach((c) => { if (c?.id) coursesMap[c.id] = c.name || c.title; });

        const profilesMap = {};
        rawProfiles.forEach((p) => {
          const uid = typeof p.user === "object" ? p.user.id : p.user;
          if (uid) profilesMap[uid] = p;
        });

        // Filter active / upcoming cohorts
        const activeUpcomingCohorts = rawCohorts.filter((ch) => {
          if (!ch.end_date) return true;
          const endDate = new Date(ch.end_date);
          const today = new Date();
          return endDate >= today || ch.status === "ACTIVE" || ch.status === "UPCOMING";
        });

        const mentorUserMap = {};

        rawUsers.filter((u) => u.role === "MENTOR").forEach((u) => {
          const p = profilesMap[u.id] || {};
          const displayName = resolveName(u, u.email);
          const courseTitle = p.course_name || (p.course && coursesMap[p.course] ? coursesMap[p.course] : "General Track");
          const cohortName = p.cohort_name || p.assigned_cohort || "Not Assigned";

          mentorUserMap[u.id] = {
            id: p.id || u.id,
            user_id: u.id,
            display_name: displayName,
            email: u.email,
            phone: u.phone_number || "N/A",
            assigned_course: courseTitle,
            assigned_cohort: cohortName,
            is_active: u.is_active !== false,
          };
        });

        rawProfiles.forEach((p) => {
          const uid = typeof p.user === "object" ? p.user.id : p.user;
          if (uid && !mentorUserMap[uid]) {
            const uObj = usersMap[uid];
            const displayName = resolveName(uObj, p.user_email);
            const courseTitle = p.course_name || (p.course && coursesMap[p.course] ? coursesMap[p.course] : "General Track");
            const cohortName = p.cohort_name || p.assigned_cohort || "Not Assigned";

            mentorUserMap[uid] = {
              id: p.id,
              user_id: uid,
              display_name: displayName,
              email: p.user_email || uObj?.email || "mentor@sureproed.com",
              phone: uObj?.phone_number || "N/A",
              assigned_course: courseTitle,
              assigned_cohort: cohortName,
              is_active: uObj?.is_active !== false,
            };
          }
        });

        const mentorList = Object.values(mentorUserMap);

        if (isMounted) {
          setMentors(mentorList);
          setCohorts(activeUpcomingCohorts);
        }
      } catch (err) {
        console.error("Failed to load mentors:", err);
        if (isMounted) setMentors([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMentorsData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCohortSelect = (mentorId, cohortId) => {
    setSelectedCohortMap((prev) => ({ ...prev, [mentorId]: cohortId }));
  };

  const handleAssignCohort = async (mentor) => {
    const cohortId = selectedCohortMap[mentor.id];
    if (!cohortId) {
      alert("Please select an active cohort batch to assign.");
      return;
    }
    const cohortObj = cohorts.find((c) => c.id === cohortId || c.code === cohortId);
    const cohortLabel = cohortObj ? `${cohortObj.code} - ${cohortObj.name}` : cohortId;

    try {
      await apiClient.patch(`/api/mentor-profile/${mentor.id}/`, { assigned_cohort: cohortId }).catch(() => null);
      setMentors((prev) =>
        prev.map((m) => (m.id === mentor.id ? { ...m, assigned_cohort: cohortLabel } : m))
      );
      alert(`✅ Successfully assigned ${mentor.display_name} to Cohort Batch '${cohortLabel}'!`);
    } catch (err) {
      alert("Failed to assign cohort to mentor.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", color: "#0f172a" }}>
              Mentor Directory & Cohort Allocation ({mentors.length} Total)
            </h1>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
              Manage active mentors and assign them to active or upcoming internship cohort batches.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/admin/add-cohort" style={{ padding: "10px 16px", backgroundColor: "#059669", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
              + Create Cohort
            </Link>
            <Link to="/admin/add-mentor" className={styles.addBtn}>
              + Add Mentor
            </Link>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading database mentor records...</p>
        ) : mentors.length === 0 ? (
          <p style={{ color: "#64748b" }}>No mentor accounts found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mentor Name & Email</th>
                  <th>Assigned Track</th>
                  <th>Current Cohort Batch</th>
                  <th>Assign Active/Upcoming Cohort</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {mentors.map((mentor) => (
                  <tr key={mentor.id || mentor.email}>
                    <td style={{ padding: "1rem" }}>
                      <strong style={{ color: "#0f172a", fontSize: "15px", display: "block" }}>
                        {mentor.display_name}
                      </strong>
                      <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: 600 }}>
                        {mentor.email}
                      </span>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <span style={{ color: "#0284c7", fontWeight: 700, fontSize: "14px" }}>
                        {mentor.assigned_course}
                      </span>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        backgroundColor: mentor.assigned_cohort === "Not Assigned" ? "#f1f5f9" : "#ecfdf5",
                        color: mentor.assigned_cohort === "Not Assigned" ? "#64748b" : "#047857",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: 700
                      }}>
                        {mentor.assigned_cohort}
                      </span>
                    </td>

                    {/* Quick Cohort Assignment Dropdown & Button */}
                    <td style={{ padding: "1rem" }}>
                      {cohorts.length === 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>No Cohorts Available</span>
                          <Link to="/admin/add-cohort" style={{ fontSize: "12px", color: "#2563eb", fontWeight: "bold" }}>
                            + Create Cohort
                          </Link>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <select
                            value={selectedCohortMap[mentor.id] || ""}
                            onChange={(e) => handleCohortSelect(mentor.id, e.target.value)}
                            style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                          >
                            <option value="">Select Active Cohort ({cohorts.length})</option>
                            {cohorts.map((ch) => (
                              <option key={ch.id} value={ch.id}>
                                {ch.code} - {ch.name} ({ch.status || "Active"})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAssignCohort(mentor)}
                            style={{ padding: "6px 12px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}
                          >
                            Assign
                          </button>
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <span className={styles.status}>
                        {mentor.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td style={{ padding: "1rem" }}>
                      <div className={styles.actions}>
                        <Link to={`/admin/edit-mentor/${mentor.id}`}>Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mentors;