import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Minus, Plus, ShoppingBag, FlaskConical, Truck, ShieldCheck, Layers } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchProductBySlug } from '@lib/service'
import { useCartStore } from '@stores/cartStore'
import { formatLKR } from '@lib/format'
import Reveal from '@components/ui/Reveal'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setAdded(false)
    setQty(1)
    setSize(null)
    setColor(null)
    setActiveImg(0)
    fetchProductBySlug(slug)
      .then((p) => {
        setProduct(p)
        if (p?.sizes?.length) setSize(p.sizes[0])
        if (p?.colors?.length) setColor(p.colors[0])
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-brand py-24 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-brand-800">Product not found</h1>
        <Link to="/shop" className="btn-primary mt-6">Back to Shop</Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : ['/images/products/men-crew-navy.svg']

  const handleAdd = () => {
    addItem(product, { size, color, quantity: qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const savings = product.bundle_price && product.price_per_pair
    ? (product.price_per_pair * product.bundle_size) - product.bundle_price
    : 0

  return (
    <div className="container-brand py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-ink mb-8">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-brand-600">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Gallery */}
        <Reveal>
          <div className="rounded-3xl overflow-hidden bg-white border border-mist aspect-square">
            <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImg === i ? 'border-brand-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </Reveal>

        {/* Info */}
        <Reveal delay={0.1}>
          <span className="badge bg-brand-50 text-brand-700">{product.category_name || 'Wholesale Socks'}</span>
          <h1 className="mt-3 font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-brand-800">
            {product.name}
          </h1>
          <p className="mt-4 text-muted-ink leading-relaxed">{product.description}</p>

          {/* Pricing */}
          <div className="mt-6 bg-white rounded-2xl border border-mist p-5">
            <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-ink">1 pair</p>
                <p className="font-heading text-3xl font-extrabold text-brand-700">
                  {formatLKR(product.price_per_pair)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-ink">Bundle · {product.bundle_size || 12} pairs</p>
                <p className="font-heading text-3xl font-extrabold text-accent-600">
                  {product.bundle_price ? formatLKR(product.bundle_price) : '—'}
                </p>
              </div>
              {savings > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-accent-50 text-accent-700 text-sm font-bold">
                  Save {formatLKR(savings)} on bundles
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-muted-ink">
              Minimum order: <span className="font-semibold text-brand-800">{product.moq || 12} pairs</span> per style.
              Not ready to bulk? <Link to={`/samples?style=${product.slug}`} className="text-accent-600 font-semibold hover:underline">Order samples</Link>.
            </p>
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-bold text-brand-800 uppercase tracking-wide mb-2.5">Size</p>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                      size === s
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-brand-200 bg-white text-brand-800 hover:border-brand-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-bold text-brand-800 uppercase tracking-wide mb-2.5">Color</p>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    title={c}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      color === c ? 'border-brand-600 scale-110' : 'border-white shadow ring-1 ring-black/10'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-brand-200 rounded-full bg-white">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-brand-700 hover:text-accent-600" aria-label="Decrease">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-brand-800">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 text-brand-700 hover:text-accent-600" aria-label="Increase">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              className={`btn-primary flex-1 min-w-[220px] ${added ? 'bg-green-600 hover:bg-green-600' : ''}`}
            >
              <ShoppingBag className="w-4 h-4" />
              {added ? 'Added to cart' : `Add to cart · ${formatLKR((product.price_per_pair || 0) * qty)}`}
            </motion.button>
          </div>

          <button
            onClick={() => navigate(`/samples?style=${product.slug}`)}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border-2 border-accent-300 text-accent-600 font-heading font-bold uppercase tracking-wide text-sm hover:bg-accent-50 transition-colors"
          >
            <FlaskConical className="w-4 h-4" />
            Order samples of this style
          </button>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-mist">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Layers className="w-6 h-6 text-brand-500" />
              <p className="text-xs font-semibold text-brand-800">Bundle pricing</p>
              <p className="text-[0.7rem] text-muted-ink">12 pairs per bundle</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <Truck className="w-6 h-6 text-brand-500" />
              <p className="text-xs font-semibold text-brand-800">Islandwide</p>
              <p className="text-[0.7rem] text-muted-ink">Fast delivery</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <ShieldCheck className="w-6 h-6 text-brand-500" />
              <p className="text-xs font-semibold text-brand-800">Quality checked</p>
              <p className="text-[0.7rem] text-muted-ink">Sample before bulk</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
