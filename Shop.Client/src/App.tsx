import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsListPage from './pages/ProductsListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products-list" element={<ProductsListPage />} />
            <Route path="/:id" element={<ProductDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
