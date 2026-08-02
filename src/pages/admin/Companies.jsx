import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { normalizeListResponse } from "../../services/apiClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import styles from "./Companies.module.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCompanies = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COMPANIES.BASE);
        if (isMounted) setCompanies(normalizeListResponse(response.data));
      } catch (err) {
        console.error("Failed to load companies:", err);
        if (isMounted) setCompanies([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCompanies();
    return () => {
      isMounted = false;
    };
  }, []);

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

      {loading ? (
        <p>Loading companies from the database...</p>
      ) : companies.length === 0 ? (
        <p>No companies have been added yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.location || "N/A"}</td>
                  <td>{company.industry || "N/A"}</td>
                  <td>
                    <span className={company.is_verified ? styles.active : styles.inactive}>
                      {company.is_verified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  <td className={styles.actions}>
                    <Link to={`/admin/company-details/${company.id}`}>View</Link>
                    <Link to={`/admin/edit-company/${company.id}`}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Companies;
