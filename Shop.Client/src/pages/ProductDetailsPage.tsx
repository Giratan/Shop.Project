import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi, commentsApi } from '../services/api';
import { Product, SimilarProduct, NewComment } from '../types';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<NewComment>({
    productId: id || '',
    name: '',
    email: '',
    body: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [productData, similarData] = await Promise.all([
          productsApi.getById(id),
          productsApi.getSimilar(id),
        ]);
        setProduct(productData);
        setSimilarProducts(similarData);
      } catch (err) {
        setError('Не удалось загрузить детали товара');
        console.error('Ошибка загрузки товара:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.name || !newComment.email || !newComment.body) {
      setCommentError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setSubmitting(true);
      setCommentError(null);
      await commentsApi.create(newComment);
      
      // Reset form
      setNewComment({
        productId: id || '',
        name: '',
        email: '',
        body: '',
      });
      
      // Refresh product data to show new comment
      if (id) {
        const updatedProduct = await productsApi.getById(id);
        setProduct(updatedProduct);
      }
    } catch (err) {
      setCommentError('Не удалось добавить комментарий');
      console.error('Ошибка добавления комментария:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h1>Загрузка деталей товара...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error">
        <h1>Ошибка</h1>
        <p>{error || 'Товар не найден'}</p>
        <Link to="/products-list">Назад к товарам</Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <h1>{product.title}</h1>
      
      <div className="product-images">
        {product.thumbnail && (
          <img
            src={product.thumbnail.url}
            alt={product.title}
            className="main-image"
          />
        )}
        
        {product.images && product.images.length > 0 && (
          <div className="additional-images">
            {product.images
              .filter(img => !img.main)
              .map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`${product.title} ${index + 1}`}
                  className="additional-image"
                />
              ))}
          </div>
        )}
      </div>

      <p className="description">{product.description}</p>
      <p className="price">Цена: ${product.price}</p>

      <div className="similar-products">
        <h2>Похожие товары</h2>
        {similarProducts.length > 0 ? (
          similarProducts.map(similar => (
            <div key={similar.id} className="similar-product">
              <Link to={`/${similar.id}`}>{similar.title}</Link>
              <p>Цена: ${similar.price}</p>
            </div>
          ))
        ) : (
          <p>Похожие товары не найдены</p>
        )}
      </div>

      <div className="comments-section">
        <h2>Комментарии</h2>
        {product.comments && product.comments.length > 0 ? (
          product.comments.map(comment => (
            <div key={comment.id} className="comment">
              <h3>{comment.name}</h3>
              <p>{comment.email}</p>
              <p>{comment.body}</p>
            </div>
          ))
        ) : (
          <p>Комментариев пока нет</p>
        )}
      </div>

      <div className="add-comment">
        <h2>Добавить комментарий</h2>
        <form onSubmit={handleCommentSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Заголовок"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="E-mail"
              value={newComment.email}
              onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Текст комментария"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
              required
            />
          </div>
          {commentError && <p className="error">{commentError}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>

      <Link to="/products-list" className="back-link">
        Назад к списку товаров
      </Link>
    </div>
  );
};

export default ProductDetailsPage;
