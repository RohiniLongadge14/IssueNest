import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API_URL, {
  getAuthHeaders,
} from "../api/api";


function CreateIssue() {

  const navigate = useNavigate();


  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      category: "Bug",
      priority: "Medium",
      status: "Open",
    });


  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setFormData(
        (previousData) => ({
          ...previousData,
          [name]: value,
        })
      );


      if (error) {
        setError("");
      }

    };


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      const title =
        formData.title.trim();

      const description =
        formData.description.trim();


      /* =========================
         VALIDATION
      ========================== */

      if (!title) {

        setError(
          "Issue title is required."
        );

        return;
      }


      if (title.length < 3) {

        setError(
          "Issue title must contain at least 3 characters."
        );

        return;
      }


      if (title.length > 150) {

        setError(
          "Issue title cannot exceed 150 characters."
        );

        return;
      }


      if (!description) {

        setError(
          "Issue description is required."
        );

        return;
      }


      if (description.length < 10) {

        setError(
          "Issue description must contain at least 10 characters."
        );

        return;
      }


      if (description.length > 5000) {

        setError(
          "Issue description cannot exceed 5000 characters."
        );

        return;
      }


      try {

        setLoading(true);


        const response =
          await fetch(
            `${API_URL}/issues`,
            {
              method: "POST",

              headers: {
                ...getAuthHeaders(),

                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  title,
                  description,

                  category:
                    formData.category,

                  priority:
                    formData.priority,

                  status:
                    formData.status,
                }),
            }
          );


        let data = {};

        try {

          data =
            await response.json();

        } catch {

          data = {};

        }


        /* =========================
           AUTH ERROR
        ========================== */

        if (
          response.status === 401
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;
        }


        /* =========================
           OTHER API ERROR
        ========================== */

        if (!response.ok) {

          throw new Error(
            data.message ||
              "Unable to create issue."
          );

        }


        /* =========================
           SUCCESS
        ========================== */

        if (data._id) {

          navigate(
            `/issues/${data._id}`
          );

        } else {

          navigate("/issues");

        }

      } catch (error) {

        console.error(
          "Create issue error:",
          error
        );


        if (
          error instanceof TypeError
        ) {

          setError(
            "Unable to connect to the server. Make sure the backend is running."
          );

        } else {

          setError(
            error.message ||
              "Unable to create issue. Please try again."
          );

        }

      } finally {

        setLoading(false);

      }

    };


  return (
    <div className="page-shell">

      {/* =========================
          HEADER
      ========================== */}

      <header className="app-topbar">

        <Link
          to="/dashboard"
          className="brand"
        >

          <div className="brand-icon">
            IN
          </div>

          <div className="brand-text">

            <strong>
              IssueNest
            </strong>

            <span>
              Issue Management
            </span>

          </div>

        </Link>


        <Link
          to="/issues"
          className="topbar-back"
        >
          ← All Issues
        </Link>

      </header>


      {/* =========================
          MAIN
      ========================== */}

      <main className="edit-container">

        <div className="breadcrumb">

          <Link to="/issues">
            All Issues
          </Link>

          <span>
            /
          </span>

          <span>
            Create Issue
          </span>

        </div>


        <section className="edit-card">

          {/* HEADER */}

          <div className="edit-card-header">

            <span className="section-label">
              ISSUE MANAGEMENT
            </span>

            <h1>
              Create a new issue
            </h1>

            <p>
              Report a problem or request
              a new feature for your team.
            </p>

          </div>


          {/* FORM */}

          <form
            className="edit-form"
            onSubmit={
              handleSubmit
            }
          >

            {/* ERROR */}

            {error && (
              <div className="inline-error">
                {error}
              </div>
            )}


            {/* TITLE */}

            <div className="form-field">

              <label htmlFor="title">
                Issue Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                placeholder="Enter a clear issue title"
                maxLength="150"
                disabled={loading}
              />

              <small>
                Keep the title short and
                descriptive.
              </small>

            </div>


            {/* DESCRIPTION */}

            <div className="form-field">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Describe the issue in detail..."
                rows="7"
                maxLength="5000"
                disabled={loading}
              />

              <small>
                Explain what happened and
                provide relevant details.
              </small>

            </div>


            {/* CATEGORY + PRIORITY */}

            <div className="form-grid">

              <div className="form-field">

                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  disabled={loading}
                >

                  <option value="Bug">
                    Bug
                  </option>

                  <option value="Feature">
                    Feature
                  </option>

                  <option value="Improvement">
                    Improvement
                  </option>

                  <option value="UI/UX">
                    UI/UX
                  </option>

                  <option value="Performance">
                    Performance
                  </option>

                  <option value="Security">
                    Security
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              <div className="form-field">

                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={
                    formData.priority
                  }
                  onChange={
                    handleChange
                  }
                  disabled={loading}
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>

                </select>

              </div>

            </div>


            {/* STATUS */}

            <div className="form-field">

              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              >

                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Closed">
                  Closed
                </option>

              </select>

            </div>


            {/* ACTIONS */}

            <div className="form-actions">

              <Link
                to="/issues"
                className="cancel-button"
              >
                Cancel
              </Link>


              <button
                type="submit"
                className="update-button"
                disabled={loading}
              >

                {loading
                  ? "Creating..."
                  : "Create Issue"}

              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}


export default CreateIssue;