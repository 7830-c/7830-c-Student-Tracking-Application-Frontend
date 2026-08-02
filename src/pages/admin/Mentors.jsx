import { Link } from "react-router-dom";
import styles from "./Mentors.module.css";

function Mentors() {
  const mentors = [
    {
      id: 1,
      name: "Ravi Kumar",
      specialization: "Java Full Stack",
      experience: "8 Years",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Sharma",
      specialization: "Python Full Stack",
      experience: "6 Years",
      status: "Active",
    },
    {
      id: 3,
      name: "Arun Reddy",
      specialization: "MERN Stack",
      experience: "5 Years",
      status: "Active",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.header}>
          <h1>Mentor Management</h1>

          <Link
            to="/admin/add-mentor"
            className={styles.addBtn}
          >
            + Add Mentor
          </Link>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {mentors.map((mentor) => (
                <tr key={mentor.id}>
                  <td>{mentor.id}</td>
                  <td>{mentor.name}</td>
                  <td>{mentor.specialization}</td>
                  <td>{mentor.experience}</td>

                  <td>
                    <span className={styles.status}>
                      {mentor.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <Link to="/admin/mentor-details">
                        View
                      </Link>

                      <Link to="/admin/edit-mentor">
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Mentors;