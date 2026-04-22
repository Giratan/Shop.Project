import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">Shop.Client</div>
      <div className="header-controls">
        <Link to="/products-list">Список товаров</Link>
        <a href="/admin" target="_blank" rel="noopener noreferrer">
          Админка
        </a>
      </div>
    </header>
  );
};

export default Header;
