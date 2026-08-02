import styles from "./Settings.module.css";

function Settings() {
  return (
    <div className={styles.container}>

      <div className={styles.card}>

        <h1>Settings</h1>

        <div className={styles.section}>

          <h3>Notifications</h3>

          <label className={styles.option}>
            <input type="checkbox" defaultChecked />
            Email Notifications
          </label>

          <label className={styles.option}>
            <input type="checkbox" defaultChecked />
            Assignment Alerts
          </label>

          <label className={styles.option}>
            <input type="checkbox" />
            SMS Notifications
          </label>

        </div>

        <div className={styles.section}>

          <h3>Appearance</h3>

          <select>
            <option>Light Theme</option>
            <option>Dark Theme</option>
          </select>

        </div>

        <div className={styles.section}>

          <h3>Language</h3>

          <select>
            <option>English</option>
            <option>Telugu</option>
          </select>

        </div>

        <button>
          Save Settings
        </button>

      </div>

    </div>
  );
}

export default Settings;