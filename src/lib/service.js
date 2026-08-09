import { supabase, isSupabaseConfigured } from './supabase'
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SETTINGS } from '@data/mockData'

const settingsCache = { data: null, at: 0 }
const TTL = 60000

export async function fetchCategories() {
  if (!isSupabaseConfigured) return MOCK_CATEGORIES
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data || []
}

export async function fetchProducts({ category, featured, isNew, limit } = {}) {
  if (!isSupabaseConfigured) {
    let list = MOCK_PRODUCTS
    if (category) list = list.filter((p) => p.category_id === category)
    if (featured) list = list.filter((p) => p.is_featured)
    if (isNew) list = list.filter((p) => p.is_new)
    if (limit) list = list.slice(0, limit)
    return list
  }

  let query = supabase.from('products').select('*')
  if (category) query = query.eq('category_id', category)
  if (featured) query = query.eq('is_featured', true)
  if (isNew) query = query.eq('is_new', true)
  if (limit) query = query.limit(limit)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function fetchProductBySlug(slug) {
  if (!isSupabaseConfigured) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(id, name, slug)')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getSettings() {
  if (!isSupabaseConfigured) return MOCK_SETTINGS

  if (settingsCache.data && Date.now() - settingsCache.at < TTL) {
    return settingsCache.data
  }

  const { data, error } = await supabase.from('store_settings').select('*')
  if (error) throw error

  const settings = {
    store_info: {
      name: 'Socks Co',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
    },
    delivery_charges: { standard: 400, express: 900, pickup: 0 },
    order_alerts: { email_enabled: true, whatsapp_enabled: true, formsubmit_email: '' },
  }
  ;(data || []).forEach((row) => {
    if (row.value && typeof row.value === 'object' && settings[row.key]) {
      settings[row.key] = { ...settings[row.key], ...row.value }
    }
  })
  settingsCache.data = settings
  settingsCache.at = Date.now()
  return settings
}

export async function saveOrder(order) {
  if (!isSupabaseConfigured) {
    const key = 'socksco-orders'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    existing.unshift(order)
    localStorage.setItem(key, JSON.stringify(existing))
    return { order }
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: order.order_number,
      customer_name: order.customer_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      province: order.province,
      district: order.district || null,
      delivery_method: order.delivery_method,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      total: order.total,
      notes: order.notes || null,
      status: 'pending',
      is_sample: order.is_sample || false,
      sample_business: order.sample_business || null,
      sample_styles: order.sample_styles || null,
    })
    .select()
    .single()

  if (error) throw error

  const orderItems = order.items.map((item) => ({
    order_id: data.id,
    product_id: item.product_id || null,
    product_name: item.product_name,
    product_image: item.product_image || null,
    quantity: item.quantity,
    unit_price: item.unit_price,
    size: item.size || null,
    color: item.color || null,
  }))
  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  await supabase.from('order_status_history').insert({
    order_id: data.id,
    status: 'pending',
    note: 'Order placed successfully',
  })

  return { order: data }
}

export async function fetchOrderByNumber(orderNumber) {
  if (!isSupabaseConfigured) {
    const existing = JSON.parse(localStorage.getItem('socksco-orders') || '[]')
    return existing.find((o) => o.order_number === orderNumber) || null
  }
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('order_number', orderNumber)
    .maybeSingle()
  if (error) throw error
  return data
}
