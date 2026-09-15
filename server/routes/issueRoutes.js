const express = require("express");

const {
  getIssues,
  getMyIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} = require("../controllers/issueController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/issues
router.get("/", protect, getIssues);

// GET /api/issues/my
router.get("/my", protect, getMyIssues);

// GET /api/issues/:id
router.get("/:id", protect, getIssueById);

// POST /api/issues
router.post("/", protect, createIssue);

// PUT /api/issues/:id
router.put("/:id", protect, updateIssue);

// DELETE /api/issues/:id
router.delete("/:id", protect, deleteIssue);

module.exports = router;