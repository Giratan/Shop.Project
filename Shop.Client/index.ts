import { Router } from "express"; 
import { homeRouter } from "./controllers/home.controller"; 
import { productsRouter } from "./controllers/products.controller";

export default function ShopClient(): Router {
    const router = Router();

    router.use("/", homeRouter);
    router.use("/products-list", productsRouter);
    router.use("/:id", productsRouter);

    return router;
}