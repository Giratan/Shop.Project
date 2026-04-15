import mysql, { Connection } from "mysql2/promise";

export async function initDataBase(): Promise<Connection | null> {
  let connection: Connection | null = null;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      password: 'YES',
      user: 'editor',
      database: 'ProductsApplication'
    });
  } catch (err) {
    console.error((err as Error).message || err);
    return null;
  }

  console.log(`Connection to DB ProductsApplication established`);

  return connection;
}
