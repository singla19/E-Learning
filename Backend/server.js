const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const classRoutes = require('./routes/classRoutes');
const assignmentRoutes = require('./routes/assignments');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://bhavaysingla2006:Bhavay2006%40@cluster0.4zkqiks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Routes
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);

// MongoDB Connection & Server Start
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
