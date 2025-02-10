const express = require('express');
const db = require('./db');
const multer = require('multer');
const path = require('path');

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

const router = express.Router();

// Update Staff Details Route
router.put('/api/staff/update/:staffID', upload.single('photo'), (req, res) => {
  const { staffID } = req.params;
  const { name, department, phone, email, gender } = req.body;
  const profilePhoto = req.file ? req.file.filename : null;

  if (!name || !department || !phone || !email || !gender) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Update staff details in the 'staff' table
  const staffQuery = `
    UPDATE staff 
    SET name = ?, department = ?, phone = ?, email = ?, gender = ?, profilePhoto = COALESCE(?, profilePhoto)
    WHERE staffID = ?
  `;

  db.query(staffQuery, [name, department, phone, email, gender, profilePhoto, staffID], (err, result) => {
    if (err) {
      console.error('Error updating staff record:', err);
      return res.status(500).json({ error: 'Error updating staff record' });
    }

    // Update user details in the 'users' table
    const userQuery = `
      UPDATE users 
      SET name = ?, department = ?, phone = ?, email = ?, gender = ?, profilePhoto = COALESCE(?, profilePhoto)
      WHERE staffID = ?
    `;

    db.query(userQuery, [name, department, phone, email, gender, profilePhoto, staffID], (err, userResult) => {
      if (err) {
        console.error('Error updating user record:', err);
        return res.status(500).json({ error: 'Error updating user record' });
      }

      // Update staff name in 'staff_subjects' table
      const subjectQuery = `
        UPDATE staff_subjects 
        SET staffName = ? 
        WHERE staffID = ?
      `;

      db.query(subjectQuery, [name, staffID], (err, subjectResult) => {
        if (err) {
          console.error('Error updating staff subject assignments:', err);
          return res.status(500).json({ error: 'Error updating staff subject assignments' });
        }

        return res.status(200).json({ message: 'Staff details updated successfully!' });
      });
    });
  });
});

router.put('/api/updatePassword', (req, res) => {
  const { staffID, currentPassword, newPassword } = req.body;

  if (!staffID || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if the current password matches
  const checkQuery = `SELECT * FROM users WHERE staffID = ? AND password = ?`;
  db.query(checkQuery, [staffID, currentPassword], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Update the password
    const updateQuery = `UPDATE users SET password = ? WHERE staffID = ?`;
    db.query(updateQuery, [newPassword, staffID], (updateErr) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: 'Error updating password.' });
      }

      res.status(200).json({ message: 'Password updated successfully.' });
    });
  });
});


module.exports = router;

  
