import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Reveal from '@components/ui/Reveal'

const faqs = [
  {
    q: 'Is Socks Co wholesale only?',
    a: 'Yes. We supply to resellers, boutiques, online sellers and bulk buyers. Every product is priced per pair and per 12-pair bundle, with a minimum order of 12 pairs per style.',
  },
  {
    q: 'Can I order samples first?',
    a: 'Absolutely — we encourage it. Use the Order Samples page to request a few pairs of any style. We confirm every sample request personally on WhatsApp and email.',
  },
  {
    q: 'How does bundle pricing work?',
    a: 'Each product shows a price per single pair and a bundle price for a dozen (12 pairs). Buying the bundle always works out cheaper than buying singles.',
  },
  {
    q: 'What is the minimum order quantity (MOQ)?',
    a: 'The MOQ is 12 pairs per style (one bundle) for bulk orders. Sample orders can be any small quantity — that is exactly what they are for.',
  },
  {
    q: 'How do I place an order and how will I pay?',
    a: 'Add products to your cart, enter delivery details at checkout and place the order. There is no payment gateway — we confirm every order personally on WhatsApp/email and agree on payment and delivery from there.',
  },
  {
    q: 'Do you deliver islandwide?',
    a: 'Yes. We deliver to all 9 provinces of Sri Lanka. Delivery charges are shown at checkout (standard, express or pickup).',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 3–5 business days, express 1–2 business days. Bulk orders are dispatched after confirmation.',
  },
  {
    q: 'Can I mix styles in one bundle?',
    a: 'For bulk orders we recommend keeping each style in its own bundle, but larger mixed orders are welcome — just mention it in the order notes or message us on WhatsApp.',
  },
  {
    q: 'What if I receive damaged or incorrect items?',
    a: 'Tell us within 48 hours of delivery with a photo and we will replace or refund — we stand behind every order.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <div className="container-brand py-10 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-12">
          <span className="eyebrow">Wholesale FAQ</span>
          <h1 className="mt-3 font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-brand-800">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-muted-ink text-lg max-w-xl mx-auto">
            Everything about samples, bundles, MOQ and delivery.
          </p>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={i} delay={Math.min(i * 0.04, 0.3)}>
                <div className={`card overflow-hidden transition-colors ${isOpen ? 'border-brand-300' : ''}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-heading font-bold text-brand-800">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                      >
                        <p className="px-5 pb-5 text-muted-ink text-sm leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="text-center mt-12">
          <p className="text-muted-ink">Still have questions?</p>
          <Link to="/contact" className="btn-primary mt-4">Contact us</Link>
        </Reveal>
      </div>
    </div>
  )
}
