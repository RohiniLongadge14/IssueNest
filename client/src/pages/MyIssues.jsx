import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function MyIssues() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /*
   * ========================================
   * LOAD MY ISSUES
   * ========================================
   */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchMyIssues();
  }, []);

  async function fetchMyIssues() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/issues/my`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load your issues."
        );
      }

      setIssues(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "My Issues error:",
        err
      );

      setError(
        err.message ||
          "Unable to load your issues."
      );

    } finally {
      setLoading(false);
    }
  }


  /*
   * ========================================
   * SORT ISSUES
   * ========================================
   */

  const sortedIssues = useMemo(() => {
    return [...issues].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
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
   * FORMAT DATE
   * ========================================
   */

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

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
        year: "numeric",
      }
    );
  }


  /*
   * ========================================
   * PAGE
   * ========================================
   */

  return (
    <div className="my-issues-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <header className="my-issues-header">

        <Link
          to="/dashboard"
          className="my-issues-brand"
        >

          <div className="my-issues-brand-icon">
            IN
          </div>

          <div className="my-issues-brand-text">

            <strong>
              IssueNest
            </strong>

            <span>
              Issue Management
            </span>

          </div>

        </Link>


        <div className="my-issues-header-actions">

          <Link
            to="/dashboard"
            className="my-issues-back-button"
          >
            Dashboard
          </Link>

          <Link
            to="/create-issue"
            className="my-issues-create-button"
          >
            ＋ Create Issue
          </Link>

        </div>

      </header>


      {/* ====================================
          MAIN
      ==================================== */}

      <main className="my-issues-main">

        <div className="my-issues-container">

          {/* ==================================
              PAGE TITLE
          ================================== */}

          <section className="my-issues-title">

            <span>
              PERSONAL WORKSPACE
            </span>

            <h1>
              My Issues
            </h1>

            <p>
              Issues created by you
            </p>

          </section>


          {/* ==================================
              ERROR
          ================================== */}

          {error && (

            <div className="my-issues-error">

              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={fetchMyIssues}
              >
                Try Again
              </button>

            </div>

          )}


          {/* ==================================
              COUNT
          ================================== */}

          {!loading && !error && (

            <div className="my-issues-count">

              Showing{" "}

              <strong>
                {issues.length}
              </strong>{" "}

              {issues.length === 1
                ? "issue"
                : "issues"}

            </div>

          )}


          {/* ==================================
              LOADING
          ================================== */}

          {loading && (

            <div className="my-issues-empty">

              <div className="my-issues-empty-icon">
                ↻
              </div>

              <h3>
                Loading your issues
              </h3>

              <p>
                Please wait while we load your issues.
              </p>

            </div>

          )}


          {/* ==================================
              EMPTY
          ================================== */}

          {!loading &&
            !error &&
            sortedIssues.length === 0 && (

              <div className="my-issues-empty">

                <div className="my-issues-empty-icon">
                  ＋
                </div>

                <h3>
                  No issues yet
                </h3>

                <p>
                  You haven't created any issues yet.
                </p>

                <Link
                  to="/create-issue"
                  className="my-issues-create-button"
                >
                  ＋ Create Issue
                </Link>

              </div>

            )}


          {/* ==================================
              ISSUES TABLE
          ================================== */}

          {!loading &&
            !error &&
            sortedIssues.length > 0 && (

              <div className="my-issues-table-card">

                {/* TABLE HEADER */}

                <div className="my-issues-table-head">

                  <div>
                    ISSUE
                  </div>

                  <div>
                    CATEGORY
                  </div>

                  <div>
                    PRIORITY
                  </div>

                  <div>
                    STATUS
                  </div>

                  <div>
                    CREATED
                  </div>

                </div>


                {/* TABLE ROWS */}

                <div className="my-issues-table-body">

                  {sortedIssues.map(
                    (issue) => (

                      <Link
                        key={issue._id}
                        to={`/issues/${issue._id}`}
                        className="my-issues-table-row"
                      >

                        {/* ISSUE */}

                        <div className="my-issues-issue-cell">

                          <strong>
                            {issue.title}
                          </strong>

                          <span>
                            #
                            {issue._id
                              ?.toString()
                              .slice(-6)
                              .toUpperCase()}
                          </span>

                        </div>


                        {/* CATEGORY */}

                        <div className="my-issues-category-cell">

                          {issue.category ||
                            "General"}

                        </div>


                        {/* PRIORITY */}

                        <div>

                          <span
                            className={
                              `my-issues-priority ` +
                              getPriorityClass(
                                issue.priority
                              )
                            }
                          >
                            {issue.priority ||
                              "Medium"}
                          </span>

                        </div>


                        {/* STATUS */}

                        <div>

                          <span
                            className={
                              `my-issues-status ` +
                              getStatusClass(
                                issue.status
                              )
                            }
                          >
                            {issue.status ||
                              "Open"}
                          </span>

                        </div>


                        {/* CREATED */}

                        <div className="my-issues-date-cell">

                          {formatDate(
                            issue.createdAt
                          )}

                        </div>

                      </Link>

                    )
                  )}

                </div>

              </div>

            )}

        </div>

      </main>


      {/* ====================================
          MY ISSUES PAGE ONLY CSS
          ====================================

          IMPORTANT:
          Every selector below starts with
          .my-issues-page

          Therefore this styling cannot affect
          Landing, Login, Register, Dashboard,
          All Issues, Create Issue, Edit Issue,
          or Issue Details.
      ==================================== */}

      <style>{`

        /* =====================================
           PAGE
        ===================================== */

        .my-issues-page {
          min-height: 100vh;
          width: 100%;

          margin: 0;
          padding: 0;

          background: #f8fafc;
          color: #0f172a;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }


        .my-issues-page *,
        .my-issues-page *::before,
        .my-issues-page *::after {
          box-sizing: border-box;
        }


        /* =====================================
           HEADER
        ===================================== */

        .my-issues-page .my-issues-header {
          width: 100%;
          height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 42px;

          background: #ffffff;

          border-bottom: 1px solid #e2e8f0;

          box-shadow:
            0 2px 8px rgba(
              15,
              23,
              42,
              0.03
            );
        }


        /* =====================================
           BRAND
        ===================================== */

        .my-issues-page .my-issues-brand {
          display: flex;
          align-items: center;

          gap: 12px;

          color: #0f172a;

          text-decoration: none;
        }


        .my-issues-page .my-issues-brand-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 11px;

          background: #2563eb;
          color: #ffffff;

          font-size: 14px;
          font-weight: 800;
        }


        .my-issues-page .my-issues-brand-text {
          display: flex;
          flex-direction: column;

          gap: 2px;
        }


        .my-issues-page
        .my-issues-brand-text strong {
          display: block;

          margin: 0;

          color: #0f172a;

          font-size: 17px;
          font-weight: 800;

          line-height: 1.2;
        }


        .my-issues-page
        .my-issues-brand-text span {
          display: block;

          color: #94a3b8;

          font-size: 10px;

          line-height: 1.2;
        }


        /* =====================================
           HEADER ACTIONS
        ===================================== */

        .my-issues-page
        .my-issues-header-actions {
          display: flex;
          align-items: center;

          gap: 10px;
        }


        .my-issues-page
        .my-issues-back-button {
          height: 40px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding: 0 15px;

          border: 1px solid #dbe2ea;

          border-radius: 8px;

          background: #ffffff;
          color: #475569;

          font-size: 12px;
          font-weight: 700;

          text-decoration: none;

          transition:
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease;
        }


        .my-issues-page
        .my-issues-back-button:hover {
          background: #eff6ff;

          border-color: #2563eb;

          color: #2563eb;
        }


        .my-issues-page
        .my-issues-create-button {
          height: 40px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding: 0 17px;

          border: none;

          border-radius: 8px;

          background: #2563eb;
          color: #ffffff;

          font-size: 12px;
          font-weight: 750;

          text-decoration: none;

          cursor: pointer;

          transition:
            background 0.15s ease,
            transform 0.15s ease;
        }


        .my-issues-page
        .my-issues-create-button:hover {
          background: #1d4ed8;

          transform: translateY(-1px);
        }


        /* =====================================
           MAIN
        ===================================== */

        .my-issues-page .my-issues-main {
          width: 100%;

          margin: 0;
          padding: 0;
        }


        .my-issues-page
        .my-issues-container {
          width: min(
            1180px,
            calc(100% - 80px)
          );

          margin: 0 auto;

          padding: 42px 0 70px;
        }


        /* =====================================
           TITLE
        ===================================== */

        .my-issues-page
        .my-issues-title {
          margin-bottom: 28px;
        }


        .my-issues-page
        .my-issues-title > span {
          display: block;

          margin-bottom: 9px;

          color: #2563eb;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.09em;
        }


        .my-issues-page
        .my-issues-title h1 {
          margin: 0;

          color: #0f172a;

          font-size: 30px;
          line-height: 1.2;

          letter-spacing: -0.025em;

          font-weight: 800;
        }


        .my-issues-page
        .my-issues-title p {
          margin: 8px 0 0;

          color: #64748b;

          font-size: 13px;

          line-height: 1.6;
        }


        /* =====================================
           COUNT
        ===================================== */

        .my-issues-page
        .my-issues-count {
          margin-bottom: 10px;

          color: #64748b;

          font-size: 10px;
        }


        .my-issues-page
        .my-issues-count strong {
          color: #334155;

          font-weight: 750;
        }


        /* =====================================
           TABLE CARD
        ===================================== */

        .my-issues-page
        .my-issues-table-card {
          width: 100%;

          overflow: hidden;

          background: #ffffff;

          border: 1px solid #e2e8f0;

          border-radius: 12px;

          box-shadow:
            0 5px 18px
            rgba(
              15,
              23,
              42,
              0.035
            );
        }


        /* =====================================
           TABLE HEADER
        ===================================== */

        .my-issues-page
        .my-issues-table-head {
          width: 100%;

          min-height: 48px;

          display: grid;

          grid-template-columns:
            minmax(300px, 2fr)
            130px
            120px
            135px
            125px;

          align-items: center;

          gap: 14px;

          padding: 0 22px;

          background: #f8fafc;

          border-bottom: 1px solid #e2e8f0;

          color: #94a3b8;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 0.06em;
        }


        /* =====================================
           TABLE BODY
        ===================================== */

        .my-issues-page
        .my-issues-table-body {
          width: 100%;
        }


        /* =====================================
           TABLE ROW
        ===================================== */

        .my-issues-page
        .my-issues-table-row {
          width: 100%;

          min-height: 78px;

          display: grid;

          grid-template-columns:
            minmax(300px, 2fr)
            130px
            120px
            135px
            125px;

          align-items: center;

          gap: 14px;

          padding: 0 22px;

          background: #ffffff;

          border-bottom: 1px solid #f1f5f9;

          color: inherit;

          text-decoration: none;

          transition:
            background 0.15s ease;
        }


        .my-issues-page
        .my-issues-table-row:last-child {
          border-bottom: none;
        }


        .my-issues-page
        .my-issues-table-row:hover {
          background: #f8fbff;
        }


        /* =====================================
           ISSUE CELL
        ===================================== */

        .my-issues-page
        .my-issues-issue-cell {
          min-width: 0;

          display: flex;

          flex-direction: column;

          gap: 4px;
        }


        .my-issues-page
        .my-issues-issue-cell strong {
          display: block;

          overflow: hidden;

          color: #334155;

          font-size: 13px;

          font-weight: 750;

          line-height: 1.4;

          text-overflow: ellipsis;

          white-space: nowrap;
        }


        .my-issues-page
        .my-issues-table-row:hover
        .my-issues-issue-cell strong {
          color: #2563eb;
        }


        .my-issues-page
        .my-issues-issue-cell span {
          display: block;

          color: #94a3b8;

          font-size: 9px;

          font-weight: 600;
        }


        /* =====================================
           CATEGORY
        ===================================== */

        .my-issues-page
        .my-issues-category-cell {
          color: #475569;

          font-size: 11px;

          font-weight: 600;
        }


        /* =====================================
           PRIORITY
        ===================================== */

        .my-issues-page
        .my-issues-priority {
          width: fit-content;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding: 5px 9px;

          border-radius: 20px;

          font-size: 9px;

          font-weight: 800;
        }


        .my-issues-page
        .my-issues-priority.critical {
          background: #fef2f2;

          color: #dc2626;
        }


        .my-issues-page
        .my-issues-priority.high {
          background: #fff7ed;

          color: #ea580c;
        }


        .my-issues-page
        .my-issues-priority.medium {
          background: #fffbeb;

          color: #d97706;
        }


        .my-issues-page
        .my-issues-priority.low {
          background: #f0fdf4;

          color: #16a34a;
        }


        /* =====================================
           STATUS
        ===================================== */

        .my-issues-page
        .my-issues-status {
          width: fit-content;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding: 5px 9px;

          border-radius: 20px;

          font-size: 9px;

          font-weight: 800;
        }


        .my-issues-page
        .my-issues-status.open {
          background: #fff7ed;

          color: #ea580c;
        }


        .my-issues-page
        .my-issues-status.progress {
          background: #eff6ff;

          color: #2563eb;
        }


        .my-issues-page
        .my-issues-status.resolved {
          background: #f0fdf4;

          color: #16a34a;
        }


        .my-issues-page
        .my-issues-status.closed {
          background: #f1f5f9;

          color: #475569;
        }


        /* =====================================
           DATE
        ===================================== */

        .my-issues-page
        .my-issues-date-cell {
          color: #64748b;

          font-size: 10px;

          white-space: nowrap;
        }


        /* =====================================
           EMPTY STATE
        ===================================== */

        .my-issues-page
        .my-issues-empty {
          min-height: 300px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          padding: 40px;

          background: #ffffff;

          border: 1px solid #e2e8f0;

          border-radius: 12px;

          text-align: center;
        }


        .my-issues-page
        .my-issues-empty-icon {
          width: 48px;
          height: 48px;

          display: flex;

          align-items: center;

          justify-content: center;

          margin-bottom: 14px;

          border-radius: 50%;

          background: #eff6ff;

          color: #2563eb;

          font-size: 20px;

          font-weight: 700;
        }


        .my-issues-page
        .my-issues-empty h3 {
          margin: 0 0 7px;

          color: #0f172a;

          font-size: 18px;

          font-weight: 750;
        }


        .my-issues-page
        .my-issues-empty p {
          margin: 0 0 18px;

          color: #64748b;

          font-size: 12px;
        }


        /* =====================================
           ERROR
        ===================================== */

        .my-issues-page
        .my-issues-error {
          width: 100%;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          margin-bottom: 20px;

          padding: 13px 15px;

          border: 1px solid #fecaca;

          border-radius: 9px;

          background: #fef2f2;

          color: #b91c1c;

          font-size: 12px;
        }


        .my-issues-page
        .my-issues-error button {
          min-height: 34px;

          padding: 0 13px;

          border: 1px solid #fecaca;

          border-radius: 7px;

          background: #ffffff;

          color: #b91c1c;

          font-size: 11px;

          font-weight: 700;

          cursor: pointer;
        }


        .my-issues-page
        .my-issues-error button:hover {
          background: #fff7f7;
        }


        /* =====================================
           RESPONSIVE
        ===================================== */

        @media (max-width: 900px) {

          .my-issues-page
          .my-issues-container {
            width: calc(100% - 40px);
          }


          .my-issues-page
          .my-issues-table-card {
            overflow-x: auto;
          }


          .my-issues-page
          .my-issues-table-head,
          .my-issues-page
          .my-issues-table-row {
            min-width: 850px;
          }

        }


        @media (max-width: 650px) {

          .my-issues-page
          .my-issues-header {
            height: auto;

            min-height: 74px;

            padding: 14px 18px;

            gap: 15px;
          }


          .my-issues-page
          .my-issues-header-actions {
            gap: 6px;
          }


          .my-issues-page
          .my-issues-back-button {
            padding: 0 10px;
          }


          .my-issues-page
          .my-issues-create-button {
            padding: 0 11px;
          }


          .my-issues-page
          .my-issues-container {
            width: calc(100% - 30px);

            padding-top: 30px;
          }


          .my-issues-page
          .my-issues-title h1 {
            font-size: 26px;
          }

        }


        @media (max-width: 480px) {

          .my-issues-page
          .my-issues-header {
            align-items: flex-start;
          }


          .my-issues-page
          .my-issues-header-actions {
            flex-direction: column;

            align-items: stretch;
          }


          .my-issues-page
          .my-issues-back-button,
          .my-issues-page
          .my-issues-create-button {
            width: 100%;
          }


          .my-issues-page
          .my-issues-brand-text strong {
            font-size: 15px;
          }


          .my-issues-page
          .my-issues-brand-text span {
            font-size: 9px;
          }

        }

      `}</style>

    </div>
  );
}

export default MyIssues;