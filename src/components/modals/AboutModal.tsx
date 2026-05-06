import { X } from 'lucide-react'
import useUIStore from '@/stores/uiStore'

export default function AboutModal() {
  const { aboutVisible, setAboutVisible } = useUIStore()

  if (!aboutVisible) return null

  const handleClose = () => setAboutVisible(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-[360px]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">关于</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center px-6 py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">MarkEdit</h1>
          <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">版本 1.0.0</span>
          <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
            Markdown编辑阅读一体化客户端
          </p>
        </div>

        <div className="flex justify-center px-4 pb-4">
          <button
            onClick={handleClose}
            className="px-6 py-1.5 text-sm rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
