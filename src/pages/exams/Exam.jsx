import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Exam.module.css";

function Exam() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [examSession, setExamSession] = useState(location.state?.examSession || null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStates, setQuestionStates] = useState({}); // { [qId]: 'ANSWERED' | 'NOT_ANSWERED' | 'MARKED' | 'ANSWERED_MARKED' | 'NOT_VISITED' }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Security / Proctoring
  const [cheatCount, setCheatCount] = useState(0);
  const [cheatLogs, setCheatLogs] = useState([]);
  const [securityModalText, setSecurityModalText] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(30 * 60); // Default 30 minutes in seconds

  const syncTimerRef = useRef(null);

  // Load Exam Session on Mount
  useEffect(() => {
    let isMounted = true;

    const initExam = async () => {
      try {
        let sessionData = location.state?.examSession;
        if (!sessionData) {
          const res = await apiClient.post(API_ENDPOINTS.EXAMS.START);
          sessionData = res.data?.exam || res.data;
        }

        if (isMounted && sessionData) {
          setExamSession(sessionData);

          const qList = sessionData.questions_detail || sessionData.questions || [];
          setQuestions(qList);

          const savedAnswers = sessionData.answers || {};
          setAnswers(savedAnswers);

          const savedStates = sessionData.question_states || {};
          setQuestionStates(savedStates);

          setCheatCount(sessionData.cheat_count || 0);
          setCheatLogs(sessionData.cheat_logs || []);

          // Calculate remaining time
          const durationMins = sessionData.duration_minutes || 30;
          let remainingSecs = durationMins * 60;
          if (sessionData.started_at) {
            const startMs = new Date(sessionData.started_at).getTime();
            const elapsedSecs = Math.floor((Date.now() - startMs) / 1000);
            remainingSecs = Math.max(0, durationMins * 60 - elapsedSecs);
          }
          setTimeLeft(remainingSecs);

          // Mark first question as NOT_ANSWERED if NOT_VISITED
          if (qList.length > 0) {
            const firstId = qList[0].id;
            if (!savedStates[firstId]) {
              setQuestionStates((prev) => ({ ...prev, [firstId]: "NOT_ANSWERED" }));
            }
          }
        }
      } catch (err) {
        console.error("Failed to initialize exam session:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initExam();
    return () => {
      isMounted = false;
    };
  }, [location.state]);

  // Submit Exam API Handler
  const handleFinalSubmit = useCallback(async () => {
    if (submitting || !examSession?.id) return;
    setSubmitting(true);

    try {
      const res = await apiClient.post(API_ENDPOINTS.EXAMS.SUBMIT(examSession.id), {
        answers,
        question_states: questionStates,
        cheat_logs: cheatLogs,
        cheat_count: cheatCount,
      });

      const evaluated = res.data?.exam || res.data;
      
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      navigate("/student/exam-result", { state: { examResult: evaluated, questions } });
    } catch (err) {
      console.error("Failed to submit exam:", err);
      alert("Submission error. Retrying submission...");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, examSession, answers, questionStates, cheatLogs, cheatCount, questions, navigate]);

  // Countdown Timer Hook
  useEffect(() => {
    if (loading || !examSession || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Auto-submit when timer expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examSession, submitting, handleFinalSubmit]);

  // Periodic Background Progress Sync
  useEffect(() => {
    if (loading || !examSession?.id || submitting) return;

    syncTimerRef.current = setInterval(() => {
      apiClient
        .post(API_ENDPOINTS.EXAMS.SYNC(examSession.id), {
          answers,
          question_states: questionStates,
          cheat_logs: cheatLogs,
          cheat_count: cheatCount,
        })
        .catch((err) => console.warn("Background sync warning:", err));
    }, 15000);

    return () => {
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    };
  }, [loading, examSession, answers, questionStates, cheatLogs, cheatCount, submitting]);

  // Anti-Cheating & Security Listeners
  const logSecurityViolation = useCallback((type, message) => {
    const violationEvent = {
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    setCheatCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 3) {
        const courseId = location.state?.selectedCourse || examSession?.course_id || "default_med";
        localStorage.setItem(`sure_exam_disqualified_${courseId}`, "true");
        setTimeout(() => {
          alert("🚨 DISQUALIFIED: You have reached 3 anti-cheating violations. Your exam has been forcibly submitted and flagged.");
          handleFinalSubmit();
        }, 100);
      }
      return nextCount;
    });

    setCheatLogs((prev) => [...prev, violationEvent]);
    setSecurityModalText(message);
  }, [location.state, examSession, handleFinalSubmit]);

  useEffect(() => {
    if (loading || submitting) return;

    // 1. Fullscreen exit detection
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logSecurityViolation("FULLSCREEN_EXIT", "Security Alert: Full-screen mode was exited! Please stay in full-screen mode during the exam.");
      }
    };

    // 2. Tab switch / Window focus loss
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityViolation("TAB_SWITCH", "Security Alert: Tab switch or browser minimize detected! This activity is logged as a cheating violation.");
      }
    };

    const handleWindowBlur = () => {
      logSecurityViolation("WINDOW_BLUR", "Security Alert: Browser lost focus. Switching applications is strictly prohibited.");
    };

    // 3. Disable Right Click, Copy, Cut, Paste, Select
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyCutPaste = (e) => e.preventDefault();

    // 4. Disable inspection keyboard shortcuts
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "c" || e.key === "v" || e.key === "a"))
      ) {
        e.preventDefault();
        logSecurityViolation("KEYBOARD_SHORTCUT", `Keyboard shortcut '${e.key}' blocked.`);
      }
    };

    // 5. Prevent accidental refresh or back navigation
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your exam progress will be affected.";
      return e.returnValue;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCutPaste);
    document.addEventListener("cut", handleCopyCutPaste);
    document.addEventListener("paste", handleCopyCutPaste);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loading, submitting, logSecurityViolation]);

  // Question Navigation & Option Selection
  const activeQuestion = questions[currentIndex];
  const activeQId = activeQuestion?.id;

  const handleSelectOption = (optionValue) => {
    if (!activeQId) return;
    setAnswers((prev) => ({ ...prev, [activeQId]: optionValue }));

    // If marked, set to ANSWERED_MARKED else ANSWERED
    const currentState = questionStates[activeQId];
    if (currentState === "MARKED" || currentState === "ANSWERED_MARKED") {
      setQuestionStates((prev) => ({ ...prev, [activeQId]: "ANSWERED_MARKED" }));
    } else {
      setQuestionStates((prev) => ({ ...prev, [activeQId]: "ANSWERED" }));
    }
  };

  const handleSaveAndNext = () => {
    if (activeQId) {
      if (answers[activeQId]) {
        const cur = questionStates[activeQId];
        if (cur !== "ANSWERED_MARKED") {
          setQuestionStates((prev) => ({ ...prev, [activeQId]: "ANSWERED" }));
        }
      } else {
        setQuestionStates((prev) => ({ ...prev, [activeQId]: "NOT_ANSWERED" }));
      }
    }

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextId = questions[nextIdx].id;
      if (!questionStates[nextId]) {
        setQuestionStates((prev) => ({ ...prev, [nextId]: "NOT_ANSWERED" }));
      }
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (activeQId) {
      if (answers[activeQId]) {
        setQuestionStates((prev) => ({ ...prev, [activeQId]: "ANSWERED_MARKED" }));
      } else {
        setQuestionStates((prev) => ({ ...prev, [activeQId]: "MARKED" }));
      }
    }

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextId = questions[nextIdx].id;
      if (!questionStates[nextId]) {
        setQuestionStates((prev) => ({ ...prev, [nextId]: "NOT_ANSWERED" }));
      }
    }
  };

  const handleClearResponse = () => {
    if (!activeQId) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[activeQId];
      return copy;
    });
    setQuestionStates((prev) => ({ ...prev, [activeQId]: "NOT_ANSWERED" }));
  };

  const handleTileClick = (index) => {
    // Set current active state before jumping
    if (activeQId && !questionStates[activeQId]) {
      setQuestionStates((prev) => ({ ...prev, [activeQId]: "NOT_ANSWERED" }));
    }

    setCurrentIndex(index);
    const targetId = questions[index].id;
    if (!questionStates[targetId]) {
      setQuestionStates((prev) => ({ ...prev, [targetId]: "NOT_ANSWERED" }));
    }
  };

  // Re-enter Fullscreen Helper
  const reEnterFullscreen = async () => {
    setSecurityModalText(null);
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen request error:", e);
    }
  };

  // Palette State Counters
  const getCounts = () => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let ansMarked = 0;
    let notVisited = 0;

    questions.forEach((q) => {
      const state = questionStates[q.id] || "NOT_VISITED";
      if (state === "ANSWERED") answered++;
      else if (state === "NOT_ANSWERED") notAnswered++;
      else if (state === "MARKED") marked++;
      else if (state === "ANSWERED_MARKED") ansMarked++;
      else notVisited++;
    });

    return { answered, notAnswered, marked, ansMarked, notVisited };
  };

  const counts = getCounts();

  // Format Timer String MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading NTA Examination Portal...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h2>No Exam Questions Available</h2>
        <p>Questions could not be loaded for your test domain.</p>
        <button onClick={() => navigate("/student/dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className={styles.ntaExamPortal}>
      {/* Top Header Bar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.ntaLogo}>SURE ProEd Exam</div>
          <span className={styles.domainBadge}>
            Domain: {examSession?.course_name || examSession?.domain || "General"}
          </span>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.candidateDetails}>
            <span>Candidate: <strong>{examSession?.student_name || "Student"}</strong></span>
            <span>Subject: <strong>{activeQuestion?.subject || activeQuestion?.domain || "MCQ Test"}</strong></span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={`${styles.timerBox} ${timeLeft < 300 ? styles.timerWarning : ""}`}>
            <span className={styles.timerLabel}>Time Left:</span>
            <span className={styles.timerClock}>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Security Violation Alert Modal */}
      {securityModalText && (
        <div className={styles.modalOverlay}>
          <div className={styles.securityModal}>
            <div className={styles.warningIcon}>⚠️</div>
            <h2>Security Warning</h2>
            <p>{securityModalText}</p>
            <div className={styles.violationCount}>
              Total Cheating Violations Recorded: <strong>{cheatCount}</strong>
            </div>
            <button type="button" className={styles.warningButton} onClick={reEnterFullscreen}>
              Return to Exam (Full-Screen)
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.submitModal}>
            <h2>Confirm Exam Submission</h2>
            <p>Are you sure you want to submit your examination?</p>

            <div className={styles.summaryGrid}>
              <div className={`${styles.summaryItem} ${styles.bgGreen}`}>
                <span>Answered</span>
                <strong>{counts.answered}</strong>
              </div>
              <div className={`${styles.summaryItem} ${styles.bgRed}`}>
                <span>Not Answered</span>
                <strong>{counts.notAnswered}</strong>
              </div>
              <div className={`${styles.summaryItem} ${styles.bgPurple}`}>
                <span>Marked for Review</span>
                <strong>{counts.marked}</strong>
              </div>
              <div className={`${styles.summaryItem} ${styles.bgPurpleStar}`}>
                <span>Answered & Marked</span>
                <strong>{counts.ansMarked}</strong>
              </div>
              <div className={`${styles.summaryItem} ${styles.bgGray}`}>
                <span>Not Visited</span>
                <strong>{counts.notVisited}</strong>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
              >
                Resume Examination
              </button>
              <button
                type="button"
                className={styles.confirmSubmitBtn}
                onClick={handleFinalSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Yes, Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Examination Workspace */}
      <div className={styles.mainLayout}>
        {/* Left Section: Question & Options */}
        <section className={styles.questionPanel}>
          <div className={styles.questionHeader}>
            <span className={styles.qNumLabel}>
              Question No. {currentIndex + 1} of {questions.length}
            </span>
            <span className={styles.marksLabel}>Marks: +1.0 | -0.0</span>
          </div>

          <div className={styles.questionContent}>
            <h3 className={styles.questionText}>{activeQuestion?.question}</h3>

            <div className={styles.optionsList}>
              {(activeQuestion?.options || []).map((optionStr, optIdx) => {
                const optKey = String.fromCharCode(65 + optIdx); // A, B, C, D
                const isSelected = answers[activeQId] === optionStr || answers[activeQId] === optKey;

                return (
                  <label
                    key={optIdx}
                    className={`${styles.optionCard} ${isSelected ? styles.optionSelected : ""}`}
                  >
                    <input
                      type="radio"
                      name={`question_${activeQId}`}
                      value={optionStr}
                      checked={isSelected}
                      onChange={() => handleSelectOption(optionStr)}
                    />
                    <span className={styles.optionKey}>{optKey}.</span>
                    <span className={styles.optionVal}>{optionStr}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bottom Toolbar Controls */}
          <footer className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button
                type="button"
                className={styles.btnMarkReview}
                onClick={handleMarkForReviewAndNext}
              >
                Mark for Review & Next
              </button>
              <button
                type="button"
                className={styles.btnClear}
                onClick={handleClearResponse}
              >
                Clear Response
              </button>
            </div>

            <div className={styles.toolbarRight}>
              <button
                type="button"
                className={styles.btnSaveNext}
                onClick={handleSaveAndNext}
              >
                Save & Next
              </button>
              <button
                type="button"
                className={styles.btnSubmit}
                onClick={() => setShowSubmitModal(true)}
              >
                Submit Exam
              </button>
            </div>
          </footer>
        </section>

        {/* Right Section: Question Palette Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.profileBox}>
            <div className={styles.avatarCircle}>
              {examSession?.student_name ? examSession.student_name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className={styles.profileMeta}>
              <strong>{examSession?.student_name || "Student"}</strong>
              <small>Candidate</small>
            </div>
          </div>

          {/* 1. TOP: Choose Question Panel */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid #cbd5e1", marginBottom: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#1e293b", letterSpacing: "0.5px" }}>
                Choose a Question
              </h4>
              <span style={{ fontSize: "0.78rem", background: "#e0f2fe", color: "#0284c7", fontWeight: 700, padding: "2px 8px", borderRadius: "12px" }}>
                {questions.length} Questions
              </span>
            </div>

            {/* 5 Columns Flex Wrap Square Buttons Grid */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                maxHeight: "260px",
                overflowY: "auto",
                padding: "4px 2px",
                boxSizing: "border-box"
              }}
            >
              {questions.map((q, idx) => {
                const state = questionStates[q.id] || "NOT_VISITED";
                const isCurrent = idx === currentIndex;

                // Color mappings
                let bg = "#e2e8f0";
                let text = "#1e293b";
                let border = "#cbd5e1";

                if (state === "ANSWERED") {
                  bg = "#16a34a";
                  text = "#ffffff";
                  border = "#15803d";
                } else if (state === "NOT_ANSWERED") {
                  bg = "#dc2626";
                  text = "#ffffff";
                  border = "#b91c1c";
                } else if (state === "MARKED") {
                  bg = "#8b5cf6";
                  text = "#ffffff";
                  border = "#7c3aed";
                } else if (state === "ANSWERED_MARKED") {
                  bg = "#7c3aed";
                  text = "#ffffff";
                  border = "#6d28d9";
                }

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => handleTileClick(idx)}
                    style={{
                      width: "42px",
                      height: "42px",
                      minWidth: "42px",
                      minHeight: "42px",
                      maxWidth: "42px",
                      maxHeight: "42px",
                      borderRadius: "8px",
                      background: bg,
                      color: text,
                      border: isCurrent ? "3px solid #0284c7" : `1px solid ${border}`,
                      boxShadow: isCurrent ? "0 0 0 2px #38bdf8" : "none",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: 0,
                      padding: 0,
                      boxSizing: "border-box",
                      flexShrink: 0,
                      position: "relative"
                    }}
                  >
                    {idx + 1}
                    {state === "ANSWERED_MARKED" && (
                      <span style={{ position: "absolute", top: "1px", right: "3px", fontSize: "0.55rem" }}>★</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. LOWER: Question Legend */}
          <div style={{ background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.5px" }}>
              Question Legend
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#334155" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem" }}>{counts.answered}</span>
                <span>Answered</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#334155" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#dc2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem" }}>{counts.notAnswered}</span>
                <span>Not Answered</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#334155" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#e2e8f0", color: "#1e293b", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem" }}>{counts.notVisited}</span>
                <span>Not Visited</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#334155" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#8b5cf6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem" }}>{counts.marked}</span>
                <span>Marked</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#334155", gridColumn: "span 2" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem" }}>{counts.ansMarked}</span>
                <span>Ans & Marked</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Exam;