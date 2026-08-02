import { Link } from "react-router-dom";
import styles from "./ClassSchedule.module.css";

const schedule = [
  {
    day: "Monday",
    time: "10:00 AM - 12:00 PM",
    topic: "Java Fundamentals",
    mentor: "Rajesh Kumar",
  },
  {
    day: "Tuesday",
    time: "10:00 AM - 12:00 PM",
    topic: "Spring Boot",
    mentor: "Rajesh Kumar",
  },
  {
    day: "Wednesday",
    time: "10:00 AM - 12:00 PM",
    topic: "ReactJS",
    mentor: "Rajesh Kumar",
  },
  {
    day: "Thursday",
    time: "10:00 AM - 12:00 PM",
    topic: "MySQL",
    mentor: "Rajesh Kumar",
  },
  {
    day: "Friday",
    time: "10:00 AM - 12:00 PM",
    topic: "Mini Project",
    mentor: "Rajesh Kumar",
  },
];

function ClassSchedule() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1>Class Schedule</h1>

        <p className={styles.subtitle}>
          Weekly schedule for your internship cohort.
        </p>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Topic</th>
              <th>Mentor</th>
            </tr>
          </thead>

          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.time}</td>
                <td>{item.topic}</td>
                <td>{item.mentor}</td>
              </tr>
            ))}
          </tbody>

        </table>

        <div className={styles.buttons}>
          <Link
            to="/student/mentor-details"
            className={styles.button}
          >
            View Mentor Details
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ClassSchedule;