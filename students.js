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
const putRoutes = require('./putRoutes')
const deleteRoutes= require('./deleteRoutes')
const port = 5000;

// Middleware
app.use(cors());  // To handle CORS requests from React frontend
app.use(bodyParser.json());  // To parse JSON request bodies
app.use('/uploads', express.static('uploads')); 
 
app.use(studentPostRoutes);
app.use(studentGetRoutes);
app.use(studentPutRoutes);
app.use(studentDeleteRoutes);
app.use(staffGetRoutes);
app.use(staffPostRoutes);
app.use(staffPutRoutes);
app.use(staffDeleteRoutes);
app.use(examResultPostRoutes); 
app.use(examResultGetRoutes); 
app.use(putRoutes)
app.use(deleteRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
