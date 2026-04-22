import axios from 'axios';
import { Product, SimilarProduct, ProductsStats, ProductFilter, NewComment } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const productsApi = {
  // Get all products
  getAll: async (filter?: ProductFilter): Promise<Product[]> => {
    if (filter && (filter.search || filter.minPrice !== undefined || filter.maxPrice !== undefined)) {
      // Use search endpoint for filtered products
      const params = new URLSearchParams();
      if (filter.search) params.append('title', filter.search);
      if (filter.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
      if (filter.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
      
      const response = await api.get(`/api/products/search?${params.toString()}`);
      return response.data;
    } else {
      // Use regular endpoint for all products
      const response = await api.get('/api/products');
      return response.data;
    }
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Get similar products
  getSimilar: async (id: string): Promise<SimilarProduct[]> => {
    const response = await api.get(`/api/products/similar/${id}`);
    return response.data;
  },

  // Get products statistics
  getStats: async (): Promise<ProductsStats> => {
    const response = await api.get('/api/products');
    const products: Product[] = response.data;
    const totalProducts = products.length;
    const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
    return { totalProducts, totalPrice };
  },
};

export const commentsApi = {
  // Add new comment
  create: async (comment: NewComment): Promise<void> => {
    await api.post('/api/comments', comment);
  },
};
