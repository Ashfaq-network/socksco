import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { isSupabaseConfigured } from '@lib/supabase'
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const { signIn, user, profile, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      setError(signInError)
      setLoading(false)
      return
    }
    const currentProfile = useAuthStore.getState().profile
    if (currentProfile?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('Access denied. This account does not have admin privileges.')
      useAuthStore.getState().signOut()
    }
    setLoading(false)
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper px-4">
        <div className="card p-10 max-w-md w-full text-center">
          <img src="/favicon.svg" alt="Socks Co" className="w-14 h-14 mx-auto" />
          <h1 className="mt-4 font-heading text-2xl font-extrabold text-brand-800">Supabase not configured</h1>
          <p className="mt-3 text-sm text-muted-ink">
            Add your Supabase URL and anon key to <code className="bg-brand-50 px-1.5 py-0.5 rounded">.env</code>,
            then run <code className="bg-brand-50 px-1.5 py-0.5 rounded">supabase/schema.sql</code> in the SQL editor.
          </p>
          <Link to="/" className="btn-outline mt-6"><ArrowLeft className="w-4 h-4" /> Back to store</Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    )
  }

  if (user && profile && profile.role === 'admin') {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-8 md:p-10 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <img src="/favicon.svg" alt="Socks Co" className="w-14 h-14 mx-auto" />
          <h1 className="mt-4 font-heading text-3xl font-extrabold text-brand-800">Socks Co Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your store</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm mb-6"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-brand"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="owner@socksco.lk"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-brand"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <Link to="/" className="block text-center text-sm text-gray-400 hover:text-brand-600 mt-6">
          ← Back to store
        </Link>
      </motion.div>
    </div>
  )
}
