import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateIssue from "./pages/CreateIssue";
import Issues from "./pages/Issues";
import MyIssues from "./pages/MyIssues";
import IssueDetails from "./pages/IssueDetails";
import EditIssue from "./pages/EditIssue";

import ProtectedRoute from "./ProtectedRoute";

import "./App.css";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* ================================
            PUBLIC
        ================================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================
            PROTECTED
        ================================= */}

        <Route
          element={
            <ProtectedRoute />
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/create-issue"
            element={<CreateIssue />}
          />

          <Route
            path="/issues"
            element={<Issues />}
          />

          <Route
            path="/my-issues"
            element={<MyIssues />}
          />

          <Route
            path="/issues/:id"
            element={<IssueDetails />}
          />

          <Route
            path="/issues/:id/edit"
            element={<EditIssue />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}


export default App;