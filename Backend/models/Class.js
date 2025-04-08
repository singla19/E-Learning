const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentsCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Class', classSchema);
