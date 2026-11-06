import { Sequelize } from "sequelize";

// Initialize Sequelize connection with environment-aware SQL logging
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "postgres",
    // Disable SQL query logging in production to protect sensitive data and reduce I/O overhead
    logging: process.env.NODE_ENV === "production" ? false : console.log,
  }
);

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default db;