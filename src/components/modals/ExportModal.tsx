import { useState } from 'react'
import { FileText, Code, File, Image, Download, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import useUIStore from '@/stores/uiStore'

type ExportFormat = 'pdf' | 'html' | 'word' | 'plaintext' | 'latex' | 'epub' | 'png' | 'svg'

interface FormatOption {
  id: ExportFormat
  label: string
  icon: React.ReactNode
}

const formats: FormatOption[] = [
  { id: 'pdf', label: 'PDF', icon: <FileText size={18} /> },
  { id: 'html', label: 'HTML', icon: <Code size={18} /> },
  { id: 'word', label: 'Word', icon: <File size={18} /> },
  { id: 'plaintext', label: '纯文本', icon: <FileText size={18} /> },
  { id: 'latex', label: 'LaTeX', icon: <Code size={18} /> },
  { id: 'epub', label: 'EPUB', icon: <FileText size={18} /> },
  { id: 'png', label: 'PNG', icon: <Image size={18} /> },
  { id: 'svg', label: 'SVG', icon: <Image size={18} /> },
]

interface PdfOptions {
  theme: 'light' | 'dark'
  pageSize: 'A4' | 'A3' | 'Letter' | 'Custom'
  customWidth: string
  customHeight: string
  margins: string
  pageNumbers: boolean
  embedFonts: boolean
}

interface HtmlOptions {
  singleFile: boolean
  includeStyles: boolean
}

export default function ExportModal() {
  const { exportVisible, setExportVisible } = useUIStore()
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const [pdfOptions, setPdfOptions] = useState<PdfOptions>({
    theme: 'light',
    pageSize: 'A4',
    customWidth: '',
    customHeight: '',
    margins: '20mm',
    pageNumbers: true,
    embedFonts: true,
  })

  const [htmlOptions, setHtmlOptions] = useState<HtmlOptions>({
    singleFile: true,
    includeStyles: true,
  })

  if (!exportVisible) return null

  const handleClose = () => {
    if (!exporting) {
      setExportVisible(false)
      setProgress(0)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setProgress(0)
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150))
      setProgress(i)
    }
    setExporting(false)
    setExportVisible(false)
    setProgress(0)
  }

  const renderPdfOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">主题</label>
        <select
          value={pdfOptions.theme}
          onChange={(e) => setPdfOptions({ ...pdfOptions, theme: e.target.value as 'light' | 'dark' })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">页面大小</label>
        <select
          value={pdfOptions.pageSize}
          onChange={(e) => setPdfOptions({ ...pdfOptions, pageSize: e.target.value as PdfOptions['pageSize'] })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="A4">A4</option>
          <option value="A3">A3</option>
          <option value="Letter">Letter</option>
          <option value="Custom">自定义</option>
        </select>
      </div>
      {pdfOptions.pageSize === 'Custom' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">宽度</label>
            <input
              type="text"
              value={pdfOptions.customWidth}
              onChange={(e) => setPdfOptions({ ...pdfOptions, customWidth: e.target.value })}
              placeholder="210mm"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">高度</label>
            <input
              type="text"
              value={pdfOptions.customHeight}
              onChange={(e) => setPdfOptions({ ...pdfOptions, customHeight: e.target.value })}
              placeholder="297mm"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">页边距</label>
        <input
          type="text"
          value={pdfOptions.margins}
          onChange={(e) => setPdfOptions({ ...pdfOptions, margins: e.target.value })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={pdfOptions.pageNumbers}
          onChange={(e) => setPdfOptions({ ...pdfOptions, pageNumbers: e.target.checked })}
          className="rounded border-gray-300 dark:border-gray-600"
        />
        显示页码
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={pdfOptions.embedFonts}
          onChange={(e) => setPdfOptions({ ...pdfOptions, embedFonts: e.target.checked })}
          className="rounded border-gray-300 dark:border-gray-600"
        />
        嵌入字体
      </label>
    </div>
  )

  const renderHtmlOptions = () => (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={htmlOptions.singleFile}
          onChange={(e) => setHtmlOptions({ ...htmlOptions, singleFile: e.target.checked })}
          className="rounded border-gray-300 dark:border-gray-600"
        />
        单文件导出
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={htmlOptions.includeStyles}
          onChange={(e) => setHtmlOptions({ ...htmlOptions, includeStyles: e.target.checked })}
          className="rounded border-gray-300 dark:border-gray-600"
        />
        包含样式
      </label>
    </div>
  )

  const renderGenericOptions = () => (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      使用默认设置导出为 {formats.find((f) => f.id === selectedFormat)?.label} 格式
    </div>
  )

  const renderOptions = () => {
    switch (selectedFormat) {
      case 'pdf':
        return renderPdfOptions()
      case 'html':
        return renderHtmlOptions()
      default:
        return renderGenericOptions()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-[640px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">导出</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-40 border-r border-gray-200 dark:border-gray-700 py-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  selectedFormat === format.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {format.icon}
                {format.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
              {formats.find((f) => f.id === selectedFormat)?.label} 选项
            </h3>
            {renderOptions()}
          </div>
        </div>

        {exporting && (
          <div className="px-4 py-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">导出中... {progress}%</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            disabled={exporting}
            className="px-4 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            <Download size={14} />
            导出
          </button>
        </div>
      </div>
    </div>
  )
}
