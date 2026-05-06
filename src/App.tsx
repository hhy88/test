import { useEffect, useCallback } from 'react'
import '@/themes/default-light.css'
import '@/themes/default-dark.css'
import '@/themes/graphite.css'
import '@/themes/eyecare.css'
import '@/themes/minimal.css'
import MenuBar from '@/components/editor/MenuBar'
import EditorCanvas from '@/components/editor/EditorCanvas'
import StatusBar from '@/components/editor/StatusBar'
import Toolbar from '@/components/editor/Toolbar'
import Sidebar from '@/components/sidebar/Sidebar'
import SearchModal from '@/components/modals/SearchModal'
import ExportModal from '@/components/modals/ExportModal'
import SettingsModal from '@/components/modals/SettingsModal'
import AboutModal from '@/components/modals/AboutModal'
import ContextMenu from '@/components/context-menu/ContextMenu'
import useSettingsStore from '@/stores/settingsStore'
import useUIStore from '@/stores/uiStore'
import useEditorStore from '@/stores/editorStore'
import useFileStore from '@/stores/fileStore'

const WELCOME_CONTENT = `# 欢迎使用 MarkEdit

MarkEdit 是一款本地轻量化 Markdown 编辑阅读一体化客户端，完整复刻 Typora 全部原生能力。

## 快速开始

- **加粗** 使用 \`Ctrl+B\`
- *斜体* 使用 \`Ctrl+I\`
- ~~删除线~~ 使用 \`Ctrl+Shift+S\`
- [链接](https://example.com) 使用 \`Ctrl+K\`

## 代码块

\`\`\`javascript
function hello() {
  console.log("Hello, MarkEdit!");
}
\`\`\`

## 表格

| 功能 | 快捷键 |
|------|--------|
| 保存 | Ctrl+S |
| 查找 | Ctrl+F |
| 源码模式 | Ctrl+/ |

## 任务列表

- [x] 创建项目
- [x] 实现编辑器
- [ ] 完善导出功能
- [ ] 添加更多主题

## 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## 引用

> 知识就是力量。 — 弗朗西斯·培根

---

开始你的写作之旅吧！
`

export default function App() {
  const theme = useSettingsStore((s) => s.theme)
  const { searchVisible, exportVisible, settingsVisible, aboutVisible, isFullscreen, setFullscreen, setSearchVisible, setExportVisible, setSettingsVisible, setAboutVisible } = useUIStore()
  const { editMode, setEditMode } = useEditorStore()
  const { activeDocumentId, saveFile, documents, createNewFile, openFile } = useFileStore()

  useEffect(() => {
    if (documents.length === 0) {
      openFile({
        title: '欢迎.md',
        content: WELCOME_CONTENT,
        filePath: null,
        encoding: 'utf-8',
        lineEnding: 'lf',
        isModified: false,
        lastSavedAt: null,
        cursorPosition: { line: 1, column: 1 },
        scrollPosition: 0,
        editMode: 'wysiwyg',
      })
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isCtrl = e.ctrlKey || e.metaKey

    if (isCtrl && e.key === 's') {
      e.preventDefault()
      if (activeDocumentId) saveFile(activeDocumentId)
      return
    }

    if (isCtrl && e.key === 'f') {
      e.preventDefault()
      setSearchVisible(!searchVisible)
      return
    }

    if (isCtrl && e.key === '/') {
      e.preventDefault()
      setEditMode(editMode === 'source' ? 'wysiwyg' : 'source')
      return
    }

    if (e.key === 'F11') {
      e.preventDefault()
      setFullscreen(!isFullscreen)
      return
    }

    if (e.key === 'Escape') {
      if (searchVisible) { setSearchVisible(false); return }
      if (exportVisible) { setExportVisible(false); return }
      if (settingsVisible) { setSettingsVisible(false); return }
      if (aboutVisible) { setAboutVisible(false); return }
    }
  }, [activeDocumentId, saveFile, searchVisible, exportVisible, settingsVisible, aboutVisible, isFullscreen, setSearchVisible, setExportVisible, setSettingsVisible, setAboutVisible, editMode, setEditMode, setFullscreen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.()
      }
    }
  }, [isFullscreen])

  return (
    <div data-theme={theme} className="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      <MenuBar />
      <div className="flex flex-1 pt-8 overflow-hidden">
        <Sidebar />
        <div className="flex-1 relative overflow-hidden">
          <EditorCanvas />
          <Toolbar />
        </div>
      </div>
      <StatusBar />
      {searchVisible && <SearchModal />}
      {exportVisible && <ExportModal />}
      {settingsVisible && <SettingsModal />}
      {aboutVisible && <AboutModal />}
      <ContextMenu />
    </div>
  )
}
