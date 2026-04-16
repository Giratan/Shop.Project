import mysql, { Connection } from "mysql2/promise";

export async function initDataBase(): Promise<Connection> {
  let connection: Connection | null = null;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      password: 'Gastar63.05',
      user: 'root',
      database: 'productapplication'
    });
  } catch (err) {
    console.error((err as Error).message || err);
    throw new Error("Failed to establish a connection to the database");
  }

  console.log(`Connection to DB Shop.Progect established`);

  return connection;
}
