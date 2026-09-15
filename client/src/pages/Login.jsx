import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API_URL from "../api/api";


function Login() {

  const navigate = useNavigate();


  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });


  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleChange = (event) => {

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


      const email =
        formData.email.trim();

      const password =
        formData.password;


      /* =========================
         FRONTEND VALIDATION
      ========================== */

      if (!email) {

        setError(
          "Email is required."
        );

        return;
      }


      if (!password) {

        setError(
          "Password is required."
        );

        return;
      }


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(email)
      ) {

        setError(
          "Please enter a valid email address."
        );

        return;
      }


      try {

        setLoading(true);


        const response =
          await fetch(
            `${API_URL}/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  email,
                  password,
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


        if (!response.ok) {

          throw new Error(
            data.message ||
              "Unable to login. Please try again."
          );

        }


        if (!data.token) {

          throw new Error(
            "Login succeeded but no authentication token was received."
          );

        }


        /* =========================
           STORE AUTHENTICATION
        ========================== */

        localStorage.setItem(
          "token",
          data.token
        );


        if (data.user) {

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

        }


        navigate("/dashboard");

      } catch (error) {

        console.error(
          "Login error:",
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
              "Login failed. Please try again."
          );

        }

      } finally {

        setLoading(false);

      }

    };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link
          to="/"
          className="auth-logo"
        >

          <div className="auth-logo-icon">
            IN
          </div>

          IssueNest

        </Link>


        <h1>
          Welcome back
        </h1>


        <p>
          Sign in to manage your
          team's issues.
        </p>


        {/* =====================
            ERROR
        ====================== */}

        {error && (
          <div className="auth-error">
            <span className="auth-error-icon">
              !
            </span>

            <span>
              {error}
            </span>
          </div>
        )}


        <form
          className="auth-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />

          </div>


          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Login"}

          </button>

        </form>


        <div className="auth-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Create one
          </Link>

        </div>

      </div>

    </div>
  );
}


export default Login;