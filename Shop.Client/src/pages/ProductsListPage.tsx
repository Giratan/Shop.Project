import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../services/api';
import { Product, ProductFilter } from '../types';

const ProductsListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProductFilter>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getAll();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Не удалось загрузить товары');
        console.error('Ошибка загрузки товаров:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (filter.search) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(filter.search!.toLowerCase())
      );
    }

    if (filter.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filter.maxPrice!);
    }

    setFilteredProducts(filtered);
  }, [products, filter]);

  const handleFilterChange = (newFilter: ProductFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="loading">
        <h1>Загрузка товаров...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h1>Ошибка</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="products-list-page">
      <h1>Список товаров ({filteredProducts.length})</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по названию"
          value={filter.search || ''}
          onChange={(e) => handleFilterChange({ ...filter, search: e.target.value })}
        />
        <input
          type="number"
          placeholder="Цена от"
          value={filter.minPrice || ''}
          onChange={(e) => handleFilterChange({ 
            ...filter, 
            minPrice: e.target.value ? Number(e.target.value) : undefined 
          })}
        />
        <input
          type="number"
          placeholder="Цена до"
          value={filter.maxPrice || ''}
          onChange={(e) => handleFilterChange({ 
            ...filter, 
            maxPrice: e.target.value ? Number(e.target.value) : undefined 
          })}
        />
        <button onClick={() => setFilter({})}>Очистить фильтры</button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/${product.id}`}>
              <h2>{product.title}</h2>
              <img
                src={
                  product.thumbnail?.url || 
                  'https://via.placeholder.com/300x200?text=No+Image'
                }
                alt={product.title}
              />
              <p>Цена: ${product.price}</p>
              <p>Комментариев: {product.comments?.length || 0}</p>
            </Link>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>Товаров, соответствующих вашим критериям, не найдено.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsListPage;
