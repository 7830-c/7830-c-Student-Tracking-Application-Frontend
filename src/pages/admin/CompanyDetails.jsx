import { Link } from "react-router-dom";
import styles from "./CompanyDetails.module.css";

function CompanyDetails() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Company Details</h1>

        <div className={styles.info}>
          <div>
            <span>Company Name</span>
            <h3>Infosys</h3>
          </div>

          <div>
            <span>Location</span>
            <h3>Hyderabad</h3>
          </div>

          <div>
            <span>Email</span>
            <h3>careers@infosys.com</h3>
          </div>

          <div>
            <span>Phone</span>
            <h3>+91 9876543210</h3>
          </div>

          <div>
            <span>Industry</span>
            <h3>Information Technology</h3>
          </div>

          <div>
            <span>Total Openings</span>
            <h3>12</h3>
          </div>

          <div>
            <span>Status</span>
            <h3 className={styles.active}>Active</h3>
          </div>
        </div>

        <div className={styles.buttons}>
          <Link to="/admin/edit-company" className={styles.edit}>
            Edit Company
          </Link>

          <Link to="/admin/companies" className={styles.back}>
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;