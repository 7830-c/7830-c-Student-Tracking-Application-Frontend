import { Link } from "react-router-dom";
import styles from "./Cohorts.module.css";

function Cohorts() {
  const cohorts = [
    {
      id: 1,
      name: "Java Full Stack - Batch 12",
      mentor: "Rahul Sharma",
      students: 45,
      status: "Active",
    },
    {
      id: 2,
      name: "MERN Stack - Batch 08",
      mentor: "Anjali Verma",
      students: 38,
      status: "Upcoming",
    },
    {
      id: 3,
      name: "Python Full Stack - Batch 05",
      mentor: "Kiran Kumar",
      students: 42,
      status: "Completed",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Cohort Management</h1>
          <p>Manage all training batches</p>
        </div>

        <Link to="/admin/add-cohort" className={styles.addBtn}>
          + Add Cohort
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Mentor</th>
              <th>Students</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.id}>
                <td>{cohort.name}</td>
                <td>{cohort.mentor}</td>
                <td>{cohort.students}</td>

                <td
                  className={
                    cohort.status === "Active"
                      ? styles.active
                      : cohort.status === "Upcoming"
                      ? styles.upcoming
                      : styles.completed
                  }
                >
                  {cohort.status}
                </td>

                <td className={styles.actions}>
                  <Link to="/admin/cohort-details">View</Link>
                  <Link to="/admin/edit-cohort">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cohorts;