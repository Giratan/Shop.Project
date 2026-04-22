import express, { Express } from "express";
import path from "path";
import layouts from "express-ejs-layouts";

const host = process.env.LOCAL_PATH;
const port = Number(process.env.LOCAL_PORT);

export function initServer(): Express {
  const app = express();

  const jsonMiddleware = express.json();
  app.use(jsonMiddleware);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../../Shop.Client/views'));
  
  app.use(layouts);

  app.use(express.static(path.join(__dirname, '../../Shop.Client/public')));

  app.listen(port, host ?? '', () => {
    console.log(`Server running on port ${port}`);
  });

  return app;
}

