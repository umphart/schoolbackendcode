require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported
const generateStudentID = require('./generateID');
const generateStaffID = require('./generateStaffID');

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

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

// CORS Configuration
app.use(cors({
  origin: ["https://smsproject-iota.vercel.app"], // Replace with your frontend URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(bodyParser.json());  // To parse JSON request bodies

// Routes
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
app.use(putRoutes);
app.use(deleteRoutes);

// Login API
app.post('/api/login', (req, res) => {  
  const { username, password } = req.body;

  const query = `
    SELECT staffID, studentID, name, section, class, dob, guidanceName, guidanceContact, profilePhoto, email, phone, department, gender, password
    FROM users
    WHERE (staffID = ? OR studentID = ?)
  `;

  db.query(query, [username, username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Error comparing passwords:', compareErr);
        return res.status(500).json({ message: 'Server error.' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      let role = user.staffID ? 'Staff' : 'Student';

      res.json({
        role,
        staffID: user.staffID || null,
        studentID: user.studentID || null,
        email: user.email,
        phone: user.phone, // staff phone
        department: user.department, // staff department
        name: user.name,
        section: user.section,
        class: user.class,
        dob: user.dob,
        gender: user.gender, // staff gender
        guidanceName: user.guidanceName,
        guidanceContact: user.guidanceContact,
        profilePhoto: user.profilePhoto,
      });
    });
  });
});

// Password Update API
app.put('/api/updatePassword', (req, res) => {
  const { staffID, currentPassword, newPassword } = req.body;

  if (!staffID || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const checkQuery = `SELECT * FROM users WHERE staffID = ?`;
  db.query(checkQuery, [staffID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Staff ID not found.' });
    }

    const storedPassword = results[0].password;
    bcrypt.compare(currentPassword, storedPassword, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Error comparing passwords:', compareErr);
        return res.status(500).json({ message: 'Server error.' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }

      // Hash the new password and update
      bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error('Error hashing password:', hashErr);
          return res.status(500).json({ message: 'Error hashing password.' });
        }

        const updateQuery = `UPDATE users SET password = ? WHERE staffID = ?`;
        db.query(updateQuery, [hashedPassword, staffID], (updateErr) => {
          if (updateErr) {
            console.error('Error updating password:', updateErr);
            return res.status(500).json({ message: 'Error updating password.' });
          }

          res.status(200).json({ message: 'Password updated successfully.' });
        });
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`}`);
});
  