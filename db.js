const { Pool } = require('pg');

// Use the external URL for Render PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://schooldatabase_e96w_user:OmKs393rULKBQ5xHspj3RNkJfBmJTQuO@dpg-cumbbpl6l47c73983dlg-a.oregon-postgres.render.com/schooldatabase_e96w',
  ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;
