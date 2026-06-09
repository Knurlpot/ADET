import mysql from 'mysql2/promise';


// Gawa kayo .env file

// Lagay niyo sa .env file yung database connection details niyo, example:
// DB_HOST=localhost
// DB_PORT=3306
// DB_NAME=todo_app
// DB_USER=root
// DB_PASSWORD=

export async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  return connection;
}
