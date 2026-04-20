import axios from "axios";
import { IAuthRequisites } from "@Shared/types";
import { API_HOST } from "./const";

export async function verifyRequisites(
    requisites: IAuthRequisites
): Promise<boolean> {
    try {
        console.log( `${API_HOST}/auth`);
        console.log(requisites);
        
        const { status } = await axios.post(
            `${API_HOST}/auth`,
            requisites
        );

        console.log(status);

        return status === 200;
    } catch (err) {
        console.log((err as Error).message);
        console.log((err as Error).name);
        return false;
    }
}