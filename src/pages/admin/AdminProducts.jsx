import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, X, Loader2, Star, Sparkles, TrendingUp, Save, ImageIcon, Edit, Search,
} from 'lucide-react'
import ImageUpload from '@components/admin/ImageUpload'
import { formatLKR, slugify } from '@lib/format'

const emptyProduct = {
  name: '',
  description: '',
  price_per_pair: '',
  bundle_price: '',
  bundle_size: '12',
  moq: '12',
  images: '',
  colors: '',
  sizes: '',
  category_id: '',
  stock: '',
  is_featured: false,
  is_new: false,
  is_best_seller: false,
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyProduct })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    const { data: p } = await supabase
      .from('products')
      .select('*, category:categories(name, slug)')
      .order('created_at', { ascending: false })
    setProducts(p || [])
    const { data: c } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(c || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyProduct })
    setShowModal(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price_per_pair: product.price_per_pair?.toString() || '',
      bundle_price: product.bundle_price?.toString() || '',
      bundle_size: product.bundle_size?.toString() || '12',
      moq: product.moq?.toString() || '12',
      images: (product.images || []).join(', '),
      colors: (product.colors || []).join(', '),
      sizes: (product.sizes || []).join(', '),
      category_id: product.category_id || '',
      stock: product.stock?.toString() || '0',
      is_featured: product.is_featured,
      is_new: product.is_new,
      is_best_seller: product.is_best_seller,
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      slug: editing ? editing.slug : slugify(form.name),
      description: form.description,
      price_per_pair: Number(form.price_per_pair) || 0,
      bundle_price: form.bundle_price ? Number(form.bundle_price) : null,
      bundle_size: Number(form.bundle_size) || 12,
      moq: Number(form.moq) || 12,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      category_id: form.category_id || null,
      stock: Number(form.stock) || 0,
      is_featured: form.is_featured,
      is_new: form.is_new,
      is_best_seller: form.is_best_seller,
    }

    let error
    if (editing) {
      ;({ error } = await supabase.from('products').update(payload).eq('id', editing.id))
    } else {
      ;({ error } = await supabase.from('products').insert(payload))
    }
    setSaving(false)
    if (!error) {
      setShowModal(false)
      fetchData()
    } else {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    await supabase.from('products').delete().eq('id', deleteId)
    setDeleteId(null)
    setDeleting(false)
    fetchData()
  }

  const toggle = async (id, field, value) => {
    await supabase.from('products').update({ [field]: !value }).eq('id', id)
    fetchData()
  }

  const filtered = products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    )
  }

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  const setBool = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.checked }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-gray-800">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} products</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-brand pl-10" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist">
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Image</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Category</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Per pair</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Bundle</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Stock</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Featured</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">New</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-400">Top</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-mist last:border-0 hover:bg-brand-50/40 transition-colors">
                    <td className="px-5 py-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-brand-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-700 max-w-[180px] truncate">{p.name}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{p.category?.name || '—'}</td>
                    <td className="px-5 py-3 text-gray-700 font-semibold">{formatLKR(p.price_per_pair)}</td>
                    <td className="px-5 py-3 text-gray-700">{p.bundle_price ? formatLKR(p.bundle_price) : '—'}</td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        defaultValue={p.stock}
                        onBlur={(e) => supabase.from('products').update({ stock: Number(e.target.value) || 0 }).eq('id', p.id).then(fetchData)}
                        className="w-16 text-center text-sm border border-brand-200 rounded-lg py-1 focus:outline-none focus:border-brand-400 bg-white"
                        min="0"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggle(p.id, 'is_featured', p.is_featured)} className={`p-1.5 rounded-lg transition-colors ${p.is_featured ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-400'}`}>
                        <Star className="w-4 h-4" fill={p.is_featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggle(p.id, 'is_new', p.is_new)} className={`p-1.5 rounded-lg transition-colors ${p.is_new ? 'text-green-500 bg-green-50' : 'text-gray-300 hover:text-green-400'}`}>
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggle(p.id, 'is_best_seller', p.is_best_seller)} className={`p-1.5 rounded-lg transition-colors ${p.is_best_seller ? 'text-purple-500 bg-purple-50' : 'text-gray-300 hover:text-purple-400'}`}>
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-mist">
                <h2 className="text-xl font-heading font-extrabold text-gray-800">
                  {editing ? 'Edit Product' : 'Add Product'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-brand-50 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Name *</label>
                  <input type="text" required value={form.name} onChange={set('name')} className="input-brand" placeholder="Product name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Description</label>
                  <textarea rows={3} value={form.description} onChange={set('description')} className="input-brand resize-none" placeholder="Product description" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Price per pair (LKR) *</label>
                    <input type="number" required min="0" value={form.price_per_pair} onChange={set('price_per_pair')} className="input-brand" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Bundle price (LKR)</label>
                    <input type="number" min="0" value={form.bundle_price} onChange={set('bundle_price')} className="input-brand" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Bundle size (pairs)</label>
                    <input type="number" min="1" value={form.bundle_size} onChange={set('bundle_size')} className="input-brand" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">MOQ (pairs)</label>
                    <input type="number" min="0" value={form.moq} onChange={set('moq')} className="input-brand" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Product Images</label>
                  <ImageUpload
                    bucket="products"
                    multiple
                    existingImages={editing?.images || []}
                    onUpload={(imgs) => setForm((prev) => ({ ...prev, images: imgs.join(', ') }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Sizes (comma separated)</label>
                    <input type="text" value={form.sizes} onChange={set('sizes')} className="input-brand" placeholder="S, M, L" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Colors (hex, comma)</label>
                    <input type="text" value={form.colors} onChange={set('colors')} className="input-brand" placeholder="#1E3A5F, #FFFFFF" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Category</label>
                    <select value={form.category_id} onChange={set('category_id')} className="input-brand">
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Stock *</label>
                    <input type="number" required min="0" value={form.stock} onChange={set('stock')} className="input-brand" placeholder="0" />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  {[
                    { key: 'is_featured', label: 'Featured' },
                    { key: 'is_new', label: 'New' },
                    { key: 'is_best_seller', label: 'Best Seller' },
                  ].map((f) => (
                    <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[f.key]} onChange={setBool(f.key)} className="w-4 h-4 rounded border-brand-300 text-brand-600 focus:ring-brand-400" />
                      <span className="text-sm text-gray-600">{f.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-mist">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editing ? 'Save Changes' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete product?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
