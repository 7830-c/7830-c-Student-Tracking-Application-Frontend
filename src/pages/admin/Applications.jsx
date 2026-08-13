import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Applications.module.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

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

  const resolveName = (userObj, fallbackCode, fallbackEmail) => {
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
    if (fallbackCode) return fallbackCode;
    return "Registered Student";
  };

  useEffect(() => {
    let isMounted = true;
    const loadApplications = async () => {
      try {
        const [rawApps, rawUsers, rawStudents, rawCourses] = await Promise.all([
          fetchAllPages("/api/applications/"),
          fetchAllPages("/api/users/"),
          fetchAllPages("/api/students/"),
          fetchAllPages("/api/courses/"),
        ]);

        const usersMap = {};
        rawUsers.forEach((u) => { if (u?.id) usersMap[u.id] = u; });

        const stuMap = {};
        rawStudents.forEach((s) => {
          let uObj = s.user;
          if (typeof uObj === "string" && usersMap[uObj]) uObj = usersMap[uObj];
          if (s?.id) stuMap[s.id] = { ...s, user: uObj };
        });

        const crsMap = {};
        rawCourses.forEach((c) => { if (c?.id) crsMap[c.id] = c.name || c.title; });

        const studentOptionsMap = {};

        const hydrated = rawApps.map((a) => {
          let sName = a.student_name;
          let sEmail = a.student_email;

          if (!sName && a.student) {
            const studentObj = stuMap[a.student];
            if (studentObj && studentObj.user) {
              sName = resolveName(studentObj.user, studentObj.student_code, studentObj.user.email);
              sEmail = studentObj.user.email;
            } else if (usersMap[a.student]) {
              const u = usersMap[a.student];
              sName = resolveName(u, null, u.email);
              sEmail = u.email;
            }
          }

          let cName = a.course_name;
          if (!cName && a.course && crsMap[a.course]) {
            cName = crsMap[a.course];
          }

          const studentDisplay = sName || (typeof a.student === "object" ? a.student?.user?.first_name : "Registered Student");
          const courseDisplay = cName || (typeof a.course === "object" ? a.course?.name : "Course Track");

          if (studentDisplay && !studentOptionsMap[studentDisplay]) {
            studentOptionsMap[studentDisplay] = studentDisplay;
          }

          return {
            ...a,
            student_display: studentDisplay,
            student_email: sEmail || "N/A",
            course_display: courseDisplay,
          };
        });

        if (isMounted) {
          setApplications(hydrated);
          setCourses(rawCourses);
          setStudents(Object.keys(studentOptionsMap).sort());
        }
      } catch (err) {
        console.error("Failed to load applications:", err);
        if (isMounted) setApplications([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApplications();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredApplications = applications.filter((app) => {
    // 1. Search Query Filter (Student Name, Email, App Number, or Course)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = (app.student_display || "").toLowerCase().includes(q);
      const emailMatch = (app.student_email || "").toLowerCase().includes(q);
      const appNoMatch = (app.application_number || "").toLowerCase().includes(q);
      const courseMatch = (app.course_display || "").toLowerCase().includes(q);
      if (!nameMatch && !emailMatch && !appNoMatch && !courseMatch) return false;
    }

    // 2. Status Filter
    if (selectedStatus && app.status !== selectedStatus) {
      return false;
    }

    // 3. Course Filter
    if (selectedCourse && app.course_display !== selectedCourse) {
      return false;
    }

    // 4. Student Profile Filter
    if (selectedStudent && app.student_display !== selectedStudent) {
      return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSelectedCourse("");
    setSelectedStudent("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Application Management</h1>
          <p>Filter, search, and manage all student course applications</p>
        </div>
      </div>

      {/* 🔍 MULTI-FILTER & SEARCH BAR CONTROL PANEL 🔍 */}
      <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", alignItems: "center" }}>
          {/* Search Box */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "4px" }}>Search Applications</label>
            <input
              type="text"
              placeholder="Search by student, email, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          {/* Student Profile Filter */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "4px" }}>Student Profile</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
            >
              <option value="">All Student Profiles ({students.length})</option>
              {students.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Course / Track Filter */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "4px" }}>Course Track</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
            >
              <option value="">All Courses ({courses.length})</option>
              {courses.map((c) => (
                <option key={c.id} value={c.name || c.title}>{c.name || c.title}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "4px" }}>Workflow Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
            >
              <option value="">All Statuses</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="COHORT_ASSIGNED">COHORT_ASSIGNED</option>
            </select>
          </div>
        </div>

        {/* Status Bar & Reset */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>
            Showing <strong style={{ color: "#0f172a" }}>{filteredApplications.length}</strong> of <strong style={{ color: "#0f172a" }}>{applications.length}</strong> Applications
          </span>
          {(searchQuery || selectedStatus || selectedCourse || selectedStudent) && (
            <button
              type="button"
              onClick={resetFilters}
              style={{ background: "#f1f5f9", color: "#475569", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
            >
              ↺ Reset All Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading applications from the database...</p>
      ) : filteredApplications.length === 0 ? (
        <p style={{ color: "#64748b" }}>No applications match your selected filter criteria.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Application No.</th>
                <th>Student Candidate</th>
                <th>Course Track</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td><strong>{application.application_number || "APP-SYS"}</strong></td>
                  <td>
                    <strong style={{ color: "#0f172a", fontSize: "14px" }}>{application.student_display}</strong>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{application.student_email}</div>
                  </td>
                  <td><span style={{ color: "#2563eb", fontWeight: 600 }}>{application.course_display}</span></td>
                  <td
                    className={
                      application.status === "APPROVED" || application.status === "QUALIFIED"
                        ? styles.approved
                        : application.status === "REJECTED"
                        ? styles.rejected
                        : styles.pending
                    }
                  >
                    {application.status}
                  </td>
                  <td>
                    <Link to={`/admin/application-details/${application.id}`} className={styles.viewBtn}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Applications;