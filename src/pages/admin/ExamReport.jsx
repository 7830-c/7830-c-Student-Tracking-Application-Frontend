import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import styles from "./ExamReport.module.css";

function ExamReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domainFilter, setDomainFilter] = useState("");
  const [flaggedFilter, setFlaggedFilter] = useState(false);

  const parseList = (resData) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (resData && Array.isArray(resData.results)) return resData.results;
    return [];
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
    return "Student Candidate";
  };

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        const [examsRes, appsRes, stuRes, crsRes, usersRes] = await Promise.all([
          apiClient.get("/api/exams/?page_size=1000").catch(() => null),
          apiClient.get("/api/applications/?page_size=1000").catch(() => null),
          apiClient.get("/api/students/?page_size=1000").catch(() => null),
          apiClient.get("/api/courses/?page_size=1000").catch(() => null),
          apiClient.get("/api/users/?page_size=1000").catch(() => null),
        ]);

        const rawExams = parseList(examsRes?.data);
        const rawApps = parseList(appsRes?.data);
        const rawStudents = parseList(stuRes?.data);
        const rawCourses = parseList(crsRes?.data);
        const rawUsers = parseList(usersRes?.data);

        const usersMap = {};
        rawUsers.forEach((u) => { if (u?.id) usersMap[u.id] = u; });

        const studentsMap = {};
        rawStudents.forEach((s) => {
          let uObj = s.user;
          if (typeof uObj === "string" && usersMap[uObj]) uObj = usersMap[uObj];
          if (s?.id) studentsMap[s.id] = { ...s, user: uObj };
        });

        const coursesMap = {};
        rawCourses.forEach((c) => { if (c?.id) coursesMap[c.id] = c.name || c.title; });

        const appsMap = {};
        rawApps.forEach((a) => {
          let sName = a.student_name;
          let sEmail = a.student_email;
          if (!sName && a.student) {
            const stu = studentsMap[a.student];
            if (stu && stu.user) {
              sName = resolveName(stu.user, stu.user.email);
              sEmail = stu.user.email;
            } else if (usersMap[a.student]) {
              const u = usersMap[a.student];
              sName = resolveName(u, u.email);
              sEmail = u.email;
            }
          }
          let cName = a.course_name;
          if (!cName && a.course && coursesMap[a.course]) {
            cName = coursesMap[a.course];
          }
          if (a?.id) appsMap[a.id] = { ...a, student_name: sName, student_email: sEmail, course_name: cName };
        });

        const hydratedExams = rawExams.map((e) => {
          let sName = e.student_name || e.candidate_name;
          let sEmail = e.student_email || e.candidate_email;
          let cName = e.course_name || e.domain;

          if (e.application && appsMap[e.application]) {
            const app = appsMap[e.application];
            if (app.student_name) sName = app.student_name;
            if (app.student_email) sEmail = app.student_email;
            if (app.course_name) cName = app.course_name;
          }

          if (!sName && e.student && studentsMap[e.student]) {
            const stu = studentsMap[e.student];
            if (stu.user) {
              sName = resolveName(stu.user, stu.user.email);
              sEmail = stu.user.email;
            }
          }

          if (!sName && e.user && usersMap[e.user]) {
            const u = usersMap[e.user];
            sName = resolveName(u, u.email);
            sEmail = u.email;
          }

          const cheatLogs = Array.isArray(e.cheat_logs) ? e.cheat_logs : (e.proctoring_data?.cheat_logs || []);
          const cheatCount = typeof e.cheat_count === "number" ? e.cheat_count : cheatLogs.length;

          return {
            ...e,
            student_name: sName || resolveName(null, sEmail) || "Registered Candidate",
            student_email: sEmail || "N/A",
            course_name: cName || "Medical Coding",
            cheat_count: cheatCount,
            cheat_logs: cheatLogs,
          };
        });

        if (isMounted) setReports(hydratedExams);
      } catch (err) {
        console.error("Failed to load exam reports:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReports = reports.filter((r) => {
    if (domainFilter && r.course_name !== domainFilter && r.domain !== domainFilter) return false;
    if (flaggedFilter && r.cheat_count <= 0) return false;
    return true;
  });

  const handleDownloadCSV = () => {
    if (!reports || !reports.length) {
      alert("No exam report records available to export.");
      return;
    }
    const headers = ["Candidate Name", "Email", "Domain Track", "Score", "Percentage", "Qualified Status", "Cheat Violations"];
    const rows = reports.map((e) => [
      e.student_name || "Candidate",
      e.student_email || "N/A",
      e.course_name || e.domain || "General",
      `${e.marks_obtained || 0} / ${e.total_marks || 0}`,
      `${e.percentage || 0}%`,
      e.qualified ? "QUALIFIED" : "NOT QUALIFIED",
      e.cheat_count || 0,
    ]);
    const escapedRows = rows.map((row) =>
      row.map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...escapedRows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Screening_Exams_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalExams = reports.length;
  const flaggedCount = reports.filter((r) => r.cheat_count > 0).length;
  const avgScore = totalExams > 0 ? (reports.reduce((acc, r) => acc + (parseFloat(r.percentage) || 0), 0) / totalExams).toFixed(1) : 0;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>
            Screening Exam & Anti-Cheating Reports
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            Audit candidate scores, qualification status, and live anti-cheating violation logs
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadCSV}
          style={{ background: "#16a34a", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
        >
          📥 Export CSV Report
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>Total Exams Evaluated</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>{totalExams}</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#dc2626", fontSize: "0.85rem", fontWeight: 600 }}>Flagged Cheating Sessions</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#dc2626", marginTop: "4px" }}>{flaggedCount}</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ color: "#2563eb", fontSize: "0.85rem", fontWeight: 600 }}>Average Percentage</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#2563eb", marginTop: "4px" }}>{avgScore}%</div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading exam report analytics...</p>
      ) : (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>Candidate Name & Email</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Domain Track</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Score & %</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Cheat Violations</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem" }}>
                    <strong style={{ color: "#0f172a", display: "block" }}>{r.student_name}</strong>
                    <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 600 }}>{r.student_email}</div>
                  </td>
                  <td style={{ padding: "1rem", color: "#334155", fontWeight: 600 }}>{r.course_name}</td>
                  <td style={{ padding: "1rem" }}>
                    <strong>{r.marks_obtained || 0} / {r.total_marks || 0}</strong>
                    <span style={{ marginLeft: "8px", fontSize: "13px", color: "#2563eb", fontWeight: 700 }}>({r.percentage || 0}%)</span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {r.cheat_count > 0 ? (
                      <span style={{ background: "#fef2f2", color: "#dc2626", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700 }}>
                        ⚠️ {r.cheat_count} Violations
                      </span>
                    ) : (
                      <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700 }}>
                        ✓ Clean
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {r.qualified ? (
                      <span style={{ background: "#dcfce7", color: "#15803d", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 800 }}>
                        QUALIFIED
                      </span>
                    ) : (
                      <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 800 }}>
                        NOT QUALIFIED
                      </span>
                    )}
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

export default ExamReport;