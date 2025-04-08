const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ---------------------- ROUTES ---------------------- */

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new class
router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add assignment with PDF
router.post('/:id/assignments', upload.single('pdf'), async (req, res) => {
  try {
    const classId = req.params.id;
    const { title, description, comment } = req.body;
    const pdf = req.file ? req.file.filename : null;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      {
        $push: {
          assignments: {
            title,
            description,
            pdf,
            comments: comment ? [comment] : [],
          },
        },
      },
      { new: true }
    );

    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add announcement
router.post('/:id/announcements', async (req, res) => {
  try {
    const classId = req.params.id;
    const { text } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $push: { announcements: { text } } },
      { new: true }
    );

    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add study material (video or link)
router.post('/:id/study-materials', async (req, res) => {
  try {
    const classId = req.params.id;
    const { type, content } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $push: { studyMaterials: { type, content } } },
      { new: true }
    );

    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single class by ID
router.get('/:id', async (req, res) => {
  try {
    const classId = req.params.id;
    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(foundClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
