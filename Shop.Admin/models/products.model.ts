import axios from "axios";
import { IProduct } from "@Shared/types";

const host = 'http://${process.env.LOCAL_HOST}:${process.env.LOCAL_PORT}/${process.env.API_PATH}';
const host1 = 'http://localhost:3000/api';

export async function getProducts() {
    console.log('\n');
    console.log(process.env.LOCAL_HOST);
    console.log(process.env.LOCAL_PORT);
    console.log(process.env.API_PATH);
    console.log(host);
    console.log(host1);
    const { data } = await axios.get<IProduct[]>("${host}/products");

    console.log(data.length);
}