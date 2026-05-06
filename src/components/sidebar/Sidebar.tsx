import { useState, useCallback, useRef, useEffect } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import useUIStore from '@/stores/uiStore'
import FileTree from './FileTree'
import Outline from './Outline'
import { cn } from '@/lib/utils'

const MIN_WIDTH = 180
const MAX_WIDTH = 500

export default function Sidebar() {
  const sidebarVisible = useUIStore((s) => s.sidebarVisible)
  const sidebarWidth = useUIStore((s) => s.sidebarWidth)
  const sidebarTab = useUIStore((s) => s.sidebarTab)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setSidebarWidth = useUIStore((s) => s.setSidebarWidth)
  const setSidebarTab = useUIStore((s) => s.setSidebarTab)

  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, setSidebarWidth])

  return (
    <div className="flex h-full">
      <div
        ref={sidebarRef}
        className={cn(
          'flex h-full flex-col border-r border-[var(--sidebar-border,#e0e0e0)] bg-[var(--sidebar-bg,#fafafa)] overflow-hidden',
          sidebarVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        style={{
          width: sidebarVisible ? sidebarWidth : 0,
          transition: isResizing ? 'none' : 'width 0.2s ease, opacity 0.2s ease',
        }}
      >
        <div className="flex items-center border-b border-[var(--sidebar-border,#e0e0e0)] px-1 py-1">
          <button
            onClick={() => setSidebarTab('files')}
            className={cn(
              'flex-1 rounded px-3 py-1 text-xs font-medium transition-colors',
              sidebarTab === 'files'
                ? 'bg-[var(--sidebar-tab-active-bg,#e8e8e8)] text-[var(--sidebar-tab-active-text,#333)]'
                : 'text-[var(--sidebar-tab-inactive-text,#888)] hover:bg-[var(--sidebar-tab-hover-bg,#f0f0f0)]',
            )}
          >
            文件树
          </button>
          <button
            onClick={() => setSidebarTab('outline')}
            className={cn(
              'flex-1 rounded px-3 py-1 text-xs font-medium transition-colors',
              sidebarTab === 'outline'
                ? 'bg-[var(--sidebar-tab-active-bg,#e8e8e8)] text-[var(--sidebar-tab-active-text,#333)]'
                : 'text-[var(--sidebar-tab-inactive-text,#888)] hover:bg-[var(--sidebar-tab-hover-bg,#f0f0f0)]',
            )}
          >
            大纲
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {sidebarTab === 'files' ? <FileTree /> : <Outline />}
        </div>

        <div
          className={cn(
            'absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[var(--sidebar-resize-hover,#c0c0c0)] active:bg-[var(--sidebar-resize-active,#999)]',
            isResizing && 'bg-[var(--sidebar-resize-active,#999)]',
          )}
          style={{ position: 'absolute', right: -2 }}
          onMouseDown={handleMouseDown}
        />
      </div>

      <button
        onClick={toggleSidebar}
        className={cn(
          'flex h-full w-6 flex-shrink-0 items-center justify-center border-r border-[var(--sidebar-border,#e0e0e0)] bg-[var(--sidebar-toggle-bg,#fafafa)] text-[var(--sidebar-toggle-text,#666)] transition-colors hover:bg-[var(--sidebar-toggle-hover-bg,#f0f0f0)] hover:text-[var(--sidebar-toggle-hover-text,#333)]',
        )}
        title={sidebarVisible ? '收起侧边栏' : '展开侧边栏'}
      >
        {sidebarVisible ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
      </button>
    </div>
  )
}
