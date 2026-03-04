import { Link } from 'react-router-dom'
import { appConfig } from '../config/app.config'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-6xl font-extrabold text-indigo-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        Back to {appConfig.productName}
      </Link>
    </div>
  )
}
