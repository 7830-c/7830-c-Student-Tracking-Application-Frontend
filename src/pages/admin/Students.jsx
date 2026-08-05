import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { studentService } from "../../services/studentService";
import { courseService } from "../../services/courseService";
import { cohortService } from "../../services/cohortService";
import { normalizeListResponse } from "../../services/apiClient";
import styles from "./Students.module.css"; // Ensure your CSS handles basic flex layouts

function Students() {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cohorts, setCohorts] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(location.state?.preSelectedCourse || "");
  const [selectedCohort, setSelectedCohort] = useState(location.state?.preSelectedCohort || "");
  const [selectedStudent, setSelectedStudent] = useState(null); // For the Profile Modal
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [studentsRes, coursesRes, cohortsRes] = await Promise.all([
          studentService.getStudentProfiles(),
          courseService.getCourses(),
          cohortService.getCohorts(),
        ]);
        setStudents(normalizeListResponse(studentsRes));
        setCourses(normalizeListResponse(coursesRes));
        setCohorts(normalizeListResponse(cohortsRes));
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleAccess = async (studentId, isApproving) => {
    // AVAILABLE means Approved. NOT_AVAILABLE means Locked/Pending.
    const newStatus = isApproving ? "AVAILABLE" : "NOT_AVAILABLE";
    try {
      await studentService.patchStudentProfile(studentId, { status: newStatus });
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert("Failed to update student access.");
    }
  };

  const handleUpdateLSTBatch = async (studentId, batchName) => {
    try {
      // Patches the database instantly
      await studentService.patchStudentProfile(studentId, { lst_batch: batchName });
      // Updates the background table state
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, lst_batch: batchName } : s));
      // Updates the currently open modal instantly
      setSelectedStudent(prev => ({ ...prev, lst_batch: batchName }));
    } catch (err) {
      alert("Failed to update LST Batch. Ensure lst_batch exists in backend models!");
    }
  };

  // Filter Logic: Hierarchy + Search
  const filteredStudents = students.filter(student => {
    // 1. Course Filter (Assumes student.domain relates to course)
    if (selectedCourse && student.domain !== selectedCourse) return false;
    // 2. Cohort Filter (Assumes student.course_batch relates to cohort)
    if (selectedCohort && student.course_batch !== selectedCohort) return false;
    // 3. Search Bar Filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      const nameMatch = (student.user?.first_name + " " + student.user?.last_name).toLowerCase().includes(search);
      const codeMatch = student.student_code?.toLowerCase().includes(search);
      if (!nameMatch && !codeMatch) return false;
    }
    return true;
  });

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, color: "#111827", fontSize: "2rem" }}>Student Management</h1>
          <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>Manage, filter, and control access for all registered students.</p>
        </div>
        <Link to="/admin/add-student" style={{ padding: "10px 20px", backgroundColor: "#2563eb", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>+ Add Student</Link>
      </div>

      {/* Filters & Search Hierarchy */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <input
          type="text"
          placeholder="Search by name or student code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 2, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
        <select
          value={selectedCourse}
          onChange={(e) => { setSelectedCourse(e.target.value); setSelectedCohort(""); }}
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        >
          <option value="">All Courses / Domains</option>
          {courses.map(c => <option key={c.id} value={c.name || c.id}>{c.name}</option>)}
        </select>
        <select
          value={selectedCohort}
          onChange={(e) => setSelectedCohort(e.target.value)}
          disabled={!selectedCourse}
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: !selectedCourse ? "#f3f4f6" : "white" }}
        >
          <option value="">All Batches</option>
          {/* Only show cohorts for the selected course */}
          {cohorts.filter(c => c.course?.name === selectedCourse || c.course === selectedCourse).map(coh => (
            <option key={coh.id} value={coh.name || coh.id}>{coh.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "1rem", color: "#374151" }}>Student Name & Code</th>
              <th style={{ padding: "1rem", color: "#374151" }}>Domain & Batch</th>
              <th style={{ padding: "1rem", color: "#374151" }}>College</th>
              <th style={{ padding: "1rem", color: "#374151" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: "2rem", textAlign: "center" }}>Loading students...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No students match these filters.</td></tr>
            ) : (
              filteredStudents.map(student => {
                const isRemoved = student.status === "NOT_AVAILABLE";
                return (
                  <tr key={student.id} onClick={() => setSelectedStudent(student)} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: isRemoved ? "#fef2f2" : "white", cursor: "pointer" }}>
                    <td style={{ padding: "1rem" }}>
                      <strong>{student.user?.first_name} {student.user?.last_name}</strong>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{student.student_code}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ display: "block", fontWeight: "bold", color: "#4338ca" }}>{student.domain || "N/A"}</span>
                      <span style={{ fontSize: "12px", color: "#047857", fontWeight: "bold" }}>{student.course_batch || "N/A"}</span>
                      {student.offer_letter && (
                        <div style={{ marginTop: "8px" }}>
                          <a href={student.offer_letter.startsWith('http') ? student.offer_letter : `http://0.0.0.0:8001${student.offer_letter}`} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontSize: "13px", fontWeight: "bold", textDecoration: "underline" }}>
                            📄 View Offer Letter
                          </a>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "1rem", fontSize: "14px", color: "#4b5563" }}>{student.college || "N/A"}</td>
                    <td style={{ padding: "1rem" }} onClick={(e) => e.stopPropagation()}>
                      {isRemoved ? (
                        <button onClick={() => handleToggleAccess(student.id, true)} style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)" }}>
                          ✅ Approve Access
                        </button>
                      ) : (
                        <button onClick={() => { if (window.confirm("Are you sure you want to revoke this student's access to live classes? Their data will NOT be deleted.")) handleToggleAccess(student.id, false); }} style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)" }}>
                          ❌ Revoke Access
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🚨 FULL STUDENT PROFILE MODAL 🚨 */}
      {selectedStudent && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setSelectedStudent(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>✖</button>
            <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>{selectedStudent.user?.first_name} {selectedStudent.user?.last_name}</h2>
            <p style={{ color: "#6b7280", margin: "0 0 1.5rem 0" }}>{selectedStudent.user?.email} | {selectedStudent.student_code}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div><strong>Domain:</strong> {selectedStudent.domain || "N/A"}</div>
              <div><strong>Batch:</strong> {selectedStudent.course_batch || "N/A"}</div>
              <div><strong>College:</strong> {selectedStudent.college || "N/A"}</div>
              <div><strong>Phone:</strong> {selectedStudent.user?.phone_number || "N/A"}</div>
              <div><strong>City:</strong> {selectedStudent.city || "N/A"}</div>
              <div><strong>Degree:</strong> {selectedStudent.degree || "N/A"}</div>
            </div>

            {/* 🚨 LST BATCH ASSIGNMENT UI 🚨 */}
            <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
              <strong style={{ display: "block", marginBottom: "8px", color: "#166534" }}>Assign LST Batch:</strong>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "#374151", marginRight: "auto" }}>
                  Current: {selectedStudent.lst_batch || "Not Assigned"}
                </span>
                <button onClick={() => handleUpdateLSTBatch(selectedStudent.id, "Batch 1")} style={{ padding: "6px 12px", backgroundColor: selectedStudent.lst_batch === "Batch 1" ? "#15803d" : "#e5e7eb", color: selectedStudent.lst_batch === "Batch 1" ? "white" : "black", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Batch 1</button>
                <button onClick={() => handleUpdateLSTBatch(selectedStudent.id, "Batch 2")} style={{ padding: "6px 12px", backgroundColor: selectedStudent.lst_batch === "Batch 2" ? "#15803d" : "#e5e7eb", color: selectedStudent.lst_batch === "Batch 2" ? "white" : "black", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Batch 2</button>
                <button onClick={() => handleUpdateLSTBatch(selectedStudent.id, "")} style={{ padding: "6px 12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Clear</button>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <strong>Bio:</strong>
              <p style={{ backgroundColor: "#f3f4f6", padding: "10px", borderRadius: "8px", margin: "8px 0 0 0" }}>{selectedStudent.bio || "No bio provided."}</p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <strong>Skills:</strong>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                {(selectedStudent.skills || []).map((skill, idx) => (
                  <span key={idx} style={{ backgroundColor: "#e0e7ff", color: "#4338ca", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>{skill}</span>
                ))}
                {(!selectedStudent.skills || selectedStudent.skills.length === 0) && <span style={{ color: "#6b7280" }}>No skills listed.</span>}
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              {selectedStudent.offer_letter && (
                <a href={selectedStudent.offer_letter.startsWith('http') ? selectedStudent.offer_letter : `http://0.0.0.0:8001${selectedStudent.offer_letter}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "10px", backgroundColor: "#2563eb", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>View Offer Letter</a>
              )}
              {selectedStudent.resume && (
                <a href={selectedStudent.resume.startsWith('http') ? selectedStudent.resume : `http://0.0.0.0:8001${selectedStudent.resume}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "10px", backgroundColor: "#10b981", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>View Resume</a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;