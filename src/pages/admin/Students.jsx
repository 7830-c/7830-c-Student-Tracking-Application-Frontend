import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { studentService } from "../../services/studentService";
import apiClient from "../../services/apiClient";
import styles from "./Students.module.css";

function Students() {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cohorts, setCohorts] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(location.state?.preSelectedCourse || "");
  const [selectedCohort, setSelectedCohort] = useState(location.state?.preSelectedCohort || "");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    return "Student Candidate";
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [rawStudents, rawCourses, rawCohorts, rawUsers] = await Promise.all([
          fetchAllPages("/api/students/"),
          fetchAllPages("/api/courses/"),
          fetchAllPages("/api/cohorts/"),
          fetchAllPages("/api/users/"),
        ]);

        const usersMap = {};
        rawUsers.forEach((u) => { if (u?.id) usersMap[u.id] = u; });

        const studentUserIdsInProfiles = new Set();
        const stuList = [];

        rawStudents.forEach((s) => {
          let userObj = s.user;
          if (typeof userObj === "string" && usersMap[userObj]) {
            userObj = usersMap[userObj];
          }
          if (userObj && typeof userObj === "object" && userObj.role && userObj.role !== "STUDENT") {
            return;
          }
          if (typeof userObj === "object" && userObj?.id) {
            studentUserIdsInProfiles.add(userObj.id);
          }
          const displayName = resolveName(userObj, s.student_code, s.email);
          stuList.push({
            ...s,
            display_name: displayName,
            user: typeof userObj === "object" ? userObj : { first_name: displayName, last_name: "", email: s.email || "N/A" },
          });
        });

        rawUsers.filter((u) => u.role === "STUDENT" && !studentUserIdsInProfiles.has(u.id)).forEach((u) => {
          const displayName = resolveName(u, `STU-${u.id.substring(0, 6).toUpperCase()}`, u.email);
          stuList.push({
            id: u.id,
            user: u,
            display_name: displayName,
            student_code: `STU-${u.id.substring(0, 6).toUpperCase()}`,
            authoritative_domain: "General Track",
            authoritative_course_batch: "Not Assigned",
            domain: "General Track",
            course_batch: "Not Assigned",
          });
        });

        setStudents(stuList);
        setCourses(rawCourses);
        setCohorts(rawCohorts);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedStudent(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleAccess = async (studentId, isApproving) => {
    const newStatus = isApproving ? "AVAILABLE" : "NOT_AVAILABLE";
    try {
      await studentService.patchStudentProfile(studentId, { status: newStatus });
      setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s)));
    } catch (err) {
      alert("Failed to update student access.");
    }
  };

  const filteredStudents = students.filter((student) => {
    if (selectedCourse && student.domain !== selectedCourse && student.authoritative_domain !== selectedCourse) return false;
    if (selectedCohort && student.course_batch !== selectedCohort && student.authoritative_course_batch !== selectedCohort) return false;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      const nameMatch = (student.display_name || "").toLowerCase().includes(search);
      const emailMatch = (student.user?.email || "").toLowerCase().includes(search);
      const codeMatch = (student.student_code || "").toLowerCase().includes(search);
      if (!nameMatch && !emailMatch && !codeMatch) return false;
    }
    return true;
  });

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, color: "#111827", fontSize: "2rem" }}>Student Management</h1>
          <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>Manage, filter, edit, and control access for all registered students.</p>
        </div>
        <Link to="/admin/add-student" style={{ padding: "10px 20px", backgroundColor: "#2563eb", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>+ Add Student</Link>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <input
          type="text"
          placeholder="Search by name, email, or student code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 2, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        >
          <option value="">All Domains</option>
          {courses.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={selectedCohort}
          onChange={(e) => setSelectedCohort(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        >
          <option value="">{cohorts.length ? "All Cohort Batches" : "No Cohorts Created Yet"}</option>
          {cohorts.map((ch) => (
            <option key={ch.id} value={ch.code}>{ch.code} - {ch.name}</option>
          ))}
        </select>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "1rem", color: "#374151" }}>Student Name & Email</th>
              <th style={{ padding: "1rem", color: "#374151" }}>Domain & Batch</th>
              <th style={{ padding: "1rem", color: "#374151" }}>College / Institution</th>
              <th style={{ padding: "1rem", color: "#374151" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: "2rem", textAlign: "center" }}>Loading students...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No students match these filters.</td></tr>
            ) : (
              filteredStudents.map((student) => {
                const isRemoved = student.status === "NOT_AVAILABLE";
                const batchDisplay = student.authoritative_course_batch || student.course_batch || "Not Assigned";
                return (
                  <tr key={student.id} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: isRemoved ? "#fef2f2" : "white" }}>
                    <td style={{ padding: "1rem" }}>
                      <strong style={{ color: "#0f172a", fontSize: "1rem" }}>{student.display_name}</strong>
                      <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 600 }}>{student.user?.email || student.email}</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>{student.student_code}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ display: "block", fontWeight: "bold", color: "#4338ca" }}>{student.authoritative_domain || student.domain || "General"}</span>
                      <span style={{ fontSize: "12px", color: batchDisplay === "Not Assigned" ? "#64748b" : "#047857", fontWeight: "bold" }}>{batchDisplay}</span>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "14px", color: "#4b5563" }}>{student.college || student.user?.college || "Visakhapatnam Inst."}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(student)}
                          style={{ padding: "8px 14px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
                        >
                          View Profile
                        </button>
                        {isRemoved ? (
                          <button type="button" onClick={() => handleToggleAccess(student.id, true)} style={{ padding: "8px 14px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                            Approve
                          </button>
                        ) : (
                          <button type="button" onClick={() => { if (window.confirm("Revoke access for this student?")) handleToggleAccess(student.id, false); }} style={{ padding: "8px 14px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🚨 PROFILE MODAL 🚨 */}
      {selectedStudent && (
        <div
          onClick={() => setSelectedStudent(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", width: "90%", maxWidth: "600px", maxHeight: "85vh", overflowY: "auto", position: "relative", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)" }}
          >
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "#f1f5f9", border: "none", fontSize: "1.2rem", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontWeight: "bold" }}
            >
              ✕
            </button>
            <h2 style={{ marginTop: 0, marginBottom: "0.25rem", color: "#0f172a" }}>{selectedStudent.display_name}</h2>
            <p style={{ color: "#2563eb", fontWeight: 600, margin: "0 0 1.5rem 0" }}>{selectedStudent.user?.email || selectedStudent.email} | {selectedStudent.student_code}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem", background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div><strong style={{ color: "#64748b" }}>Domain:</strong> <div style={{ fontWeight: 700, color: "#4338ca" }}>{selectedStudent.authoritative_domain || selectedStudent.domain || "General Track"}</div></div>
              <div><strong style={{ color: "#64748b" }}>Batch:</strong> <div style={{ fontWeight: 700, color: "#047857" }}>{selectedStudent.authoritative_course_batch || selectedStudent.course_batch || "Not Assigned"}</div></div>
              <div><strong style={{ color: "#64748b" }}>College:</strong> <div style={{ fontWeight: 600 }}>{selectedStudent.college || selectedStudent.user?.college || "Visakhapatnam Inst."}</div></div>
              <div><strong style={{ color: "#64748b" }}>Phone:</strong> <div style={{ fontWeight: 600 }}>{selectedStudent.user?.phone_number || selectedStudent.phone_number || selectedStudent.phone || "N/A"}</div></div>
              <div><strong style={{ color: "#64748b" }}>City:</strong> <div style={{ fontWeight: 600 }}>{selectedStudent.city || selectedStudent.user?.city || "Visakhapatnam"}</div></div>
              <div><strong style={{ color: "#64748b" }}>Degree:</strong> <div style={{ fontWeight: 600 }}>{selectedStudent.degree || selectedStudent.user?.degree || "B.Tech"}</div></div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link
                to={`/admin/edit-student/${selectedStudent.id}`}
                style={{ padding: "10px 20px", background: "#f59e0b", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "14px" }}
              >
                Edit Student Profile
              </Link>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                style={{ padding: "10px 24px", background: "#dc2626", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;