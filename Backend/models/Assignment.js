const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title: { type: String, required: true },
  deadline: { type: String, required: true },
  pdfUrl: { type: String, required: false },
  comments: [{ type: String }]                
});

module.exports = mongoose.model('Assignment', assignmentSchema);
