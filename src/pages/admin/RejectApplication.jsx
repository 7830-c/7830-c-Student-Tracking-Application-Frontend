import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RejectApplication.module.css";

function RejectApplication() {
  const navigate = useNavigate();

  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Application Rejected Successfully!");

    navigate("/admin/applications");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <h1>Reject Application</h1>

        <form onSubmit={handleSubmit}>

          <div className={styles.info}>
            <p><strong>Student:</strong> Rahul Kumar</p>
            <p><strong>Course:</strong> Java Full Stack</p>
            <p><strong>Company:</strong> Infosys</p>
          </div>

          <label>Rejection Reason</label>

          <textarea
            rows="6"
            placeholder="Enter rejection reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <div className={styles.buttons}>
            <button type="submit">
              Reject Application
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default RejectApplication;