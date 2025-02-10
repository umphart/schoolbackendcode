const express = require('express');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const router = express.Router(); // Define the router here

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png)'));
    }
  },
});

// PUT route to update student details
router.put('/api/update-student/:studentID', upload.single('photo'), (req, res) => {
  const studentID = decodeURIComponent(req.params.studentID);
  console.log(studentID);
  const { name, section, class: className, dob, guidanceName, guidanceContact, gender } = req.body;
  const photo = req.file ? req.file.filename : null;

  if (!name || !section || !className || !dob || !guidanceName || !guidanceContact || !gender) {
    return res.status(400).send('Please fill out all fields correctly.');
  }

  // Determine which table to update based on section
  let table = '';
  if (section === 'Primary') {
    table = 'primary_students';
  } else if (section === 'Junior') {
    table = 'junior_students';
  } else if (section === 'Senior') {
    table = 'senior_students';
  }

  if (!table) {
    return res.status(400).send('Invalid section');
  }

  // First, check if the student exists in the appropriate table
  const checkQuery = `SELECT COUNT(*) AS count FROM ${table} WHERE studentID = ?`;
  db.query(checkQuery, [studentID], (err, result) => {
    if (err) {
      return res.status(500).send('Error checking student record');
    }

    if (result[0].count === 0) {
      return res.status(404).send('Student not found');
    }

    // Update student record in the appropriate table
    const updateStudentQuery = `
      UPDATE ${table} 
      SET name = ?, section = ?, class = ?, dob = ?, guidanceName = ?, guidanceContact = ?, gender = ?, profilePhoto = ?
      WHERE studentID = ?
    `;
    db.query(updateStudentQuery, [name, section, className, dob, guidanceName, guidanceContact, gender, photo || null, studentID], (err) => {
      if (err) {
        console.error('Error updating student record:', err);
        return res.status(500).send('Error updating student record');
      }

      // Update student record in the users table
      const updateUserQuery = `
        UPDATE users
        SET name = ?, section = ?, class = ?, dob = ?, guidanceName = ?, guidanceContact = ?, gender = ?, profilePhoto = ?
        WHERE studentID = ?
      `;
      db.query(updateUserQuery, [name, section, className, dob, guidanceName, guidanceContact, gender, photo || null, studentID], (err) => {
        if (err) {
          console.error('Error updating user record:', err);
          return res.status(500).send('Error updating user record');
        }

        res.status(200).send({ message: 'Student and user records updated successfully!', studentID });
      });
    });
  });
});

router.put('/api/updateStudentPassword', (req, res) => {
  const { studentID, currentPassword, newPassword } = req.body;

  if (!studentID || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if the current password matches
  const checkQuery = `SELECT * FROM users WHERE studentID = ? AND password = ?`;
  db.query(checkQuery, [studentID, currentPassword], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Update the password
    const updateQuery = `UPDATE users SET password = ? WHERE studentID = ?`;
    db.query(updateQuery, [newPassword, studentID], (updateErr) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: 'Error updating password.' });
      }

      res.status(200).json({ message: 'Password updated successfully.' });
    });
  });
});


module.exports = router;
