import mysql, { Connection } from "mysql2/promise";

export async function initDataBase(): Promise<Connection> {
  let connection: Connection | null = null;

  try {
    console.log(process.env.DB_HOST);
    console.log(process.env.DB_PORT);
    console.log(process.env.DB_USER);
    console.log(process.env.DB_PASSWORD);
    console.log(process.env.DB_NAME);
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
  } catch (err) {
    console.error((err as Error).message || err);
    throw new Error("Failed to establish a connection to the database");
  }

  console.log(`Connection to DB Shop.Progect established`);

  return connection;
}
