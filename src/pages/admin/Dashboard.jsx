import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Package, ShoppingCart, FlaskConical, Wallet, ArrowRight, TrendingUp } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@lib/supabase'
import { formatLKR } from '@lib/format'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    Promise.all([
      supabase.from('orders').select('*'),
      supabase.from('products').select('id'),
    ]).then(([orders, products]) => {
      const list = orders.data || []
      const revenue = list
        .filter((o) => !o.is_sample)
        .reduce((s, o) => s + Number(o.total || 0), 0)
      setData({
        orders: list.length,
        samples: list.filter((o) => o.is_sample).length,
        products: products.data?.length || 0,
        revenue,
        recent: [...list]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6),
      })
    }).catch(console.error)
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-brand-800">Dashboard</h1>
        <p className="mt-3 text-sm text-muted-ink">Supabase not configured yet.</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    )
  }

  const cards = [
    { label: 'Total orders', value: data.orders, icon: ShoppingCart, tone: 'bg-brand-50 text-brand-600' },
    { label: 'Sample requests', value: data.samples, icon: FlaskConical, tone: 'bg-accent-50 text-accent-600' },
    { label: 'Products', value: data.products, icon: Package, tone: 'bg-green-50 text-green-600' },
    { label: 'Order value', value: formatLKR(data.revenue), icon: Wallet, tone: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">A quick look at your store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${c.tone}`}>
                <c.icon className="w-5 h-5" />
              </span>
              <TrendingUp className="w-4 h-4 text-gray-200" />
            </div>
            <p className="mt-4 font-heading text-2xl font-extrabold text-gray-800">{c.value}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-mist">
          <h2 className="font-heading text-lg font-extrabold text-gray-800">Recent orders</h2>
          <Link to="/admin/dashboard/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {data.recent.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {data.recent.map((o) => (
                  <tr key={o.id} className="border-b border-mist last:border-0">
                    <td className="px-5 py-3 font-semibold text-brand-800">{o.order_number}</td>
                    <td className="px-5 py-3 text-gray-600">{o.customer_name}</td>
                    <td className="px-5 py-3">
                      {o.is_sample ? (
                        <span className="badge bg-accent-50 text-accent-700">Sample</span>
                      ) : (
                        <span className="badge bg-brand-50 text-brand-700">Order</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{formatLKR(o.total)}</td>
                    <td className="px-5 py-3 text-gray-400">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
