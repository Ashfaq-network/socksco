import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Search } from 'lucide-react'
import { fetchCategories, fetchProducts } from '@lib/service'
import ProductCard from '@components/ProductCard'
import Reveal from '@components/ui/Reveal'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeSlug = searchParams.get('category') || 'all'

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const cat = categories.find((c) => c.slug === activeSlug)
    fetchProducts(cat ? { category: cat.id } : {})
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [activeSlug, categories])

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || 'Wholesale Socks'

  const filtered = useMemo(() => {
    let list = products
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price_per_pair - b.price_per_pair)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price_per_pair - a.price_per_pair)
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [products, query, sort])

  return (
    <div className="container-brand py-10 md:py-16">
      {/* Heading */}
      <Reveal className="text-center mb-10">
        <span className="eyebrow">Wholesale catalog</span>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-800">
          Shop Socks
        </h1>
        <p className="mt-3 text-muted-ink max-w-xl mx-auto text-[0.95rem]">
          Every product is priced per pair and per dozen (12 pairs). Minimum
          order of {12} pairs per style. Not sure?{' '}
          <a href="/samples" className="text-accent-600 font-semibold underline-offset-2 hover:underline">
            order samples first
          </a>.
        </p>
      </Reveal>

      {/* Category chips */}
      <Reveal className="mb-8">
        <div className="flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${
              activeSlug === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-white text-brand-700 border border-brand-200 hover:border-brand-400'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSearchParams({ category: c.slug })}
              className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${
                activeSlug === c.slug
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-brand-700 border border-brand-200 hover:border-brand-400'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-ink" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="input-brand pl-10"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-brand sm:w-56 cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-ink">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.04, 0.4)}>
              <ProductCard product={{ ...p, category_name: categoryName(p.category_id) }} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
