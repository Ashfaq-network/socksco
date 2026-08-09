import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { Loader2, Save, Store, Truck, Bell } from 'lucide-react'

const DEFAULTS = {
  store_info: { name: 'Socks Co', email: '', phone: '', whatsapp: '', address: '' },
  delivery_charges: { standard: 0, express: 0, pickup: 0 },
  order_alerts: { email_enabled: true, whatsapp_enabled: true, formsubmit_email: '' },
}

const SECTIONS = [
  {
    key: 'store_info',
    title: 'Store Information',
    icon: Store,
    blurb: 'Used across the storefront, receipts and messages.',
    fields: [
      { k: 'name', label: 'Store name', type: 'text' },
      { k: 'email', label: 'Store email', type: 'email' },
      { k: 'phone', label: 'Phone (077 000 0000)', type: 'text' },
      { k: 'whatsapp', label: 'WhatsApp number (94770000000)', type: 'text' },
      { k: 'address', label: 'Address', type: 'text' },
    ],
  },
  {
    key: 'delivery_charges',
    title: 'Delivery Charges (LKR)',
    icon: Truck,
    blurb: 'Pickup is usually free. Set amounts the customer sees at checkout.',
    fields: [
      { k: 'standard', label: 'Standard delivery (LKR)', type: 'number' },
      { k: 'express', label: 'Express delivery (LKR)', type: 'number' },
      { k: 'pickup', label: 'Self pickup (LKR)', type: 'number' },
    ],
  },
  {
    key: 'order_alerts',
    title: 'Order Alerts',
    icon: Bell,
    blurb: 'Where you get notified when a new order or sample request comes in.',
    fields: [
      { k: 'email_enabled', label: 'Send email alerts (FormSubmit)', type: 'boolean' },
      { k: 'whatsapp_enabled', label: 'Send WhatsApp alerts', type: 'boolean' },
      { k: 'formsubmit_email', label: 'Email to receive alerts (needed for email)', type: 'email' },
    ],
  },
]

export default function AdminSettings() {
  const [values, setValues] = useState({ ...DEFAULTS })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedKey, setSavedKey] = useState(null)

  const fetchSettings = async () => {
    const { data } = await supabase.from('store_settings').select('key, value')
    const merged = { ...DEFAULTS }
    for (const row of data || []) {
      if (merged[row.key] && typeof merged[row.key] === 'object') {
        merged[row.key] = { ...merged[row.key], ...(row.value || {}) }
      } else {
        merged[row.key] = row.value
      }
    }
    setValues(merged)
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const updateField = (key, field, value) => {
    setValues((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  const saveSection = async (key) => {
    setSaving(true)
    const { error } = await supabase.from('store_settings').upsert(
      { key, value: values[key] },
      { onConflict: 'key' }
    )
    setSaving(false)
    if (!error) {
      setSavedKey(key)
      setTimeout(() => setSavedKey(null), 2000)
    }
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
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-gray-800">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Store details, delivery pricing and order alerts.</p>
      </div>

      {SECTIONS.map((section) => {
        const Icon = section.icon
        const isSaved = savedKey === section.key
        return (
          <div key={section.key} className="card p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-brand-700 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
                <p className="text-gray-400 text-sm">{section.blurb}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((f) => {
                const val = values[section.key]?.[f.k]
                return (
                  <div key={f.k} className={f.type === 'boolean' ? 'col-span-full' : ''}>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">{f.label}</label>
                    {f.type === 'boolean' ? (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateField(section.key, f.k, !val)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${val ? 'bg-brand-600' : 'bg-gray-200'}`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${val ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="text-sm text-gray-500">{val ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    ) : (
                      <input
                        type={f.type}
                        value={val ?? ''}
                        onChange={(e) => updateField(section.key, f.k, e.target.value)}
                        className="input-brand"
                        placeholder={f.label}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-mist">
              <button onClick={() => saveSection(section.key)} disabled={saving} className={`btn-primary ${isSaved ? 'bg-green-600 border-green-600' : ''}`}>
                {isSaved ? <><span className="w-4 h-4" /> Saved</> : saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {!isSaved && !saving && 'Save Changes'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
