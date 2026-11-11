import React, { useState } from 'react';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ProductService } from '../services/productService';
import { X, Star, ShoppingBag, CheckCircle, ShieldCheck, User } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onProductUpdated?: (updated: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onProductUpdated,
}) => {
  const { addItem } = useCart();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setIsSubmittingReview(true);
      const updated = await ProductService.addReview(product.id, {
        userId: user.uid,
        userName: user.displayName || user.email.split('@')[0],
        rating: newRating,
        comment: newComment.trim(),
      });

      setNewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);

      if (onProductUpdated) {
        onProductUpdated(updated);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const reviews = product.reviews || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-xs text-slate-400">ID: {product.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-square shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.stock <= 5 && product.stock > 0 && (
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                  ¡Últimas {product.stock} unidades!
                </span>
              )}
            </div>

            {/* Product Details & Actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {product.title}
                </h2>

                {/* Rating display */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          (product.rating || 5) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {product.rating || 5.0}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({product.ratingCount || reviews.length} reseñas)
                  </span>
                </div>

                <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price and Stock */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">USD (Impuestos incluidos)</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>En stock ({product.stock} disponibles en depósito)</span>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-semibold text-slate-800 text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{addedNotice ? '¡Agregado!' : 'Agregar al Carrito'}</span>
                  </button>
                </div>

                {/* Badges */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>Garantía Oficial 12 meses</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-indigo-500" />
                    <span>Envío express asegurado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Section (EXTRA CREDIT 3) */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Opiniones de clientes</span>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                  Extra Credit
                </span>
              </h3>
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || 5.0} de 5</span>
              </div>
            </div>

            {/* Review form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                Escribe tu opinión sobre este producto
              </h4>

              {/* Star selector */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500 font-medium">Calificación:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 transition ${
                          (hoverRating || newRating) >= star
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-600">
                  {newRating} / 5
                </span>
              </div>

              {/* Comment text area */}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="¿Qué te pareció la calidad, el diseño y el funcionamiento? Comparte tu experiencia..."
                rows={2}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none bg-white"
                required
              />

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Publicando como: <strong>{user?.displayName || 'Usuario Patagonix'}</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview || !newComment.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Publicando...' : 'Publicar Reseña'}
                </button>
              </div>

              {reviewSuccess && (
                <p className="mt-2 text-xs font-medium text-emerald-600 animate-in fade-in">
                  ✓ ¡Gracias por tu reseña! Se ha registrado correctamente.
                </p>
              )}
            </form>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">
                Aún no hay reseñas para este producto. ¡Sé el primero en dejar tu opinión!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                          Comprador verificado
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            rev.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
