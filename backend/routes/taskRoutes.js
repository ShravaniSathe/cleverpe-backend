const express = require("express");
const Task = require("../models/taskModel");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

const router = express.Router();

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, createdBy } = req.body;
    if (!title || !dueDate || !createdBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const task = new Task({ title, description, dueDate, createdBy });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
});

//weekly analysis from monday to friday of current week
router.get("/weekly-analysis", async (req, res) => {
  try {
    // Get the current date
    const today = new Date();

    // Calculate the start of the week (Monday) in UTC
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getUTCDay();
    const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust for Monday being day 1
    startOfWeek.setUTCDate(today.getUTCDate() - diffToMonday); // Set to Monday
    startOfWeek.setUTCHours(0, 0, 0, 0); // Midnight (UTC)
    const startOfWeekUTC = new Date(startOfWeek.toISOString()); // Ensure UTC

    // Calculate the end of the week (Friday) in UTC
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 4); // Friday
    endOfWeek.setUTCHours(23, 59, 59, 999); // End of the day
    const endOfWeekUTC = new Date(endOfWeek.toISOString()); // Ensure UTC

    console.log("Start of Week (UTC):", startOfWeekUTC.toISOString());
    console.log("End of Week (UTC):", endOfWeekUTC.toISOString());

    // Fetch tasks within the date range (createdAt in UTC)
    const tasks = await Task.find({
      createdAt: {
        $gte: startOfWeekUTC,
        $lte: endOfWeekUTC,
      },
    });

    console.log("Tasks found within the date range:", tasks);

    if (tasks.length === 0) {
      return res.status(200).json("No tasks found for the specified week.");
    }

    // Aggregating tasks by day of the week and status
    const taskAggregation = await Task.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeekUTC,
            $lte: endOfWeekUTC,
          },
        },
      },
      {
        $project: {
          createdAt: 1,
          dayOfWeek: { $dayOfWeek: "$createdAt" }, // Adding dayOfWeek to output
          status: 1,
        },
      },
      {
        $group: {
          _id: {
            day: "$dayOfWeek", // Group by dayOfWeek (1 = Sunday, 7 = Saturday)
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("Aggregated tasks:", taskAggregation);

    // Mapping aggregated data to days of the week (Monday to Friday)
    const result = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => {
      const dayIndex = index + 2; // $dayOfWeek: Monday = 2, Friday = 6
      const dayTasks = taskAggregation.filter((task) => task._id.day === dayIndex);

      const completed = dayTasks.find((task) => task._id.status === "Completed")?.count || 0;
      const inProgress = dayTasks.find((task) => task._id.status === "In Progress")?.count || 0;

      return { day, completed, inProgress };
    });

    // Sending response
    res.json(result);

  } catch (error) {
    res.status(500).json({ message: "Error fetching weekly analysis", error: error.message });
  }
});

// Get tasks created and completed over the last month (for line chart)
router.get("/overview", async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    // Aggregate tasks created in the last 30 days
    const createdTasks = await Task.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lte: today } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate tasks completed in the last 30 days
    const completedTasks = await Task.aggregate([
      { $match: { status: "Completed", updatedAt: { $gte: lastMonth, $lte: today } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      createdTasks,
      completedTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching monthly overview",
      error: error.message,
    });
  }
});

// Get task completion statistics
router.get("/statistics", async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const pendingTasks = totalTasks - completedTasks;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error: error.message });
  }
});

// Generate CSV report
router.get("/report/csv", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const tasks = await Task.find(filter).select("title status dueDate createdAt");
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "Completed").length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : "0.00";

    const fields = ["title", "status", "dueDate", "createdAt"];
    const json2csvParser = new Parser({ fields });
    let csv = json2csvParser.parse(tasks);
    csv += `\n\nCompletion Rate: ${completionRate}%`;

    res.header("Content-Type", "text/csv");
    res.attachment("tasks-report.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error generating CSV report", error: error.message });
  }
});

// Generate PDF report
router.get("/report/pdf", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const tasks = await Task.find(filter).select("title status dueDate createdAt");
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "Completed").length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : "0.00";

    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", (data) => buffers.push(data));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.contentType("application/pdf");
      res.send(pdfData);
    });

    doc.text("Task Report", { align: "center" });
    doc.moveDown();

    tasks.forEach((task) => {
      doc.text(
        `Title: ${task.title}\nStatus: ${task.status}\nDue Date: ${task.dueDate}\nCreated At: ${task.createdAt}\n\n`
      );
    });

    doc.moveDown();
    doc.text(`Completion Rate: ${completionRate}%`, { align: "center" });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF report", error: error.message });
  }
});

// Get all tasks (with optional pagination)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tasks = await Task.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// Get task by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task by ID
    const task = await Task.findById(id);

    // If the task is not found, return a 404
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // If found, return the task data
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task by ID", error: error.message });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, dueDate },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
});
module.exports = router;
