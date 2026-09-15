import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ========================================
   * GET CURRENT USER
   * ========================================
   */

  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  try {
    currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    currentUser = null;
  }

  const userName = currentUser?.name || "User";


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

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/issues`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      /*
       * Token expired
       */

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load issues."
        );
      }

      setIssues(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Dashboard issues error:",
        err
      );

      setError(
        err.message ||
          "Unable to load dashboard data."
      );

    } finally {
      setLoading(false);
    }
  }


  /*
   * ========================================
   * CALCULATE STATISTICS
   * ========================================
   */

  const statistics = useMemo(() => {

    const total =
      issues.length;

    const open =
      issues.filter(
        (issue) =>
          issue.status
            ?.toLowerCase() ===
          "open"
      ).length;

    const inProgress =
      issues.filter(
        (issue) =>
          issue.status
            ?.toLowerCase() ===
          "in progress"
      ).length;

    const resolved =
      issues.filter(
        (issue) =>
          issue.status
            ?.toLowerCase() ===
          "resolved"
      ).length;

    return {
      total,
      open,
      inProgress,
      resolved,
    };

  }, [issues]);


  /*
   * ========================================
   * RECENT ISSUES
   * ========================================
   */

  const recentIssues =
    useMemo(() => {

      return [...issues]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        )
        .slice(0, 4);

    }, [issues]);


  /*
   * ========================================
   * STATUS CLASS
   * ========================================
   */

  function getStatusClass(status) {

    switch (
      status?.toLowerCase()
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
   * PRIORITY CLASS
   * ========================================
   */

  function getPriorityClass(priority) {

    switch (
      priority?.toLowerCase()
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
   * DATE DISPLAY
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
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  }


  /*
   * ========================================
   * PAGE
   * ========================================
   */

  return (
    <div className="dashboard-page">

      {/* ====================================
          SIDEBAR
      ==================================== */}

      <aside className="dashboard-sidebar">

        <Link
          to="/"
          className="dashboard-logo"
        >

          <div className="logo-box">
            IN
          </div>

          <div>

            <strong>
              IssueNest
            </strong>

            <span>
              Issue Management
            </span>

          </div>

        </Link>


        <div className="sidebar-menu">

          <p>
            WORKSPACE
          </p>


          <Link
            to="/dashboard"
            className="menu-item active"
          >
            <span>▦</span>
            Dashboard
          </Link>


          <Link
            to="/issues"
            className="menu-item"
          >
            <span>☷</span>
            All Issues
          </Link>


          <Link
            to="/my-issues"
            className="menu-item"
          >
            <span>◉</span>
            My Issues
          </Link>


          <p>
            MANAGE
          </p>


          <Link
            to="/create-issue"
            className="menu-item"
          >
            <span>＋</span>
            Create Issue
          </Link>


          <a
            href="#reports"
            className="menu-item"
          >
            <span>▤</span>
            Reports
          </a>

        </div>


        <div className="sidebar-bottom">

          <div className="user-box">

            <div className="user-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {userName}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>


          <Link
            to="/login"
            className="logout"
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );
            }}
          >
            ↪ Logout
          </Link>

        </div>

      </aside>


      {/* ====================================
          MAIN
      ==================================== */}

      <main className="dashboard-main">

        {/* Header */}

        <header className="dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, {userName}.
              Here's what's happening today.
            </p>

          </div>


          <div className="header-buttons">

            <button
              className="notification"
              type="button"
            >
              ♢
            </button>


            <Link
              to="/create-issue"
              className="create-button"
            >
              ＋ Create Issue
            </Link>

          </div>

        </header>


        {/* ====================================
            ERROR
        ==================================== */}

        {error && (

          <div
            className="inline-error"
            style={{
              marginBottom: "20px",
            }}
          >
            {error}
          </div>

        )}


        {/* ====================================
            STATISTICS
        ==================================== */}

        <section className="stats">

          {/* Total */}

          <div className="stat-card">

            <div className="stat-header">

              <span>
                Total Issues
              </span>

              <div className="stat-icon blue">
                ▦
              </div>

            </div>

            <h2>
              {loading
                ? "—"
                : statistics.total}
            </h2>

            <p className="increase">
              Current total
            </p>

          </div>


          {/* Open */}

          <div className="stat-card">

            <div className="stat-header">

              <span>
                Open Issues
              </span>

              <div className="stat-icon orange">
                ◷
              </div>

            </div>

            <h2>
              {loading
                ? "—"
                : statistics.open}
            </h2>

            <p className="increase">
              Currently open
            </p>

          </div>


          {/* In Progress */}

          <div className="stat-card">

            <div className="stat-header">

              <span>
                In Progress
              </span>

              <div className="stat-icon purple">
                ↻
              </div>

            </div>

            <h2>
              {loading
                ? "—"
                : statistics.inProgress}
            </h2>

            <p className="increase">
              Currently being worked on
            </p>

          </div>


          {/* Resolved */}

          <div className="stat-card">

            <div className="stat-header">

              <span>
                Resolved
              </span>

              <div className="stat-icon green">
                ✓
              </div>

            </div>

            <h2>
              {loading
                ? "—"
                : statistics.resolved}
            </h2>

            <p className="increase">
              Successfully resolved
            </p>

          </div>

        </section>


        {/* ====================================
            LOWER CONTENT
        ==================================== */}

        <section className="dashboard-columns">


          {/* ==================================
              RECENT ISSUES
          =================================== */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Recent Issues
                </h2>

                <p>
                  Latest issues reported by your team
                </p>

              </div>


              <Link to="/issues">
                View all →
              </Link>

            </div>


            <div className="issue-list">

              {loading && (

                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                  }}
                >
                  Loading issues...
                </div>

              )}


              {!loading &&
                recentIssues.length === 0 && (

                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                    }}
                  >

                    <strong>
                      No issues yet
                    </strong>

                    <p>
                      Create your first issue.
                    </p>

                    <Link
                      to="/create-issue"
                      className="create-button"
                    >
                      ＋ Create Issue
                    </Link>

                  </div>

                )}


              {!loading &&
                recentIssues.map(
                  (issue) => (

                    <Link
                      key={issue._id}
                      to={`/issues/${issue._id}`}
                      className="issue"
                    >

                      <div className="issue-info">

                        <small>
                          #{issue._id
                            ?.toString()
                            .slice(-6)
                            .toUpperCase()}
                        </small>


                        <div>

                          <strong>
                            {issue.title}
                          </strong>

                          <span>
                            {issue.category ||
                              "General"}
                          </span>

                        </div>

                      </div>


                      <span
                        className={`badge ${getStatusClass(
                          issue.status
                        )}`}
                      >
                        {issue.status ||
                          "Open"}
                      </span>


                      <span
                        className={`priority ${getPriorityClass(
                          issue.priority
                        )}`}
                      >
                        {issue.priority ||
                          "Medium"}
                      </span>


                      <small>
                        {formatDate(
                          issue.createdAt
                        )}
                      </small>

                    </Link>

                  )
                )}

            </div>

          </div>


          {/* ==================================
              RIGHT COLUMN
          =================================== */}

          <div className="right-column">


            {/* Issue Overview */}

            <div className="panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Issue Overview
                  </h2>

                  <p>
                    Current issue distribution
                  </p>

                </div>

              </div>


              <div className="overview">

                <div className="circle">

                  <strong>
                    {loading
                      ? "—"
                      : statistics.total}
                  </strong>

                  <span>
                    Total
                  </span>

                </div>


                <div className="overview-items">

                  <div>

                    <span>

                      <i className="dot orange-dot"></i>

                      Open

                    </span>

                    <strong>
                      {loading
                        ? "—"
                        : statistics.open}
                    </strong>

                  </div>


                  <div>

                    <span>

                      <i className="dot blue-dot"></i>

                      In Progress

                    </span>

                    <strong>
                      {loading
                        ? "—"
                        : statistics.inProgress}
                    </strong>

                  </div>


                  <div>

                    <span>

                      <i className="dot green-dot"></i>

                      Resolved

                    </span>

                    <strong>
                      {loading
                        ? "—"
                        : statistics.resolved}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* Quick Actions */}

            <div className="panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Quick Actions
                  </h2>

                  <p>
                    Commonly used actions
                  </p>

                </div>

              </div>


              <div className="quick-actions">


                <Link to="/create-issue">

                  <span className="quick-icon">
                    ＋
                  </span>

                  <div>

                    <strong>
                      Create an Issue
                    </strong>

                    <small>
                      Report a new problem
                    </small>

                  </div>

                  <span>
                    →
                  </span>

                </Link>


                <Link to="/issues">

                  <span className="quick-icon">
                    ☷
                  </span>

                  <div>

                    <strong>
                      View All Issues
                    </strong>

                    <small>
                      Browse your issue list
                    </small>

                  </div>

                  <span>
                    →
                  </span>

                </Link>


                <a href="#reports">

                  <span className="quick-icon">
                    ▤
                  </span>

                  <div>

                    <strong>
                      View Reports
                    </strong>

                    <small>
                      Analyze issue activity
                    </small>

                  </div>

                  <span>
                    →
                  </span>

                </a>


              </div>

            </div>

          </div>


        </section>

      </main>

    </div>
  );
}

export default Dashboard;