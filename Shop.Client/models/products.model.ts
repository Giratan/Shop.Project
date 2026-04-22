import axios from "axios";
import { IProduct, SimilarProduct } from "@Shared/types";


export async function getProductsStats() {
    const response = await axios.get("/api/products");
    const products: IProduct[] = response.data;
    const totalProducts = products.length;
    const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
    return { totalProducts, totalPrice };
}

export async function getProducts() {
    const response = await axios.get("/api/products");
    return response.data;
}

export async function getProductById(id: string) {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
}

export async function getSimilarProducts(id: string) {
    const response = await axios.get(`/api/products/similar/${id}`);
    return response.data as SimilarProduct[];
}