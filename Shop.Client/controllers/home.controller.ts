import { Router, Request, Response } from 'express';
import { getProductsStats } from "../models/products.model";

export const homeRouter = Router();

homeRouter.get("/", async (req: Request, res: Response) => {
    try {
        const stats = await getProductsStats();
        res.render("home", stats);
    } catch (e) {
        res.status(500).send("Something went wrong");
    }
});