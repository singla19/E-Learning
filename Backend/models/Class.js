const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  pdf: String,
  comments: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const studyMaterialSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['video', 'link'],
    required: true,
  },
  content: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentsCount: { type: Number, default: 0 },
  assignments: [assignmentSchema],
  announcements: [announcementSchema],
  studyMaterials: [studyMaterialSchema],
});

module.exports = mongoose.model('Class', classSchema);
