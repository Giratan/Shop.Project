import axios from "axios";
import { IAuthRequisites } from "@Shared/types";
import { API_HOST } from "./const";

export async function verifyRequisites(
    requisites: IAuthRequisites
): Promise<boolean> {
    try {
        const { status } = await axios.post(
            `${API_HOST}/auth` as string,
            requisites
        );

        return status === 200;
    } catch (err) {
        console.log("произошел косяк");
        return false;
    }
}