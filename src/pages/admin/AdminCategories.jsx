import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Loader2, Save, Edit, ImageIcon, ArrowUp, ArrowDown, Layers } from 'lucide-react'
import ImageUpload from '@components/admin/ImageUpload'
import { slugify } from '@lib/format'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', image: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [subCategory, setSubCategory] = useState(null)
  const [subs, setSubs] = useState([])
  const [subForm, setSubForm] = useState({ name: '' })
  const [subEditingId, setSubEditingId] = useState(null)
  const [subSaving, setSubSaving] = useState(false)
  const [subDeleteId, setSubDeleteId] = useState(null)

  const fetchData = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => { setEditing(null); setForm({ name: '', image: '' }); setModal(true) }
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, image: c.image || '' }); setModal(true) }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { name: form.name, image: form.image || null }
    let error
    if (editing) {
      ;({ error } = await supabase.from('categories').update(payload).eq('id', editing.id))
    } else {
      const sort_order = categories.length
      ;({ error } = await supabase.from('categories').insert({ ...payload, slug: slugify(form.name), sort_order }))
    }
    setSaving(false)
    if (!error) { setModal(false); fetchData() }
  }

  const del = async () => {
    await supabase.from('categories').delete().eq('id', deleteId)
    setDeleteId(null)
    fetchData()
  }

  const move = async (id, dir) => {
    const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex((c) => c.id === id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const a = sorted[idx]
    const b = sorted[swapIdx]
    await supabase.from('categories').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('categories').update({ sort_order: a.sort_order }).eq('id', b.id)
    fetchData()
  }

  const openSubs = async (c) => {
    setSubCategory(c)
    setSubEditingId(null)
    setSubForm({ name: '' })
    setSubDeleteId(null)
    const { data } = await supabase.from('subcategories').select('*').eq('category_id', c.id).order('sort_order')
    setSubs(data || [])
  }

  const closeSubs = () => {
    setSubCategory(null)
    setSubs([])
  }

  const saveSub = async (e) => {
    e.preventDefault()
    setSubSaving(true)
    const name = subForm.name.trim()
    let error
    if (subEditingId) {
      ;({ error } = await supabase.from('subcategories').update({ name }).eq('id', subEditingId))
    } else {
      ;({ error } = await supabase.from('subcategories').insert({
        category_id: subCategory.id,
        name,
        slug: slugify(name),
        sort_order: subs.length,
      }))
    }
    setSubSaving(false)
    if (!error) {
      setSubForm({ name: '' })
      setSubEditingId(null)
      const { data } = await supabase.from('subcategories').select('*').eq('category_id', subCategory.id).order('sort_order')
      setSubs(data || [])
    }
  }

  const editSub = (s) => {
    setSubEditingId(s.id)
    setSubForm({ name: s.name })
  }

  const deleteSub = async () => {
    await supabase.from('subcategories').delete().eq('id', subDeleteId)
    setSubDeleteId(null)
    const { data } = await supabase.from('subcategories').select('*').eq('category_id', subCategory.id).order('sort_order')
    setSubs(data || [])
  }

  const moveSub = async (id, dir) => {
    const sorted = [...subs].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex((s) => s.id === id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const a = sorted[idx]
    const b = sorted[swapIdx]
    await supabase.from('subcategories').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('subcategories').update({ sort_order: a.sort_order }).eq('id', b.id)
    const { data } = await supabase.from('subcategories').select('*').eq('category_id', subCategory.id).order('sort_order')
    setSubs(data || [])
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
          <h1 className="text-2xl font-heading font-extrabold text-gray-800">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Category</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mist">
              <th className="text-left px-5 py-3 font-semibold text-gray-400">Image</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-400">Name</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-400">Subcategories</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-400">Order</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-mist last:border-0 hover:bg-brand-50/40 transition-colors">
                <td className="px-5 py-3">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-brand-300" />
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 font-semibold text-gray-700">{c.name}</td>
                <td className="px-5 py-3 text-gray-500">
                  <button
                    onClick={() => openSubs(c)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-200 text-brand-700 text-xs font-bold hover:bg-brand-50 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" /> Manage
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => move(c.id, -1)} className="p-1.5 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-brand-50" aria-label="Move up">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => move(c.id, 1)} className="p-1.5 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-brand-50" aria-label="Move down">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-brand-50"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-extrabold text-gray-800">{editing ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-brand-50"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-brand" placeholder="e.g. Men's Socks" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Image</label>
                  <ImageUpload bucket="products" existingImages={form.image ? [form.image] : []} onUpload={(imgs) => setForm({ ...form, image: imgs[0] || '' })} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {subCategory && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeSubs}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-mist sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-gray-800">Subcategories</h2>
                  <p className="text-gray-400 text-sm mt-0.5">{subCategory.name}</p>
                </div>
                <button onClick={closeSubs} className="p-2 rounded-xl hover:bg-brand-50 transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              <div className="p-6 space-y-5">
                <form onSubmit={saveSub} className="flex gap-3">
                  <input
                    type="text"
                    required
                    value={subForm.name}
                    onChange={(e) => setSubForm({ name: e.target.value })}
                    className="input-brand"
                    placeholder={subEditingId ? 'Rename subcategory…' : 'e.g. Ankle, Boys, Party Socks'}
                  />
                  <button type="submit" disabled={subSaving} className="btn-primary shrink-0">
                    {subSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {subEditingId ? 'Rename' : 'Add'}
                  </button>
                  {subEditingId && (
                    <button
                      type="button"
                      onClick={() => { setSubEditingId(null); setSubForm({ name: '' }) }}
                      className="btn-outline shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {subs.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-6">No subcategories yet. Add the first one above.</p>
                ) : (
                  <ul className="space-y-2">
                    {subs.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-3 bg-brand-50/60 rounded-2xl px-4 py-2.5">
                        <span className="font-semibold text-gray-700">{s.name}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveSub(s.id, -1)} className="p-1.5 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-white" aria-label="Move up">
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button onClick={() => moveSub(s.id, 1)} className="p-1.5 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-white" aria-label="Move down">
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button onClick={() => editSub(s)} className="p-1.5 rounded-lg text-gray-300 hover:text-brand-600 hover:bg-white"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setSubDeleteId(s.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-white"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {subDeleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setSubDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete subcategory?</h3>
              <p className="text-gray-500 text-sm mb-6">Products using it will keep their data but lose the subcategory.</p>
              <div className="flex gap-3">
                <button onClick={() => setSubDeleteId(null)} className="btn-outline flex-1">Cancel</button>
                <button onClick={deleteSub} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete category?</h3>
              <p className="text-gray-500 text-sm mb-6">Products in this category will keep their data.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
                <button onClick={del} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
