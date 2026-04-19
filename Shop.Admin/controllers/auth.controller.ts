import { Router, Request, Response } from "express";
import { throwServerError } from "./helpers";
import { IAuthRequisites } from "@Shared/types";
import { verifyRequisites } from "../models/auth.model";

export const authRouter = Router();

authRouter.get("/login", async (req: Request, res: Response) => {
    try {
        res.render("login");
        console.log("Login form is rendered");
    } catch (e) {
        throwServerError(res, e as Error);
    }
});

authRouter.post("/authenticate", async (
    req: Request<{}, {}, IAuthRequisites>,
    res: Response
) => {
    try {
        const verified = await verifyRequisites(req.body);

        if (verified) {
            res.redirect(`/${process.env.ADMIN_PATH}`)
            console.log("User is authenticated");
        } else {
            res.redirect(`/${process.env.ADMIN_PATH}/auth/login`);
            console.log("User is not authenticated");
        }
    } catch (e) {
        throwServerError(res, e as Error);
    }
});

