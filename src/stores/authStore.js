import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,

  initialize: async () => {
    if (!isSupabaseConfigured) {
      set({ isLoading: false })
      return
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        set({ user: session.user })
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle()
        if (profile) set({ profile })
      }
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          set({ user: session.user })
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle()
          if (profile) set({ profile })
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, profile: null })
        }
      })
    } catch (err) {
      console.error('Auth init error:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  signIn: async (email, password) => {
    if (!isSupabaseConfigured) return { error: 'Supabase is not configured yet' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    await get().initialize()
    return {}
  },

  signOut: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))
