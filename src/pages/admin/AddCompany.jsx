import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddCompany.module.css";

function AddCompany() {
  const navigate = useNavigate();

  const [company, setCompany] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    industry: "",
    openings: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Company Added Successfully!");

    navigate("/admin/companies");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Add Company</h1>

        <form onSubmit={handleSubmit}>

          <div className={styles.grid}>

            <div>
              <label>Company Name</label>
              <input
                type="text"
                name="name"
                value={company.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={company.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={company.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={company.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                value={company.industry}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Total Openings</label>
              <input
                type="number"
                name="openings"
                value={company.openings}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Status</label>

              <select
                name="status"
                value={company.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

          </div>

          <div className={styles.buttons}>
            <button type="submit">
              Add Company
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddCompany;