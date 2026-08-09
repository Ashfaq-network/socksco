import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import ScrollToTop from '@components/ScrollToTop'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'

import Home from '@pages/Home'
import Shop from '@pages/Shop'
import ProductDetail from '@pages/ProductDetail'
import Cart from '@pages/Cart'
import Checkout from '@pages/Checkout'
import OrderConfirmation from '@pages/OrderConfirmation'
import Samples from '@pages/Samples'
import About from '@pages/About'
import Contact from '@pages/Contact'
import FAQ from '@pages/FAQ'

const AdminLogin = lazy(() => import('@pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('@pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('@pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('@pages/admin/AdminProducts'))
const AdminCategories = lazy(() => import('@pages/admin/AdminCategories'))
const AdminOrders = lazy(() => import('@pages/admin/AdminOrders'))
const AdminSettings = lazy(() => import('@pages/admin/AdminSettings'))

const admin = (Element) => () => (
  <Suspense fallback={<Loader2 className="w-8 h-8 text-brand-500 animate-spin" />}>
    <Element />
  </Suspense>
)

export default function App() {
  useEffect(() => {
    useAuthStore.getState().initialize()
  }, [])

  return (
    <BrowserRouter>
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/shop"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <Shop />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/shop/:slug"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <ProductDetail />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/cart"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <Cart />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/checkout"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <Checkout />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <OrderConfirmation />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/samples"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <Samples />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <About />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <Contact />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/faq"
            element={
              <div className="min-h-screen flex flex-col bg-paper">
                <Header />
                <main className="flex-1">
                  <FAQ />
                </main>
                <Footer />
              </div>
            }
          />

          <Route path="/admin" element={admin(AdminLogin)()} />
          <Route path="/admin/dashboard" element={admin(AdminLayout)()}>
            <Route index element={admin(Dashboard)()} />
            <Route path="products" element={admin(AdminProducts)()} />
            <Route path="categories" element={admin(AdminCategories)()} />
            <Route path="orders" element={admin(AdminOrders)()} />
            <Route path="settings" element={admin(AdminSettings)()} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </ReactLenis>
    </BrowserRouter>
  )
}
