const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title: { type: String, required: true },
  deadline: { type: String, required: true }, // renamed from dueDate to match your frontend
  pdfUrl: { type: String, required: false },  // optional PDF
  comments: [{ type: String }]                // array of comments
});

module.exports = mongoose.model('Assignment', assignmentSchema);
