import { Link } from "react-router-dom";
import styles from "./ClassSchedule.module.css";

function ClassSchedule() {

  const schedules = [
    {
      id: 1,
      course: "Java Full Stack",
      batch: "Batch A",
      day: "Monday - Friday",
      time: "10:00 AM - 12:00 PM",
      room: "Google Meet",
    },
    {
      id: 2,
      course: "MERN Stack",
      batch: "Batch B",
      day: "Monday - Friday",
      time: "2:00 PM - 4:00 PM",
      room: "Google Meet",
    },
    {
      id: 3,
      course: "Python Full Stack",
      batch: "Batch C",
      day: "Saturday",
      time: "9:00 AM - 12:00 PM",
      room: "Google Meet",
    },
  ];

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1>Class Schedule</h1>
      </div>

      <table className={styles.table}>

        <thead>
          <tr>
            <th>Course</th>
            <th>Batch</th>
            <th>Days</th>
            <th>Time</th>
            <th>Platform</th>
          </tr>
        </thead>

        <tbody>

          {schedules.map((item) => (

            <tr key={item.id}>
              <td>{item.course}</td>
              <td>{item.batch}</td>
              <td>{item.day}</td>
              <td>{item.time}</td>
              <td>{item.room}</td>
            </tr>

          ))}

        </tbody>

      </table>

      <div className={styles.footer}>

        <Link to="/mentor/cohorts">
          ← Back to Cohorts
        </Link>

      </div>

    </div>
  );
}

export default ClassSchedule;