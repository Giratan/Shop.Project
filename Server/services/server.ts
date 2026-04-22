import express, { Express } from "express";
import path from "path";
// @ts-ignore
import layouts from "express-ejs-layouts";

const host = process.env.LOCAL_PATH;
const port = Number(process.env.LOCAL_PORT);

export function initServer(): Express {
  const app = express();

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // View engine setup
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../../Shop.Admin/views'));
  
  // Layouts middleware
  app.use(layouts);

  // Static files
  app.use(express.static(path.join(__dirname, '../../Shop.Admin/public')));

  app.listen(port, host ?? '', () => {
    console.log(`Server running on port ${port}`);
  });

  return app;
}

