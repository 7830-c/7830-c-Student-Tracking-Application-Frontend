import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ApproveApplication.module.css";

function ApproveApplication() {
  const navigate = useNavigate();

  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Application Approved Successfully!");

    navigate("/admin/applications");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h1>Approve Application</h1>

        <form onSubmit={handleSubmit}>

          <div className={styles.info}>
            <p><strong>Student:</strong> Rahul Kumar</p>
            <p><strong>Course:</strong> Java Full Stack</p>
            <p><strong>Company:</strong> Infosys</p>
          </div>

          <label>Approval Remarks</label>

          <textarea
            rows="6"
            placeholder="Enter approval remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            required
          />

          <div className={styles.buttons}>
            <button type="submit">
              Approve Application
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default ApproveApplication;