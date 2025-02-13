const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',    // Ensure this is correct
  user: 'root',         // Ensure your MySQL username is correct
  password: '',  
  database: 'school',   // Ensure the 'school' database exists
  port: 3306            // Optional: Add port if your MySQL runs on a different port
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);  // Exit the process if the connection fails
  }
  console.log('Database connected successfully');
});

module.exports = db;
