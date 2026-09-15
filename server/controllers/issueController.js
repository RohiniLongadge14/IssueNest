const Issue = require("../models/Issue");

// Get all issues
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issues",
      error: error.message,
    });
  }
};


// Get my issues
const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      createdBy: req.user.userId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your issues",
      error: error.message,
    });
  }
};


// Get one issue
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issue",
      error: error.message,
    });
  }
};


// Create an issue
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      category,
    } = req.body;

    // Check required fields
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // Create issue using authenticated user's ID
    const issue = await Issue.create({
      title,
      description,
      priority,
      status,
      category,
      createdBy: req.user.userId,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create issue",
      error: error.message,
    });
  }
};


// Update an issue
const updateIssue = async (req, res) => {
  try {

    // Find the issue first
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }


    // Check ownership
    if (
      issue.createdBy.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to update this issue",
      });
    }


    // Update allowed fields
    issue.title =
      req.body.title ?? issue.title;

    issue.description =
      req.body.description ?? issue.description;

    issue.priority =
      req.body.priority ?? issue.priority;

    issue.status =
      req.body.status ?? issue.status;

    issue.category =
      req.body.category ?? issue.category;


    const updatedIssue =
      await issue.save();

    res.status(200).json(updatedIssue);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update issue",
      error: error.message,
    });
  }
};


// Delete an issue
const deleteIssue = async (req, res) => {
  try {

    // Find the issue first
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }


    // Check ownership
    if (
      issue.createdBy.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this issue",
      });
    }


    await issue.deleteOne();

    res.status(200).json({
      message: "Issue deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete issue",
      error: error.message,
    });
  }
};


module.exports = {
  getIssues,
  getMyIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
};