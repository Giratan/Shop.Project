export interface ProductImage {
  id: string;
  url: string;
  main: boolean;
}

export interface ProductComment {
  id: string;
  name: string;
  email: string;
  body: string;
  productId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: ProductImage;
  images?: ProductImage[];
  comments?: ProductComment[];
}

export interface SimilarProduct {
  id: string;
  title: string;
  price: number;
}

export interface ProductsStats {
  totalProducts: number;
  totalPrice: number;
}

export interface ProductFilter {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface NewComment {
  productId: string;
  name: string;
  email: string;
  body: string;
}
