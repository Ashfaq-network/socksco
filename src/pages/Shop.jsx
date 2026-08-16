import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Search } from 'lucide-react'
import { fetchCategories, fetchSubcategories, fetchProducts } from '@lib/service'
import ProductCard from '@components/ProductCard'
import Reveal from '@components/ui/Reveal'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeSlug = searchParams.get('category') || 'all'
  const activeSub = searchParams.get('sub') || ''

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const activeCategory = categories.find((c) => c.slug === activeSlug) || null

  useEffect(() => {
    fetchSubcategories(activeCategory?.id)
      .then(setSubcategories)
      .catch(() => setSubcategories([]))
  }, [activeCategory?.id])

  const activeSubcat = subcategories.find((s) => s.slug === activeSub) || null
  const activeCategoryId = activeCategory?.id
  const activeSubcatId = activeSubcat?.id

  useEffect(() => {
    setLoading(true)
    fetchProducts(activeCategoryId || activeSubcatId ? { category: activeCategoryId, subcategory: activeSubcatId } : {})
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [activeCategoryId, activeSubcatId])

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

  const selectCategory = (slug) => {
    const params = slug === 'all' ? {} : { category: slug }
    setSearchParams(params)
  }

  const selectSub = (subSlug) => {
    setSearchParams(subSlug ? { category: activeSlug, sub: subSlug } : { category: activeSlug })
  }

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
            onClick={() => selectCategory('all')}
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
              onClick={() => selectCategory(c.slug)}
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

        {activeCategory && subcategories.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => selectSub('')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                !activeSub
                  ? 'bg-brand-800 text-white'
                  : 'bg-white text-brand-600 border border-brand-200 hover:border-brand-400'
              }`}
            >
              All {activeCategory.name}
            </button>
            {subcategories.map((s) => (
              <button
                key={s.id}
                onClick={() => selectSub(s.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                  activeSub === s.slug
                    ? 'bg-brand-800 text-white'
                    : 'bg-white text-brand-600 border border-brand-200 hover:border-brand-400'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
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
