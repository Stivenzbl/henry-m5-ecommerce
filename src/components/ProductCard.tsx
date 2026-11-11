import React, { useState } from 'react';
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Check, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail(product);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`Ver detalles y reseñas de ${product.title}`}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          
          {/* Category Tag */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
            {product.category}
          </span>

          {/* Quick view hint */}
          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              Ver detalle & Reseñas
            </span>
          </div>

          {/* Low Stock Warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute bottom-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              ¡Pocas unidades!
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Rating (Extra credit 3) */}
          <div className="flex items-center gap-1.5 mb-2 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-slate-800">{product.rating || 5.0}</span>
            <span className="text-slate-400">
              ({product.ratingCount || product.reviews?.length || 0})
            </span>
          </div>

          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          <p className="mt-1 text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Precio</span>
          <span className="text-xl font-extrabold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
          } disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Agregado</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
