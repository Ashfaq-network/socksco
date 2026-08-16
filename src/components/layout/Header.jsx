import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, Truck, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@stores/cartStore'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/samples', label: 'Order Samples' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { items } = useCartStore()
  const count = items.reduce((s, i) => s + (i.quantity || 1), 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname === href

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-brand-700 text-white">
        <div className="container-brand flex items-center justify-between py-2">
          <span className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/90 min-w-0 truncate">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            Wholesale only — islandwide delivery
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/90">
            <Sparkles className="w-3.5 h-3.5" />
            Order samples · 12-pair bundles
          </span>
        </div>
      </div>

      <nav
        className={`bg-white/95 backdrop-blur transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-[0_1px_0_#E7E5DE]'
        }`}
      >
        <div className="container-brand flex items-center justify-between h-[72px]">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/favicon.svg" alt="Socks Co" className="w-9 h-9" />
            <span className="leading-none">
              <span className="block font-heading text-xl font-extrabold tracking-tight text-brand-800">
                Socks Co
              </span>
              <span className="block text-[0.6rem] font-bold tracking-[0.32em] uppercase text-accent-600 mt-1">
                Wholesale
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-[0.78rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                  isActive(link.href)
                    ? 'text-accent-600'
                    : 'text-brand-700 hover:text-accent-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full hover:bg-brand-50 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[22px] h-[22px] text-brand-800" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-[0.65rem] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="p-2.5 lg:hidden rounded-full hover:bg-brand-50 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? (
                <X className="w-6 h-6 text-brand-800" />
              ) : (
                <Menu className="w-6 h-6 text-brand-800" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t border-brand-100"
          >
            <div className="container-brand py-4 flex flex-col">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={`block py-3 px-3 rounded-xl text-[0.82rem] font-bold uppercase tracking-[0.14em] ${
                      isActive(link.href)
                        ? 'text-accent-600 bg-accent-50'
                        : 'text-brand-700 hover:bg-brand-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
