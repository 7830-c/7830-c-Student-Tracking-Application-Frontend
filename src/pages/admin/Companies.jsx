import { Link } from "react-router-dom";
import styles from "./Companies.module.css";

const companies = [
  {
    id: 1,
    name: "Infosys",
    location: "Hyderabad",
    openings: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "TCS",
    location: "Bangalore",
    openings: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Wipro",
    location: "Chennai",
    openings: 5,
    status: "Inactive",
  },
];

function Companies() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Companies</h1>
          <p>Manage hiring companies.</p>
        </div>

        <Link to="/admin/add-company" className={styles.addBtn}>
          + Add Company
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Openings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.location}</td>
                <td>{company.openings}</td>
                <td>
                  <span
                    className={
                      company.status === "Active"
                        ? styles.active
                        : styles.inactive
                    }
                  >
                    {company.status}
                  </span>
                </td>

                <td className={styles.actions}>
                  <Link to="/admin/company-details">View</Link>

                  <Link to="/admin/edit-company">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Companies;