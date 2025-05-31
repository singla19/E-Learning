const express = require('express');
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');

const router = express.Router();

// Multer for PDF upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// GET all assignments
router.get('/', async (req, res) => {
  try {
    const { classId } = req.query;
    const filter = classId ? { classId } : {};
    const assignments = await Assignment.find(filter).populate('classId', 'name');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new assignment
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { classId, title, deadline } = req.body;
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newAssignment = new Assignment({
      classId,
      title,
      deadline,
      pdfUrl,
    });

    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (err) {
    console.error('Error creating assignment:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// POST a comment on a specific assignment
router.post('/:id/comment', async (req, res) => {
  try {
    const { comment } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    assignment.comments.push(comment);
    await assignment.save();

    res.status(200).json(assignment);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
