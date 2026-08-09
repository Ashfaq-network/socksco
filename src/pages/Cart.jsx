import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@stores/cartStore'
import { formatLKR } from '@lib/format'
import Reveal from '@components/ui/Reveal'

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()

  if (items.length === 0) {
    return (
      <div className="container-brand py-24 flex flex-col items-center text-center">
        <span className="w-20 h-20 rounded-full bg-brand-50 text-brand-400 flex items-center justify-center mb-6">
          <ShoppingBag className="w-9 h-9" />
        </span>
        <h1 className="font-heading text-3xl font-extrabold text-brand-800">Your cart is empty</h1>
        <p className="mt-3 text-muted-ink max-w-md">
          Browse the wholesale catalog and add your favourite styles.
        </p>
        <Link to="/shop" className="btn-primary mt-8">
          Browse Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="container-brand py-10 md:py-16">
      <Reveal className="mb-8">
        <span className="eyebrow">Your order</span>
        <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-brand-800">Cart</h1>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <div className="card p-4 flex gap-4">
                <Link to={`/shop/${item.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-mist flex-shrink-0">
                  <img src={item.image || '/images/products/men-crew-navy.svg'} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/shop/${item.slug}`} className="font-heading font-bold text-brand-900 hover:text-brand-600">
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-ink mt-1">
                        {formatLKR(item.price)} / pair
                        {item.size && <span className="ml-2">Size: {item.size}</span>}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-brand-200 rounded-full bg-white">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 px-3 text-brand-700" aria-label="Decrease">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-brand-800 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 px-3 text-brand-700" aria-label="Increase">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-heading font-extrabold text-brand-800">
                      {formatLKR(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div>
          <Reveal>
            <div className="card p-6 sticky top-28">
              <h2 className="font-heading text-xl font-extrabold text-brand-800">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-muted-ink">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-800">{formatLKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-ink">
                  <span>Delivery</span>
                  <span className="text-gray-400">Calculated at checkout</span>
                </div>
                <div className="border-t border-mist pt-3 flex justify-between items-center">
                  <span className="font-bold text-brand-800">Total</span>
                  <span className="font-heading text-2xl font-extrabold text-brand-700">{formatLKR(subtotal)}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary w-full mt-6">
                Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/samples" className="btn-outline w-full mt-3 text-xs">
                Prefer samples first?
              </Link>
              <Link to="/shop" className="block text-center text-sm text-muted-ink hover:text-brand-600 mt-4">
                Continue shopping
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
