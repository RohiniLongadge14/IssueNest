import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import API_URL, {
  getAuthHeaders,
} from "../api/api";


function IssueDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [issue, setIssue] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

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


      const data =
        await response.json();


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
            "Failed to load issue"
        );

      }


      setIssue(data);

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


  const handleDelete = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this issue? This action cannot be undone."
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");


      const response =
        await fetch(
          `${API_URL}/issues/${id}`,
          {
            method: "DELETE",
            headers:
              getAuthHeaders(),
          }
        );


      const data =
        await response.json();


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
            "Failed to delete issue"
        );

      }


      navigate("/issues");

    } catch (error) {

      console.error(
        "Delete issue error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete issue."
      );

    }

  };


  const getStatusClass =
    (status) => {

      if (
        status === "Open"
      ) {
        return "open";
      }

      if (
        status === "In Progress"
      ) {
        return "progress";
      }

      if (
        status === "Resolved"
      ) {
        return "resolved";
      }

      if (
        status === "Closed"
      ) {
        return "closed";
      }

      return "open";
    };


  const getPriorityClass =
    (priority) => {

      if (!priority) {
        return "";
      }

      return priority
        .toLowerCase()
        .replace(/\s+/g, "-");

    };


  const formatDate =
    (date) => {

      if (!date) {
        return "—";
      }

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  const formatDateTime =
    (date) => {

      if (!date) {
        return "—";
      }

      return new Date(
        date
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

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
            Please wait while we fetch
            the issue details.
          </p>

        </main>

      </div>
    );

  }


  if (error && !issue) {

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
          TOP BAR
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

      <main className="details-container">

        {/* Breadcrumb */}

        <div className="breadcrumb">

          <Link to="/issues">
            All Issues
          </Link>

          <span>
            /
          </span>

          <span>
            Issue Details
          </span>

        </div>


        {/* Issue Card */}

        <section className="details-card">

          {/* Header */}

          <div className="details-card-top">

            <div className="details-title-area">

              <span className="issue-number">
                #
                {issue._id
                  .slice(-6)
                  .toUpperCase()}
              </span>

              <h1>
                {issue.title}
              </h1>

              <p>
                Created on{" "}
                {formatDate(
                  issue.createdAt
                )}
              </p>

            </div>


            <div className="details-actions">

              <Link
                to={`/issues/${issue._id}/edit`}
                className="edit-button"
              >
                <span>
                  ✎
                </span>

                Edit
              </Link>


              <button
                type="button"
                className="delete-button"
                onClick={
                  handleDelete
                }
              >
                <span>
                  🗑
                </span>

                Delete
              </button>

            </div>

          </div>


          {/* Error */}

          {error && (
            <div className="inline-error">
              {error}
            </div>
          )}


          {/* Metadata */}

          <div className="details-meta">

            <div className="meta-item">

              <span className="meta-label">
                STATUS
              </span>

              <span
                className={`status-badge ${getStatusClass(
                  issue.status
                )}`}
              >
                {issue.status}
              </span>

            </div>


            <div className="meta-item">

              <span className="meta-label">
                PRIORITY
              </span>

              <span
                className={`priority-badge ${getPriorityClass(
                  issue.priority
                )}`}
              >
                {issue.priority}
              </span>

            </div>


            <div className="meta-item">

              <span className="meta-label">
                CATEGORY
              </span>

              <strong className="meta-value">
                {issue.category}
              </strong>

            </div>

          </div>


          {/* Description */}

          <div className="details-section">

            <h2>
              Description
            </h2>

            <div className="description-content">
              {issue.description}
            </div>

          </div>


          {/* Created By */}

          <div className="details-section">

            <h2>
              Created By
            </h2>


            <div className="created-user">

              <div className="user-avatar-large">

                {issue.createdBy?.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "U"}

              </div>


              <div className="created-user-info">

                <strong>
                  {issue.createdBy?.name ||
                    "Unknown User"}
                </strong>

                <span>
                  {issue.createdBy?.email ||
                    "No email available"}
                </span>

              </div>

            </div>

          </div>


          {/* Dates */}

          <div className="details-footer">

            <div className="date-item">

              <span>
                CREATED
              </span>

              <strong>
                {formatDateTime(
                  issue.createdAt
                )}
              </strong>

            </div>


            <div className="date-item">

              <span>
                LAST UPDATED
              </span>

              <strong>
                {formatDateTime(
                  issue.updatedAt
                )}
              </strong>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


export default IssueDetails;