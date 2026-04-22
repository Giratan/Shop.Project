import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../services/api';
import { ProductsStats } from '../types';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState<ProductsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getStats();
        setStats(data);
      } catch (err) {
        setError('Не удалось загрузить статистику товаров');
        console.error('Ошибка загрузки статистики:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h1>Загрузка...</h1>
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
    <div className="home-page">
      <h1>Shop.Client</h1>
      {stats && (
        <p>
          В базе данных находится {stats.totalProducts} товаров общей стоимостью {stats.totalPrice}
        </p>
      )}
      <div className="actions">
        <Link to="/products-list">
          <button>Перейти к списку товаров</button>
        </Link>
        <a href="/admin" target="_blank" rel="noopener noreferrer">
          <button>Перейти в систему администрирования</button>
        </a>
      </div>
    </div>
  );
};

export default HomePage;
