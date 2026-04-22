import { Router, Request, Response } from "express";
import { getProducts, getProductById, getSimilarProducts } from "../models/products.model";

export const productsRouter = Router();

productsRouter.get("/products-list", async (req: Request, res: Response) => {
    try {
        const products = await getProducts();
        res.render("products-list", { products });
    } catch (e) {
        res.status(500).send("Something went wrong");
    }
});

productsRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const product = await getProductById(req.params.id);
        const similar = await getSimilarProducts(req.params.id);
        res.render("product-details", { product, similar });
    } catch (e) {
        res.status(500).send("Something went wrong");
    }
});