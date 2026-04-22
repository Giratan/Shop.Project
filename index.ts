require('dotenv').config();

import express, { Express, Request, Response, NextFunction } from "express";
import { Connection } from "mysql2/promise";
import { initDataBase } from "./Server/services/db";
import { initServer } from "./Server/services/server";
import ShopAPI from "./Shop.API";
import ShopAdmin from "./Shop.Admin";
import path from "path";

export let server: Express;
export let connection: Connection;

async function launchApplication() {
  server = initServer();
  connection = await initDataBase();

  initRouter();
}

function initRouter() {
  const shopApi = ShopAPI(connection);
  server.use("/api", shopApi);

  const shopAdmin = ShopAdmin();
  server.use("/admin", shopAdmin);

  // Serve React build files
  const buildPath = path.join(__dirname, "Shop.Client", "build");
  server.use(express.static(buildPath));
  
  // For any request that doesn't match API or admin routes, serve React app
  server.get(/^\/(?!api|admin).*$/, (req: Request, res: Response) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}


launchApplication();