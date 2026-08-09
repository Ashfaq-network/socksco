import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white/80">
      <div className="container-brand grid grid-cols-1 md:grid-cols-4 gap-10 py-16">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="Socks Co" className="w-10 h-10" />
            <span className="font-heading text-2xl font-extrabold tracking-tight text-white">
              Socks Co
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            Sri Lanka's wholesale sock supplier. Factory-direct prices on men's,
            women's, kids' and sports socks — with sample ordering and
            12-pair bundle pricing.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-white mb-4">
            Explore
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
            <li><Link to="/samples" className="hover:text-white transition-colors">Order Samples</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Wholesale FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-white mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 mt-0.5 text-accent-400" />
              <span>orders@socksco.lk</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 mt-0.5 text-accent-400" />
              <span>077 000 0000</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 text-accent-400" />
              <span>Colombo, Sri Lanka</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-brand flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Socks Co. All rights reserved.</p>
          <Link
            to="/samples"
            className="flex items-center gap-1.5 font-semibold text-accent-400 hover:text-accent-300 transition-colors"
          >
            Order samples <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
