const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/teacherDashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

const classRoutes = require('./routes/classRoutes');
app.use('/api/classes', classRoutes);

