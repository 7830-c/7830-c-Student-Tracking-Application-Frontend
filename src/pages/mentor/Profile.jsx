import styles from "./Profile.module.css";

function Profile() {
  return (
    <div className={styles.container}>

      <div className={styles.card}>

        <div className={styles.profileHeader}>

          <img
            src="https://via.placeholder.com/120"
            alt="Mentor"
            className={styles.avatar}
          />

          <div>
            <h2>Rahul Kumar</h2>
            <p>Senior Java Full Stack Mentor</p>
          </div>

        </div>

        <form className={styles.form}>

          <div className={styles.group}>
            <label>Full Name</label>
            <input type="text" defaultValue="Rahul Kumar" />
          </div>

          <div className={styles.group}>
            <label>Email</label>
            <input
              type="email"
              defaultValue="rahul@gmail.com"
            />
          </div>

          <div className={styles.group}>
            <label>Phone</label>
            <input
              type="text"
              defaultValue="+91 9876543210"
            />
          </div>

          <div className={styles.group}>
            <label>Experience</label>
            <input
              type="text"
              defaultValue="8 Years"
            />
          </div>

          <div className={styles.group}>
            <label>Assigned Course</label>
            <input
              type="text"
              defaultValue="Java Full Stack"
              readOnly
            />
          </div>

          <div className={styles.group}>
            <label>Assigned Cohort</label>
            <input
              type="text"
              defaultValue="Batch A"
              readOnly
            />
          </div>

          <div className={styles.full}>
            <label>Skills</label>

            <textarea
              rows="4"
              defaultValue="Java, Spring Boot, React, PostgreSQL, Git"
            />
          </div>

          <div className={styles.full}>
            <label>Change Password</label>

            <input
              type="password"
              placeholder="Enter New Password"
            />
          </div>

          <button type="submit">
            Save Changes
          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;