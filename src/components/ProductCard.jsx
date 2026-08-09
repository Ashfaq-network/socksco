import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { formatLKR } from '@lib/format'

export default function ProductCard({ product, compact = false }) {
  const img = product.images?.[0] || '/images/products/men-crew-navy.svg'

  return (
    <Link to={`/shop/${product.slug}`} className="product-card group">
      <div className="media relative">
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {product.is_new && (
          <span className="badge absolute top-3 left-3 bg-white/90 text-brand-700 shadow-sm">
            NEW
          </span>
        )}
        {product.is_best_seller && (
          <span className="badge absolute top-3 right-3 bg-accent-500 text-white shadow-sm">
            Best Seller
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[0.7rem] font-bold tracking-widest uppercase text-muted-ink">
          {product.category_name || 'Wholesale Socks'}
        </p>
        <h3 className="mt-1 font-heading font-bold text-brand-900 text-[1.05rem] leading-snug line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-extrabold text-brand-700">
              {formatLKR(product.price_per_pair)}
              <span className="text-xs font-semibold text-muted-ink ml-1">/ pair</span>
            </p>
            {product.bundle_price ? (
              <p className="text-xs font-semibold text-accent-600 mt-0.5">
                {formatLKR(product.bundle_price)} / dozen ({product.bundle_size || 12} prs)
              </p>
            ) : (
              <p className="text-xs font-semibold text-accent-600 mt-0.5">
                Min. order {product.moq || 12} pairs
              </p>
            )}
          </div>
          <span className="w-9 h-9 rounded-full border border-brand-200 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300 flex-shrink-0">
            <Package className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
