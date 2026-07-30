import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="text-6xl mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sahifa topilmadi</h1>
      <p className="text-gray-500 mb-6">So'ralgan sahifa mavjud emas</p>
      <Link to="/" className="btn-primary">Bosh sahifaga qaytish</Link>
    </div>
  )
}
