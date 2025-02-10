// routes/staffGetRoutes.js
const express = require('express');
const db = require('./db');
const router = express.Router();
router.get('/api/getStaffMembers', (req, res) => {
  const query = `
    SELECT 
      staff.staffID, 
      staff.name, 
      staff.department, 
      staff.phone, 
      staff.email, 
      staff.gender, 
      GROUP_CONCAT(subject.subject_name SEPARATOR ', ') AS subjects
    FROM staff
    LEFT JOIN staff_subjects ON staff.staffID = staff_subjects.staffID
    LEFT JOIN subject ON staff_subjects.subject_code = subject.subject_code
    GROUP BY staff.staffID;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching staff members:', err);
      return res.status(500).json({ message: 'Error fetching staff data.' });
    }
    res.status(200).json(result);
  });
});
router.get('/api/staff/:staffId', (req, res) => {
  const staffId = decodeURIComponent(req.params.staffId);

  // Query to fetch staff data from the database
  const query = 'SELECT * FROM staff WHERE staffID = ?';
  db.query(query, [staffId], (err, result) => {
      if (err) {
          console.error('Error fetching staff record:', err);
          return res.status(500).json({ error: 'Error fetching staff record' });
      }

      if (result.length === 0) {
          return res.status(404).json({ error: 'Staff member not found' });
      }

      return res.status(200).json(result[0]);  // Assuming you're fetching a single staff record
  });
});



module.exports = router;
