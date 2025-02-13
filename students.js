const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const generateStudentID = require('./generateID');
const generateStaffID = require('./generateStaffID');
const app = express();

const studentPostRoutes = require('./studentPostRoutes');
const studentGetRoutes = require('./studentGetRoutes');
const studentPutRoutes = require('./studentPutRoutes');
const studentDeleteRoutes = require('./studentDeleteRoutes');

const staffGetRoutes = require('./staffGetRoutes');
const staffPostRoutes = require('./staffPostRoutes');
const staffPutRoutes = require('./staffPutRoutes');
const staffDeleteRoutes = require('./staffDeleteRoutes');

const examResultPostRoutes = require('./examResultPostRoutes');  
const examResultGetRoutes = require('./examResultGetRoutes'); 

const putRoutes = require('./putRoutes');
const deleteRoutes = require('./deleteRoutes');

const port = process.env.PORT || 5000;

// ✅ Middleware (Fixed)
app.use(cors({
  origin: ['https://smsproject-iota.vercel.app'], // Allow frontend access
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());  
app.use('/uploads', express.static('uploads')); 

// ✅ Use /api prefix for all routes
app.use('/api', studentPostRoutes);
app.use('/api', studentGetRoutes);
app.use('/api', studentPutRoutes);
app.use('/api', studentDeleteRoutes);

app.use('/api', staffGetRoutes);
app.use('/api', staffPostRoutes);
app.use('/api', staffPutRoutes);
app.use('/api', staffDeleteRoutes);

app.use('/api', examResultPostRoutes); 
app.use('/api', examResultGetRoutes); 

app.use('/api', putRoutes);
app.use('/api', deleteRoutes);

// ✅ Test Route to Check if Backend is Running
app.get('/api/test', (req, res) => {
  res.send("Backend is working!");
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
