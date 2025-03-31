import mysql from 'mysql2/promise';

// Kết nối mysql
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'product_management',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});

export default pool;