import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Lock, MessageCircle, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@stores/cartStore'
import { getSettings, saveOrder } from '@lib/service'
import { generateOrderNumber, formatLKR } from '@lib/format'
import { buildOrderMessage, buildWhatsAppLink, sendOrderEmail } from '@lib/notify'

const provinces = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'North Western', 'North Central', 'Uva', 'Sabaragamuwa',
]

const districts = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern: ['Galle', 'Matara', 'Hambantota'],
  Northern: ['Jaffna', 'Mullaitivu', 'Vavuniya', 'Kilinochchi'],
  Eastern: ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Uva: ['Badulla', 'Monaragala'],
  Sabaragamuwa: ['Ratnapura', 'Kegalle'],
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, getSubtotal, clearCart } = useCartStore()

  const [settings, setSettings] = useState(null)
  const [step, setStep] = useState(1)
  const [province, setProvince] = useState('')
  const [delivery, setDelivery] = useState('standard')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', district: '', notes: '',
  })

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings(null))
  }, [])

  const charges = settings?.delivery_charges || { standard: 400, express: 900, pickup: 0 }
  const deliveryMethods = [
    { id: 'standard', name: 'Standard Delivery', price: Number(charges.standard) || 0, time: '3–5 business days' },
    { id: 'express', name: 'Express Delivery', price: Number(charges.express) || 0, time: '1–2 business days' },
    { id: 'pickup', name: 'Pickup', price: Number(charges.pickup) || 0, time: 'Arrange pickup' },
  ]

  const subtotal = getSubtotal()
  const shipping = deliveryMethods.find((d) => d.id === delivery)?.price || 0
  const total = subtotal + shipping

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'province') {
      setProvince(value)
      setForm((prev) => ({ ...prev, province: value, district: '' }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const stepValid = () => {
    if (step === 1) {
      return form.name && /^[0-9+\s-]{9,}$/.test(form.phone) && form.email.includes('@') &&
        form.address && form.city && form.province && form.district
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setError(null)

    const order = {
      order_number: generateOrderNumber('SC'),
      customer_name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      province: form.province,
      district: form.district,
      delivery_method: delivery,
      subtotal,
      shipping_cost: shipping,
      total,
      notes: form.notes || null,
      is_sample: false,
      items: items.map((i) => ({
        product_id: i.product_id,
        product_name: i.name,
        product_image: i.image,
        quantity: i.quantity,
        unit_price: i.price,
        size: i.size,
        color: i.color,
      })),
    }

    try {
      await saveOrder(order)

      const message = buildOrderMessage(order)
      const whatsappNumber =
        (settings?.store_info?.whatsapp || '94770000000').replace(/\D/g, '')
      const whatsappUrl = buildWhatsAppLink(whatsappNumber, message)
      const emailResult = await sendOrderEmail(settings, order)

      clearCart()
      navigate('/order-confirmation', {
        state: { orderNumber: order.order_number, whatsappUrl, emailSent: emailResult.sent, isSample: false },
      })
    } catch (err) {
      console.error('Order failed:', err)
      setError('Something went wrong placing your order. Please try again.')
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-brand py-24 flex flex-col items-center text-center">
        <h1 className="font-heading text-3xl font-extrabold text-brand-800">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary mt-6">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-brand py-10 md:py-16">
      {/* Steps */}
      <div className="flex items-center justify-center gap-4 md:gap-10 mb-10">
        {[
          { n: 1, label: 'Information' },
          { n: 2, label: 'Delivery' },
          { n: 3, label: 'Review' },
        ].map((s) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s.n ? 'bg-brand-600 text-white' : 'bg-white text-gray-400 border border-brand-200'
            }`}>
              {step > s.n ? <Check className="w-4 h-4" /> : s.n}
            </div>
            <span className={`hidden sm:block text-sm font-semibold ${step >= s.n ? 'text-brand-800' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 md:p-8"
              >
                <h2 className="font-heading text-2xl font-extrabold text-brand-800">Contact & delivery details</h2>
                <p className="text-sm text-muted-ink mt-1">We use these details to confirm your order.</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-800 mb-1.5">Full name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="input-brand" placeholder="Shop / business / buyer name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-800 mb-1.5">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required className="input-brand" placeholder="07X XXX XXXX" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-brand-800 mb-1.5">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-brand" placeholder="you@example.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-brand-800 mb-1.5">Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} required className="input-brand" placeholder="Street, building, no." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-800 mb-1.5">Province *</label>
                    <select name="province" value={form.province} onChange={handleChange} required className="input-brand">
                      <option value="">Select province</option>
                      {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-800 mb-1.5">District *</label>
                    <select name="district" value={form.district} onChange={handleChange} required disabled={!province} className="input-brand disabled:opacity-50">
                      <option value="">Select district</option>
                      {province && districts[province]?.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-brand-800 mb-1.5">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} required className="input-brand" placeholder="City / town" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-brand-800 mb-1.5">Order notes (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-brand resize-none" placeholder="Anything we should know?" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => stepValid() && setStep(2)}
                    className="btn-primary"
                  >
                    Continue to Delivery <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 md:p-8"
              >
                <h2 className="font-heading text-2xl font-extrabold text-brand-800">Delivery method</h2>
                <div className="mt-6 space-y-3">
                  {deliveryMethods.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        delivery === m.id ? 'border-brand-600 bg-brand-50' : 'border-brand-100 hover:border-brand-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio" name="delivery" value={m.id}
                          checked={delivery === m.id}
                          onChange={(e) => setDelivery(e.target.value)}
                          className="w-5 h-5 text-brand-600 focus:ring-brand-500"
                        />
                        <div>
                          <p className="font-bold text-brand-800">{m.name}</p>
                          <p className="text-sm text-muted-ink">{m.time}</p>
                        </div>
                      </div>
                      <span className="font-bold text-brand-800">{m.price === 0 ? 'Free' : formatLKR(m.price)}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary">
                    Review Order <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 md:p-8"
              >
                <h2 className="font-heading text-2xl font-extrabold text-brand-800">Review & place order</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl bg-mist">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-ink mb-2">Deliver to</h3>
                    <p className="font-semibold text-brand-800">{form.name}</p>
                    <p className="text-sm text-muted-ink">{form.phone} · {form.email}</p>
                    <p className="text-sm text-muted-ink mt-1">{form.address}, {form.city}, {form.district}, {form.province}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-mist">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-ink mb-2">Delivery</h3>
                    <p className="font-semibold text-brand-800">
                      {deliveryMethods.find((d) => d.id === delivery)?.name}
                    </p>
                    <p className="text-sm text-muted-ink mt-1">
                      {shipping === 0 ? 'Free' : formatLKR(shipping)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-accent-50 text-accent-800 text-sm flex items-center gap-2.5">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  No payment needed now — we confirm every order personally by WhatsApp or email before dispatch.
                </div>

                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="btn-outline">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" disabled={processing} className="btn-accent">
                    {processing ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Placing order...
                      </>
                    ) : (
                      <>Place Order · {formatLKR(total)}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-28">
            <h2 className="font-heading text-xl font-extrabold text-brand-800">Order summary</h2>
            <div className="mt-5 space-y-4 max-h-[42vh] overflow-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-mist flex-shrink-0">
                    <img src={item.image || '/images/products/men-crew-navy.svg'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-ink">Qty {item.quantity}{item.size ? ` · ${item.size}` : ''}</p>
                  </div>
                  <p className="text-sm font-bold text-brand-800">{formatLKR(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-mist mt-5 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-ink"><span>Subtotal</span><span className="text-brand-800 font-semibold">{formatLKR(subtotal)}</span></div>
              <div className="flex justify-between text-muted-ink"><span>Delivery</span><span className="text-brand-800 font-semibold">{shipping === 0 ? 'Free' : formatLKR(shipping)}</span></div>
              <div className="border-t border-mist pt-3 flex justify-between items-center">
                <span className="font-bold text-brand-800">Total</span>
                <span className="font-heading text-2xl font-extrabold text-brand-700">{formatLKR(total)}</span>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-mist space-y-2 text-xs text-muted-ink">
              <p className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-600" /> Order confirmation sent to WhatsApp</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-500" /> Order details sent to your email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
