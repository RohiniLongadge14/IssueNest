import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function Issues() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ========================================
   * FETCH ISSUES
   * ========================================
   */

  useEffect(() => {
    fetchIssues();
  }, []);

  async function fetchIssues() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/issues`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      /*
       * Token expired / unauthorized
       */

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load issues."
        );
      }

      /*
       * Backend returns an array of issues.
       */

      setIssues(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Fetch issues error:",
        err
      );

      setError(
        err.message ||
          "Unable to load issues. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


  /*
   * ========================================
   * SEARCH + FILTER
   * ========================================
   */

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {

      const searchText =
        search
          .toLowerCase()
          .trim();


      /*
       * Search by:
       * - title
       * - description
       * - category
       */

      const matchesSearch =
        !searchText ||
        issue.title
          ?.toLowerCase()
          .includes(searchText) ||
        issue.description
          ?.toLowerCase()
          .includes(searchText) ||
        issue.category
          ?.toLowerCase()
          .includes(searchText);


      /*
       * Status filter
       */

      const matchesStatus =
        status === "All" ||
        issue.status
          ?.toLowerCase() ===
          status.toLowerCase();


      /*
       * Priority filter
       */

      const matchesPriority =
        priority === "All" ||
        issue.priority
          ?.toLowerCase() ===
          priority.toLowerCase();


      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    issues,
    search,
    status,
    priority,
  ]);


  /*
   * ========================================
   * ISSUE NUMBER
   * ========================================
   */

  function getIssueNumber(issue) {
    if (!issue?._id) {
      return "#------";
    }

    return `#${issue._id
      .toString()
      .slice(-6)
      .toUpperCase()}`;
  }


  /*
   * ========================================
   * DATE FORMAT
   * ========================================
   */

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }


  /*
   * ========================================
   * STATUS CSS CLASS
   * ========================================
   */

  function getStatusClass(issueStatus) {
    switch (
      issueStatus?.toLowerCase()
    ) {
      case "open":
        return "open";

      case "in progress":
        return "progress";

      case "resolved":
        return "resolved";

      case "closed":
        return "closed";

      default:
        return "open";
    }
  }


  /*
   * ========================================
   * PRIORITY CSS CLASS
   * ========================================
   */

  function getPriorityClass(issuePriority) {
    switch (
      issuePriority?.toLowerCase()
    ) {
      case "critical":
        return "critical";

      case "high":
        return "high";

      case "medium":
        return "medium";

      case "low":
        return "low";

      default:
        return "medium";
    }
  }


  /*
   * ========================================
   * CLEAR FILTERS
   * ========================================
   */

  function clearFilters() {
    setSearch("");
    setStatus("All");
    setPriority("All");
  }


  /*
   * ========================================
   * PAGE
   * ========================================
   */

  return (
    <div className="issues-page">

      {/* =====================================
          TOP BAR
      ====================================== */}

      <header className="app-topbar">

        <Link
          to="/"
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


        <div className="topbar-actions">

          <Link
            to="/dashboard"
            className="topbar-back"
          >
            ← Dashboard
          </Link>


          <Link
            to="/create-issue"
            className="create-button"
          >
            ＋ Create Issue
          </Link>

        </div>

      </header>


      {/* =====================================
          MAIN
      ====================================== */}

      <main className="issues-main">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="issues-header">

          <div>

            <div className="breadcrumb">

              <Link to="/dashboard">
                Dashboard
              </Link>

              <span>
                /
              </span>

              <span>
                All Issues
              </span>

            </div>


            <h1>
              All Issues
            </h1>


            <p>
              View and manage all reported issues.
            </p>

          </div>

        </div>


        {/* =====================================
            SEARCH + FILTERS
        ====================================== */}

        <div className="issues-toolbar">

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          <select
            className="filter-select"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
          >

            <option value="All">
              All Statuses
            </option>

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


          <select
            className="filter-select"
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value
              )
            }
          >

            <option value="All">
              All Priorities
            </option>

            <option value="Critical">
              Critical
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>

          </select>

        </div>


        {/* =====================================
            LOADING
        ====================================== */}

        {loading && (

          <div className="center-state">

            <div className="loading-spinner">
              ⟳
            </div>

            <h2>
              Loading issues...
            </h2>

            <p>
              Please wait while we retrieve your issues.
            </p>

          </div>

        )}


        {/* =====================================
            ERROR
        ====================================== */}

        {!loading && error && (

          <div>

            <div className="inline-error">
              {error}
            </div>


            <div className="retry-container">

              <button
                type="button"
                className="primary-button"
                onClick={fetchIssues}
              >
                Try Again
              </button>

            </div>

          </div>

        )}


        {/* =====================================
            RESULTS
        ====================================== */}

        {!loading && !error && (

          <>

            <div className="issues-count">

              Showing{" "}

              <strong>
                {filteredIssues.length}
              </strong>{" "}

              of{" "}

              <strong>
                {issues.length}
              </strong>{" "}

              issues

            </div>


            {/* =================================
                NO RESULTS
            ================================== */}

            {filteredIssues.length === 0 && (

              <div className="center-state">

                <div className="empty-icon">
                  !
                </div>

                <h2>
                  No issues found
                </h2>

                <p>
                  {issues.length === 0
                    ? "There are no issues yet. Create your first issue."
                    : "Try changing your search or filters."
                  }
                </p>


                {issues.length > 0 && (

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>

                )}

                {issues.length === 0 && (

                  <Link
                    to="/create-issue"
                    className="primary-button"
                  >
                    ＋ Create Issue
                  </Link>

                )}

              </div>

            )}


            {/* =================================
                TABLE
            ================================== */}

            {filteredIssues.length > 0 && (

              <div className="issues-table">

                {/* Table Header */}

                <div className="issues-table-header">

                  <span>
                    ISSUE
                  </span>

                  <span>
                    STATUS
                  </span>

                  <span>
                    PRIORITY
                  </span>

                  <span>
                    CATEGORY
                  </span>

                  <span>
                    CREATED
                  </span>

                </div>


                {/* Issue Rows */}

                {filteredIssues.map(
                  (issue) => (

                    <Link
                      key={issue._id}
                      to={`/issues/${issue._id}`}
                      className="issue-row"
                    >

                      {/* Issue */}

                      <div className="issue-row-title">

                        <strong>
                          {issue.title}
                        </strong>

                        <small>
                          {getIssueNumber(
                            issue
                          )}
                        </small>

                      </div>


                      {/* Status */}

                      <div>

                        <span
                          className={`status-badge ${getStatusClass(
                            issue.status
                          )}`}
                        >
                          {issue.status ||
                            "Open"}
                        </span>

                      </div>


                      {/* Priority */}

                      <div>

                        <span
                          className={`priority-badge ${getPriorityClass(
                            issue.priority
                          )}`}
                        >
                          {issue.priority ||
                            "Medium"}
                        </span>

                      </div>


                      {/* Category */}

                      <div className="issue-category">

                        {issue.category ||
                          "—"}

                      </div>


                      {/* Created */}

                      <div className="issue-date">

                        {formatDate(
                          issue.createdAt
                        )}

                      </div>

                    </Link>

                  )
                )}

              </div>

            )}

          </>

        )}

      </main>

    </div>
  );
}

export default Issues;