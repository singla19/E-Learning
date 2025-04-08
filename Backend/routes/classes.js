const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// @route POST /api/classes/add
// @desc  Add a new class
router.post('/add', async (req, res) => {
  const { name, numberOfStudents } = req.body;

  try {
    const newClass = new Class({ name, numberOfStudents });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error adding class:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
