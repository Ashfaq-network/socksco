import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, X, Package, MessageCircle, RefreshCw } from 'lucide-react'
import { formatLKR } from '@lib/format'

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const DISPLAY = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusStyles = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-blue-50 text-blue-600',
  processing: 'bg-purple-50 text-purple-600',
  shipped: 'bg-brand-50 text-brand-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
}

const statusDot = {
  pending: 'bg-amber-400',
  confirmed: 'bg-blue-400',
  processing: 'bg-purple-400',
  shipped: 'bg-brand-400',
  delivered: 'bg-green-400',
  cancelled: 'bg-red-400',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('ALL')
  const [selected, setSelected] = useState(null)

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const tabs = ['ALL', ...STATUSES]
  const filtered = active === 'ALL' ? orders : orders.filter((o) => o.status === active)

  const statusLine = (o) => {
    const total = (o.items || []).reduce((sum, it) => sum + Number(it.line_total || 0), 0)
    return { total, count: (o.items || []).length }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-gray-800">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} orders</p>
        </div>
        <button onClick={fetchOrders} className="btn-outline"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === t ? 'bg-brand-700 text-white' : 'bg-white text-gray-500 border border-mist hover:border-brand-300'
            }`}
          >
            {t === 'ALL' ? 'All' : DISPLAY[t]}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist">
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Order #</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Type</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Customer</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Items</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Total</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">No orders in this status yet.</td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const { total, count } = statusLine(o)
                  return (
                    <tr key={o.id} onClick={() => setSelected(o)} className="border-b border-mist last:border-0 hover:bg-brand-50/40 transition-colors cursor-pointer">
                      <td className="px-5 py-3 font-bold text-brand-700">{o.order_number}</td>
                      <td className="px-5 py-3">
                        {o.is_sample ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600">SAMPLE</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600">ORDER</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-700">{o.name}</p>
                        <p className="text-gray-400 text-xs">{o.phone}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{count} items</td>
                      <td className="px-5 py-3 font-bold text-gray-800">{formatLKR(total)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[o.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[o.status]}`} />
                          {DISPLAY[o.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-mist sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-gray-800">{selected.order_number}</h2>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mt-1 ${statusStyles[selected.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[selected.status]}`} /> {DISPLAY[selected.status]}
                  </span>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-brand-50"><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl bg-brand-50/60 p-4">
                    <p className="font-bold text-gray-700 mb-1">{selected.name}</p>
                    <p className="text-gray-500">{selected.phone}</p>
                    <p className="text-gray-500">{selected.email}</p>
                    <p className="text-gray-500 mt-2">{selected.address}</p>
                    <p className="text-gray-500">{selected.city}, {selected.district}</p>
                    <p className="text-gray-500">{selected.shipping_cost ? `Delivery: ${formatLKR(selected.shipping_cost)}` : 'Delivery: Free'}</p>
                    {selected.notes && <p className="text-gray-500 mt-2 italic">"{selected.notes}"</p>}
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4 space-y-1.5">
                    <p className="font-bold text-gray-700 mb-1">Details</p>
                    <p className="text-gray-500">Placed {new Date(selected.created_at).toLocaleString()}</p>
                    <p className="text-gray-500">{selected.is_sample ? 'Sample order' : 'Bulk order'}</p>
                    {selected.is_sample && selected.sample_business && <p className="text-gray-500">Business: {selected.sample_business}</p>}
                    {selected.is_sample && <p className="text-gray-500">Styles requested: {selected.sample_styles}</p>}
                    <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1.5 text-brand-600 font-semibold mt-2">
                      <MessageCircle className="w-4 h-4" /> Call customer
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Items</h3>
                  <div className="space-y-2">
                    {(selected.items || []).map((it) => (
                      <div key={it.id} className="flex items-center gap-4 rounded-2xl border border-mist p-3">
                        {it.images?.[0] ? (
                          <img src={it.images[0]} alt={it.product_name} className="w-14 h-14 rounded-xl object-cover" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center"><Package className="w-6 h-6 text-brand-300" /></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-700 truncate">{it.product_name}</p>
                          <p className="text-xs text-gray-400">{it.variant_size ? `Size ${it.variant_size} · ` : ''}{it.variant_color ? `Color ${it.variant_color} · ` : ''}{it.quantity} × {formatLKR(it.unit_price)}</p>
                        </div>
                        <p className="font-bold text-gray-700">{formatLKR(it.line_total)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4 text-sm">
                    <p className="text-gray-500">Total <span className="font-bold text-gray-800 text-base">{formatLKR((selected.items || []).reduce((s, it) => s + Number(it.line_total || 0), 0) + Number(selected.shipping_cost || 0))}</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
