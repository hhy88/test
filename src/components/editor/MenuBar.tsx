import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronRight, Check } from 'lucide-react'
import useUIStore from '@/stores/uiStore'
import useSettingsStore from '@/stores/settingsStore'
import useEditorStore from '@/stores/editorStore'
import useFileStore from '@/stores/fileStore'

type MI =
  | { type: 'divider' }
  | { type: 'item'; label: string; shortcut?: string; action?: string; disabled?: boolean }
  | { type: 'submenu'; label: string; children: MI[] }

const I = (label: string, shortcut?: string, action?: string, disabled?: boolean): MI =>
  ({ type: 'item', label, shortcut, action, disabled })
const S = (label: string, children: MI[]): MI =>
  ({ type: 'submenu', label, children })
const D: MI = { type: 'divider' }

const MENUS: { label: string; items: MI[] }[] = [
  { label: '文件(F)', items: [
    I('新建', 'Ctrl+N', 'newFile'), I('新建窗口', 'Ctrl+Shift+N', 'newWindow'), D,
    I('打开', 'Ctrl+O', 'openFile'), I('打开文件夹', '', 'openFolder'), D,
    I('保存', 'Ctrl+S', 'saveFile'), I('另存为', 'Ctrl+Shift+S', 'saveAs'), D,
    S('导出', [I('PDF', '', 'exportPDF'), I('HTML', '', 'exportHTML'), I('Word', '', 'exportWord'), I('纯文本', '', 'exportPlainText'), I('LaTeX', '', 'exportLaTeX'), I('EPUB', '', 'exportEPUB'), I('PNG', '', 'exportPNG'), I('SVG', '', 'exportSVG')]),
    D, S('最近文件', []), D,
    I('关闭', 'Ctrl+W', 'closeFile'), I('全部关闭', '', 'closeAll'),
  ]},
  { label: '编辑(E)', items: [
    I('撤销', 'Ctrl+Z', 'undo'), I('重做', 'Ctrl+Y', 'redo'), D,
    I('剪切', 'Ctrl+X', 'cut'), I('复制', 'Ctrl+C', 'copy'), I('粘贴', 'Ctrl+V', 'paste'), I('纯文本粘贴', 'Ctrl+Shift+V', 'pastePlainText'), D,
    I('全选', 'Ctrl+A', 'selectAll'), D,
    I('查找', 'Ctrl+F', 'toggleSearch'), I('替换', 'Ctrl+H', 'toggleReplace'),
  ]},
  { label: '段落(P)', items: [
    S('标题', [I('H1', '', 'heading1'), I('H2', '', 'heading2'), I('H3', '', 'heading3'), I('H4', '', 'heading4'), I('H5', '', 'heading5'), I('H6', '', 'heading6')]),
    D, I('提升标题', 'Shift+Tab', 'promoteHeading'), I('降低标题', 'Tab', 'demoteHeading'), D,
    I('表格', '', 'insertTable'), I('代码块', 'Ctrl+Shift+K', 'insertCodeBlock'), I('数学块', 'Ctrl+Shift+M', 'insertMathBlock'), D,
    I('引用', 'Ctrl+Shift+Q', 'insertBlockquote'), I('有序列表', 'Ctrl+Shift+9', 'insertOrderedList'), I('无序列表', 'Ctrl+Shift+8', 'insertUnorderedList'), I('任务列表', '', 'insertTaskList'),
  ]},
  { label: '格式(O)', items: [
    I('加粗', 'Ctrl+B', 'bold'), I('斜体', 'Ctrl+I', 'italic'), I('下划线', 'Ctrl+U', 'underline'), I('删除线', 'Ctrl+Shift+S', 'strikethrough'), D,
    I('行内代码', 'Ctrl+`', 'inlineCode'), I('行内公式', '', 'inlineMath'), D,
    I('上标', '', 'superscript'), I('下标', '', 'subscript'), I('高亮', '', 'highlight'), D,
    I('超链接', 'Ctrl+K', 'insertLink'), I('图片', 'Ctrl+Shift+I', 'insertImage'), D,
    I('清除格式', '', 'clearFormat'),
  ]},
  { label: '视图(V)', items: [
    I('文件树', 'Ctrl+Shift+1', 'toggleSidebarFiles'), I('大纲', 'Ctrl+Shift+2', 'toggleSidebarOutline'), D,
    I('源码模式', 'Ctrl+/', 'toggleSourceMode'), D,
    I('专注模式', '', 'focusMode'), I('打字机模式', '', 'typewriterMode'), D,
    I('全屏', 'F11', 'toggleFullscreen'), D,
    I('始终置顶', '', 'alwaysOnTop'),
  ]},
  { label: '主题(T)', items: [
    I('默认浅色', '', 'setThemeLight'), I('默认深色', '', 'setThemeDark'), I('石墨灰', '', 'setThemeGraphite'), I('护眼柔和', '', 'setThemeEyecare'), I('极简纯白', '', 'setThemeMinimal'), D,
    I('导入主题', '', 'importTheme'), I('导出主题', '', 'exportTheme'),
  ]},
  { label: '偏好设置(S)', items: [I('打开偏好设置', 'Ctrl+,', 'toggleSettings')] },
  { label: '帮助(H)', items: [I('官方网站', '', 'openWebsite'), I('文档', '', 'openDocs'), D, I('检查更新', '', 'checkUpdate'), D, I('关于 MarkEdit', '', 'about')] },
]

const themeMap: Record<string, string> = {
  setThemeLight: 'default-light', setThemeDark: 'default-dark', setThemeGraphite: 'graphite',
  setThemeEyecare: 'eyecare', setThemeMinimal: 'minimal',
}

export default function MenuBar() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [hoveredSub, setHoveredSub] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const ui = useUIStore()
  const settings = useSettingsStore()
  const editor = useEditorStore()
  const file = useFileStore()

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenIdx(null)
    }
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null)
    }
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [])

  const act = useCallback((action: string) => {
    setOpenIdx(null)
    if (action.startsWith('openRecent')) return
    if (action.startsWith('export')) { ui.toggleExport(); return }
    const map: Record<string, () => void> = {
      newFile: () => file.createNewFile(),
      saveFile: () => { if (file.activeDocumentId) file.saveFile(file.activeDocumentId) },
      closeFile: () => { if (file.activeDocumentId) file.closeFile(file.activeDocumentId) },
      closeAll: () => [...file.documents].reverse().forEach(d => file.closeFile(d.id)),
      toggleSearch: ui.toggleSearch,
      toggleReplace: ui.toggleSearch,
      toggleSidebarFiles: () => { ui.setSidebarTab('files'); ui.setSidebarVisible(true) },
      toggleSidebarOutline: () => { ui.setSidebarTab('outline'); ui.setSidebarVisible(true) },
      toggleSourceMode: () => editor.setEditMode(editor.editMode === 'source' ? 'wysiwyg' : 'source'),
      toggleFullscreen: ui.toggleFullscreen,
      toggleSettings: ui.toggleSettings,
      setThemeLight: () => settings.setTheme('default-light'),
      setThemeDark: () => settings.setTheme('default-dark'),
      setThemeGraphite: () => settings.setTheme('graphite'),
      setThemeEyecare: () => settings.setTheme('eyecare'),
      setThemeMinimal: () => settings.setTheme('minimal'),
    }
    map[action]?.()
  }, [file, ui, editor, settings])

  const isChecked = (action?: string) => {
    if (!action) return false
    if (action === 'toggleSourceMode') return editor.editMode === 'source'
    if (themeMap[action]) return settings.theme === themeMap[action]
    return false
  }

  const resolveChildren = (item: MI): MI[] => {
    if (item.type === 'submenu' && item.label === '最近文件') {
      return file.recentFiles.length
        ? file.recentFiles.map(f => I(f.split(/[/\\]/).pop() || f, '', 'openRecent:' + f))
        : [I('无最近文件', '', undefined, true)]
    }
    return item.type === 'submenu' ? item.children : []
  }

  const renderItem = (item: MI, idx: number, depth: number) => {
    if (item.type === 'divider') {
      return <div key={idx} className="my-1 border-t border-gray-200 dark:border-gray-700" />
    }
    if (item.type === 'submenu') {
      const key = `${depth}-${item.label}`
      return (
        <div key={idx} className="relative"
          onMouseEnter={() => setHoveredSub(key)} onMouseLeave={() => setHoveredSub(null)}>
          <div className="px-3 py-1.5 text-sm flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="flex items-center gap-2"><span className="w-4" />{item.label}</span>
            <ChevronRight size={14} className="text-gray-400" />
          </div>
          {hoveredSub === key && (
            <div className="absolute left-full top-0 min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded py-1 z-50">
              {resolveChildren(item).map((si, j) => renderItem(si, j, depth + 1))}
            </div>
          )}
        </div>
      )
    }
    const checked = isChecked(item.action)
    return (
      <div key={idx}
        className={`px-3 py-1.5 text-sm flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${item.disabled ? 'opacity-40 pointer-events-none' : ''}`}
        onClick={() => item.action && act(item.action)}>
        <span className="flex items-center gap-2">
          {checked ? <Check size={14} /> : <span className="w-4" />}{item.label}
        </span>
        {item.shortcut && <span className="ml-8 text-xs text-gray-400">{item.shortcut}</span>}
      </div>
    )
  }

  return (
    <div ref={ref} className="fixed top-0 left-0 right-0 h-8 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-1 z-50 select-none text-sm">
      {MENUS.map((menu, i) => (
        <div key={i} className="relative">
          <div className={`px-3 py-1 rounded cursor-pointer ${openIdx === i ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            onMouseEnter={() => openIdx !== null && setOpenIdx(i)}>
            {menu.label}
          </div>
          {openIdx === i && (
            <div className="absolute top-full left-0 min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded py-1 z-50">
              {menu.items.map((item, j) => renderItem(item, j, 0))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
