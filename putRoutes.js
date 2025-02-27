// putRoutes.js
const express = require('express');
const db = require('./db');

const router = express.Router();
// Update first term record with automatic total, grade, and remarks calculation
router.put('/api/update-first/:id', (req, res) => {
  const { id } = req.params; // Extract the record ID from the URL
  const { subject, caExam, examMark } = req.body; // Extract the updated data from the request body

  // Convert caExam and examMark to numbers for calculations
  const caExamNumber = Number(caExam);
  const examMarkNumber = Number(examMark);

  // Calculate the total marks (CA + Exam)
  const total = caExamNumber + examMarkNumber;

  // Ensure total does not exceed 100
  if (total > 100) {
    return res.status(400).json({ message: 'Total marks (CA + Exam) cannot exceed 100.' });
  }

  // Assign grade based on total marks
  let grade = 'F'; // Default grade
  if (total >= 76 && total <= 100) {
    grade = 'A';
  } else if (total >= 65 && total <= 75) {
    grade = 'B';
  } else if (total >= 50 && total <= 64) {
    grade = 'C';
  } else if (total >= 40 && total <= 49) {
    grade = 'D';
  }

  // Assign remarks based on the grade
  let remarks = 'Fail'; // Default remark
  if (grade === 'A') {
    remarks = 'Excellent';
  } else if (grade === 'B') {
    remarks = 'Very good';
  } else if (grade === 'C') {
    remarks = 'Credit';
  } else if (grade === 'D') {
    remarks = 'Pass';
  }

  // SQL query to update the record
  const query = `
    UPDATE first_term 
    SET subject = ?, caExam = ?, examMark = ?, total = ?, grade = ?, remarks = ?
    WHERE id = ?;
  `;

  // Execute the query
  db.query(query, [subject, caExamNumber, examMarkNumber, total, grade, remarks, id], (err, results) => {
    if (err) {
      console.error('Error updating record:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record updated successfully', total, grade, remarks });
  });
});

router.put('/api/update-second/:id', (req, res) => {
  const { id } = req.params; // Extract the record ID from the URL
  const { subject, caExam, examMark } = req.body; // Extract the updated data from the request body

  // Convert caExam and examMark to numbers for calculations
  const caExamNumber = Number(caExam);
  const examMarkNumber = Number(examMark);

  // Calculate the total marks (CA + Exam)
  const total = caExamNumber + examMarkNumber;

  // Ensure total does not exceed 100
  if (total > 100) {
    return res.status(400).json({ message: 'Total marks (CA + Exam) cannot exceed 100.' });
  }

  // Assign grade based on total marks
  let grade = 'F'; // Default grade
  if (total >= 76 && total <= 100) {
    grade = 'A';
  } else if (total >= 65 && total <= 75) {
    grade = 'B';
  } else if (total >= 50 && total <= 64) {
    grade = 'C';
  } else if (total >= 40 && total <= 49) {
    grade = 'D';
  }

  // Assign remarks based on the grade
  let remarks = 'Fail'; // Default remark
  if (grade === 'A') {
    remarks = 'Excellent';
  } else if (grade === 'B') {
    remarks = 'Very good';
  } else if (grade === 'C') {
    remarks = 'Credit';
  } else if (grade === 'D') {
    remarks = 'Pass';
  }

  // SQL query to update the record
  const query = `
    UPDATE second_term 
    SET subject = ?, caExam = ?, examMark = ?, total = ?, grade = ?, remarks = ?
    WHERE id = ?;
  `;

  // Execute the query
  db.query(query, [subject, caExamNumber, examMarkNumber, total, grade, remarks, id], (err, results) => {
    if (err) {
      console.error('Error updating record:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record updated successfully', total, grade, remarks });
  });
});
router.put('/api/update-third/:id', (req, res) => {
  const { id } = req.params; // Extract the record ID from the URL
  const { subject, caExam, examMark } = req.body; // Extract the updated data from the request body

  // Convert caExam and examMark to numbers for calculations
  const caExamNumber = Number(caExam);
  const examMarkNumber = Number(examMark);

  // Calculate the total marks (CA + Exam)
  const total = caExamNumber + examMarkNumber;

  // Ensure total does not exceed 100
  if (total > 100) {
    return res.status(400).json({ message: 'Total marks (CA + Exam) cannot exceed 100.' });
  }

  // Assign grade based on total marks
  let grade = 'F'; // Default grade
  if (total >= 76 && total <= 100) {
    grade = 'A';
  } else if (total >= 65 && total <= 75) {
    grade = 'B';
  } else if (total >= 50 && total <= 64) {
    grade = 'C';
  } else if (total >= 40 && total <= 49) {
    grade = 'D';
  }

  // Assign remarks based on the grade
  let remarks = 'Fail'; // Default remark
  if (grade === 'A') {
    remarks = 'Excellent';
  } else if (grade === 'B') {
    remarks = 'Very good';
  } else if (grade === 'C') {
    remarks = 'Credit';
  } else if (grade === 'D') {
    remarks = 'Pass';
  }

  // SQL query to update the record
  const query = `
    UPDATE third_term 
    SET subject = ?, caExam = ?, examMark = ?, total = ?, grade = ?, remarks = ?
    WHERE id = ?;
  `;

  // Execute the query
  db.query(query, [subject, caExamNumber, examMarkNumber, total, grade, remarks, id], (err, results) => {
    if (err) {
      console.error('Error updating record:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record updated successfully', total, grade, remarks });
  });
});
router.put('/api/updatePassword', (req, res) => {
  const { staffID, currentPassword, newPassword } = req.body;

  if (!staffID || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Log input data for debugging
  console.log('Request Data:', { staffID, currentPassword, newPassword });

  const checkQuery = `SELECT * FROM users WHERE staffID = ?`;
  db.query(checkQuery, [staffID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error.' });
    }

    if (results.length === 0) {
      console.log('Staff ID not found.');
      return res.status(404).json({ message: 'Staff ID not found.' });
    }

    const storedPassword = results[0].password;

    // Log the password comparison process
    console.log('Stored Password:', storedPassword);

    bcrypt.compare(currentPassword, storedPassword, (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Error comparing passwords:', compareErr);
        return res.status(500).json({ message: 'Server error.' });
      }

      console.log('Password match status:', isMatch);

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

          console.log('Password updated successfully.');
          res.status(200).json({ message: 'Password updated successfully.' });
        });
      });
    });
  });
});


            
module.exports = router;
