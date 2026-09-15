import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="app">

      {/* ================================
          NAVBAR
      ================================= */}

      <header className="navbar">

        <Link to="/" className="brand">

          <div className="brand-icon">
            IN
          </div>

          <div>
            <h1>IssueNest</h1>

            <p>
              Issue Management
            </p>
          </div>

        </Link>


        <Link
          to="/login"
          className="login-button"
        >
          Login
        </Link>

      </header>


      {/* ================================
          HERO
      ================================= */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="badge">
              ISSUE MANAGEMENT MADE SIMPLE
            </div>


            <h2>
              Keep your team's issues
              <br />
              <span>under control.</span>
            </h2>


            <p className="hero-description">
              Report problems, prioritize work, track progress,
              and resolve issues from one simple workspace.
            </p>


            <div className="hero-actions">

              <Link
                to="/register"
                className="primary-button"
              >
                Get Started
              </Link>


              <Link
                to="/dashboard"
                className="secondary-button"
              >
                View Dashboard
              </Link>

            </div>


            {/* ================================
                FEATURES
            ================================= */}

            <div className="features">

              <div className="feature-card">

                <strong>
                  Track
                </strong>

                <p>
                  Keep every issue organized in one place.
                </p>

              </div>


              <div className="feature-card">

                <strong>
                  Prioritize
                </strong>

                <p>
                  Focus on critical work before it becomes a blocker.
                </p>

              </div>


              <div className="feature-card">

                <strong>
                  Resolve
                </strong>

                <p>
                  Move issues from open to resolved with clarity.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Landing;