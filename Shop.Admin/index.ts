import express, { Express } from "express";
import { productsRouter } from "./controllers/products.controller";
import { authRouter } from "./controllers/auth.controller";
import layout from "express-ejs-layouts";
import bodyParser from "body-parser";


export default function (): Express {
    const app = express();
    app.use(express.json());

    app.set("view engine", "ejs");
    app.set("views", "Shop.Admin/views");

    app.use(layout);
    app.use(express.static(__dirname + `/public`));

    app.use(bodyParser.urlencoded({extended: false}));

    app.use("/auth", authRouter);

    app.use("/", productsRouter);

    return app;
}