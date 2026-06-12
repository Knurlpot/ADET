import mysql from 'mysql2/promise';

// Gawa kayo .env file

// Lagay niyo sa .env file yung database connection details niyo, example:
// DB_HOST=localhost
// DB_PORT=3306
// DB_NAME=todo_app
// DB_USER=root
// DB_PASSWORD=

export async function getConnection() {
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  console.log("[DB] Connection config:", {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
    // Don't log password for security
  });

  if (!config.host || !config.user || !config.database) {
    throw new Error(
      `Missing database configuration. Got: host=${config.host}, user=${config.user}, database=${config.database}`
    );
  }

  try {
    const connection = await mysql.createConnection(config);
    console.log("[DB] Connection successful");
    return connection;
  } catch (error) {
    console.error("[DB] Connection failed:", error);
    throw error;
  }
}
