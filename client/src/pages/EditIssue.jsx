import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import API_URL, {
  getAuthHeaders,
} from "../api/api";


function EditIssue() {

  const { id } = useParams();

  const navigate = useNavigate();


  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      category: "Bug",
      priority: "Medium",
      status: "Open",
    });


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    fetchIssue();
  }, [id]);


  const fetchIssue = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }


    try {

      setLoading(true);
      setError("");


      const response =
        await fetch(
          `${API_URL}/issues/${id}`,
          {
            method: "GET",
            headers:
              getAuthHeaders(),
          }
        );


      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};

      }


      if (response.status === 401) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;
      }


      if (!response.ok) {

        throw new Error(
          data.message ||
            "Failed to load issue."
        );

      }


      setFormData({

        title:
          data.title || "",

        description:
          data.description || "",

        category:
          data.category || "Bug",

        priority:
          data.priority || "Medium",

        status:
          data.status || "Open",

      });

    } catch (error) {

      console.error(
        "Fetch issue error:",
        error
      );

      setError(
        error.message ||
          "Unable to load issue."
      );

    } finally {

      setLoading(false);

    }

  };


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
         FRONTEND VALIDATION
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

        setSaving(true);


        const response =
          await fetch(
            `${API_URL}/issues/${id}`,
            {
              method: "PUT",

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
           API ERROR
        ========================== */

        if (!response.ok) {

          throw new Error(
            data.message ||
              "Failed to update issue."
          );

        }


        /* =========================
           SUCCESS
        ========================== */

        navigate(
          `/issues/${id}`
        );

      } catch (error) {

        console.error(
          "Update issue error:",
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
              "Unable to update issue. Please try again."
          );

        }

      } finally {

        setSaving(false);

      }

    };


  if (loading) {

    return (
      <div className="page-shell">

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

        </header>


        <main className="center-state">

          <div className="loading-spinner">
            ↻
          </div>

          <h2>
            Loading issue...
          </h2>

          <p>
            Please wait while we
            load the issue.
          </p>

        </main>

      </div>
    );

  }


  if (
    error &&
    !formData.title
  ) {

    return (
      <div className="page-shell">

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

        </header>


        <main className="center-state">

          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to load issue
          </h2>

          <p>
            {error}
          </p>


          <div className="state-actions">

            <button
              className="secondary-button"
              onClick={fetchIssue}
            >
              Try Again
            </button>

            <Link
              to="/issues"
              className="primary-button"
            >
              ← Back to Issues
            </Link>

          </div>

        </main>

      </div>
    );

  }


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
          to={`/issues/${id}`}
          className="topbar-back"
        >
          ← Issue Details
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

          <Link
            to={`/issues/${id}`}
          >
            Issue Details
          </Link>

          <span>
            /
          </span>

          <span>
            Edit
          </span>

        </div>


        <section className="edit-card">

          {/* Header */}

          <div className="edit-card-header">

            <span className="section-label">
              EDIT ISSUE
            </span>

            <h1>
              Edit issue
            </h1>

            <p>
              Update the issue information
              below.
            </p>

          </div>


          {/* Form */}

          <form
            className="edit-form"
            onSubmit={
              handleSubmit
            }
          >

            {error && (
              <div className="inline-error">
                {error}
              </div>
            )}


            {/* Title */}

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
                disabled={saving}
              />

              <small>
                Keep the title short and
                descriptive.
              </small>

            </div>


            {/* Description */}

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
                disabled={saving}
              />

              <small>
                Explain what happened and
                provide relevant details.
              </small>

            </div>


            {/* Category / Priority */}

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
                  disabled={saving}
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
                  disabled={saving}
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


            {/* Status */}

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
                disabled={saving}
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


            {/* Buttons */}

            <div className="form-actions">

              <Link
                to={`/issues/${id}`}
                className="cancel-button"
              >
                Cancel
              </Link>


              <button
                type="submit"
                className="update-button"
                disabled={saving}
              >

                {saving
                  ? "Updating..."
                  : "Update Issue"}

              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}


export default EditIssue;