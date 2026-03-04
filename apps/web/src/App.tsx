import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AppLayout } from './components/Layout'
import { useIsAuthenticated } from './hooks/useAuth'
import { appConfig } from './config/app.config'

// Lazy-load pages for fast initial bundle
const Landing      = lazy(() => import('./pages/Landing'))
const Login        = lazy(() => import('./pages/Login'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const Entities     = lazy(() => import('./pages/Entities'))
const EntityDetail = lazy(() => import('./pages/EntityDetail'))
const Settings     = lazy(() => import('./pages/Settings'))
const NotFound     = lazy(() => import('./pages/NotFound'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  )
}

// Inject CSS variables from app.config so brand colors work
function injectBrandVars() {
  const root = document.documentElement
  Object.entries(appConfig.brand.cssVars).forEach(([k, v]) => {
    root.style.setProperty(k, v)
  })
}
injectBrandVars()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/entities" element={<Entities />} />
              <Route path="/entities/:id" element={<EntityDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            background: '#1f2937',
            color: '#f9fafb',
            fontSize: '14px',
          },
        }}
      />

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
