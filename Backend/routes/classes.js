const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

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
    const { name, studentsCount } = req.body;

    const newClass = new Class({ name, studentsCount });
    await newClass.save();

    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
