import { Link } from "react-router-dom";
import styles from "./MyCohorts.module.css";

function MyCohorts() {
  const cohorts = [
    {
      id: 1,
      name: "Java Full Stack - Batch A",
      students: 42,
      schedule: "Mon - Fri | 10:00 AM",
      status: "Ongoing",
    },
    {
      id: 2,
      name: "MERN Stack - Batch B",
      students: 38,
      schedule: "Mon - Fri | 2:00 PM",
      status: "Ongoing",
    },
    {
      id: 3,
      name: "Python Full Stack - Batch C",
      students: 44,
      schedule: "Weekend | 9:00 AM",
      status: "Upcoming",
    },
  ];

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div>
          <h1>My Cohorts</h1>
          <p>Assigned cohorts for mentoring</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Students</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.id}>
                <td>{cohort.name}</td>
                <td>{cohort.students}</td>
                <td>{cohort.schedule}</td>

                <td
                  className={
                    cohort.status === "Ongoing"
                      ? styles.ongoing
                      : styles.upcoming
                  }
                >
                  {cohort.status}
                </td>

                <td>
                  <Link to="/mentor/cohort-details">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default MyCohorts;