import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Mail, ArrowRight } from 'lucide-react'
import { fetchOrderByNumber } from '@lib/service'
import { formatLKR } from '@lib/format'
import Reveal from '@components/ui/Reveal'

export default function OrderConfirmation() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const state = location.state || {}
  const orderNumber = state.orderNumber || searchParams.get('order') || ''

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const whatsappUrl = state.whatsappUrl || ''
  const emailSent = state.emailSent

  useEffect(() => {
    if (orderNumber && !state.orderNumber) {
      setLoading(true)
      fetchOrderByNumber(orderNumber)
        .then(setOrder)
        .finally(() => setLoading(false))
    }
  }, [orderNumber, state.orderNumber])

  const items = order?.items || state.items || []

  return (
    <div className="container-brand py-16 md:py-24 max-w-2xl">
      <Reveal className="text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="mt-6 font-heading text-3xl md:text-4xl font-extrabold text-brand-800">
          {order?.is_sample || state.isSample ? 'Sample request received!' : 'Order received!'}
        </h1>
        <p className="mt-3 text-muted-ink max-w-lg mx-auto">
          Thank you — your {order?.is_sample || state.isSample ? 'sample request' : 'order'} is in. We'll review it and
          confirm personally before dispatching.
        </p>
        <div className="mt-6 inline-flex flex-col items-center gap-1 px-6 py-4 rounded-2xl bg-brand-50">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-ink">Order number</span>
          <span className="font-heading text-2xl font-extrabold text-brand-700">{orderNumber}</span>
        </div>
      </Reveal>

      {items.length > 0 && (
        <Reveal className="card p-6 mt-10">
          <h2 className="font-heading text-lg font-extrabold text-brand-800 mb-4">Summary</h2>
          <div className="space-y-3">
            {items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-ink">
                  {i.product_name || i.name} × {i.quantity}
                </span>
                <span className="font-semibold text-brand-800">
                  {formatLKR((i.unit_price ?? i.price ?? 0) * i.quantity)}
                </span>
              </div>
            ))}
          </div>
          {(order?.total || state.total) ? (
            <div className="border-t border-mist mt-4 pt-4 flex justify-between font-bold text-brand-800">
              <span>Total</span>
              <span>{formatLKR(order?.total || state.total)}</span>
            </div>
          ) : null}
        </Reveal>
      )}

      {/* Notifications */}
      <Reveal className="mt-10">
        <div className="rounded-3xl bg-brand-700 p-8 text-center">
          <h2 className="font-heading text-xl font-extrabold text-white">What's next?</h2>
          <p className="mt-2 text-white/70 text-sm max-w-md mx-auto">
            Your order was sent to the Socks Co team. Send it straight to
            their WhatsApp for the fastest confirmation.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-accent">
                <MessageCircle className="w-4 h-4" /> Send order on WhatsApp
              </a>
            )}
            <span className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-heading font-bold uppercase tracking-wide text-sm">
              <Mail className="w-4 h-4" />
              {emailSent ? 'Email notification sent' : 'Email alert queued'}
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal className="text-center mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/shop" className="btn-primary">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/samples" className="btn-outline">Order more samples</Link>
      </Reveal>
    </div>
  )
}
