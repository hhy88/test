import { useState } from 'react'
import {
  Settings,
  Edit3,
  Save,
  Image,
  BarChart3,
  Sigma,
  Keyboard,
  Palette,
  Globe,
  Shield,
  RefreshCw,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import useUIStore from '@/stores/uiStore'
import useSettingsStore from '@/stores/settingsStore'

type SettingsPage =
  | 'general'
  | 'editor'
  | 'save'
  | 'image'
  | 'chart'
  | 'formula'
  | 'keymap'
  | 'appearance'
  | 'language'
  | 'privacy'
  | 'update'

interface NavItem {
  id: SettingsPage
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'general', label: '通用', icon: <Settings size={16} /> },
  { id: 'editor', label: '编辑', icon: <Edit3 size={16} /> },
  { id: 'save', label: '保存', icon: <Save size={16} /> },
  { id: 'image', label: '图片', icon: <Image size={16} /> },
  { id: 'chart', label: '图表', icon: <BarChart3 size={16} /> },
  { id: 'formula', label: '公式', icon: <Sigma size={16} /> },
  { id: 'keymap', label: '快捷键', icon: <Keyboard size={16} /> },
  { id: 'appearance', label: '外观', icon: <Palette size={16} /> },
  { id: 'language', label: '语言', icon: <Globe size={16} /> },
  { id: 'privacy', label: '隐私', icon: <Shield size={16} /> },
  { id: 'update', label: '更新', icon: <RefreshCw size={16} /> },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors',
        checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform',
          checked && 'translate-x-4'
        )}
      />
    </button>
  )
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  displayValue?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-blue-500"
      />
      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[32px] text-right">
        {displayValue ?? value}
      </span>
    </div>
  )
}

export default function SettingsModal() {
  const { settingsVisible, setSettingsVisible } = useUIStore()
  const settings = useSettingsStore()
  const [activePage, setActivePage] = useState<SettingsPage>('general')

  if (!settingsVisible) return null

  const handleClose = () => setSettingsVisible(false)

  const renderGeneral = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">启动时恢复上次会话</span>
        <Toggle checked={settings.restoreSession} onChange={settings.setRestoreSession} />
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">默认编码</label>
        <select
          value={settings.defaultEncoding}
          onChange={(e) => settings.setDefaultEncoding(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="UTF-8">UTF-8</option>
          <option value="GBK">GBK</option>
          <option value="GB2312">GB2312</option>
          <option value="ISO-8859-1">ISO-8859-1</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">语言</label>
        <select
          value={settings.language}
          onChange={(e) => settings.setLanguage(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="zh-CN">简体中文</option>
          <option value="zh-TW">繁體中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
      </div>
    </div>
  )

  const renderEditor = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">拼写检查</span>
        <Toggle checked={settings.spellCheck} onChange={settings.setSpellCheck} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">自动配对括号</span>
        <Toggle
          checked={settings.editorConfig.autoCloseBrackets}
          onChange={(v) => settings.setEditorConfig({ autoCloseBrackets: v })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Tab 大小</label>
        <select
          value={settings.editorConfig.tabSize}
          onChange={(e) => settings.setEditorConfig({ tabSize: Number(e.target.value) })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={8}>8</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">自动换行</span>
        <Toggle
          checked={settings.editorConfig.wordWrap}
          onChange={(v) => settings.setEditorConfig({ wordWrap: v })}
        />
      </div>
    </div>
  )

  const renderSave = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">自动保存</span>
        <Toggle
          checked={settings.autoSave.enabled}
          onChange={(v) => settings.setAutoSave({ enabled: v })}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
          保存间隔（秒）
        </label>
        <Slider
          value={settings.autoSave.interval}
          min={1}
          max={30}
          step={1}
          onChange={(v) => settings.setAutoSave({ interval: v })}
          displayValue={`${settings.autoSave.interval}s`}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
          备份保留数量
        </label>
        <Slider
          value={settings.backupCount}
          min={1}
          max={100}
          step={1}
          onChange={settings.setBackupCount}
        />
      </div>
    </div>
  )

  const renderAppearance = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">主题</label>
        <select
          value={settings.theme}
          onChange={(e) => settings.setTheme(e.target.value as typeof settings.theme)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="default-light">默认浅色</option>
          <option value="default-dark">默认深色</option>
          <option value="graphite">石墨</option>
          <option value="eyecare">护眼</option>
          <option value="minimal">极简</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">字体大小</label>
        <Slider
          value={settings.fontSize}
          min={12}
          max={24}
          step={1}
          onChange={settings.setFontSize}
          displayValue={`${settings.fontSize}px`}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">行高</label>
        <Slider
          value={settings.lineHeight}
          min={1.0}
          max={3.0}
          step={0.1}
          onChange={settings.setLineHeight}
          displayValue={settings.lineHeight.toFixed(1)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">中文字体</label>
        <input
          type="text"
          value={settings.fontFamily.chinese}
          onChange={(e) => settings.setFontFamily({ chinese: e.target.value })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">英文字体</label>
        <input
          type="text"
          value={settings.fontFamily.english}
          onChange={(e) => settings.setFontFamily({ english: e.target.value })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  )

  const renderPlaceholder = (label: string) => (
    <div className="text-sm text-gray-500 dark:text-gray-400">{label}设置即将推出</div>
  )

  const renderContent = () => {
    switch (activePage) {
      case 'general':
        return renderGeneral()
      case 'editor':
        return renderEditor()
      case 'save':
        return renderSave()
      case 'appearance':
        return renderAppearance()
      case 'image':
        return renderPlaceholder('图片')
      case 'chart':
        return renderPlaceholder('图表')
      case 'formula':
        return renderPlaceholder('公式')
      case 'keymap':
        return renderPlaceholder('快捷键')
      case 'language':
        return renderPlaceholder('语言')
      case 'privacy':
        return renderPlaceholder('隐私')
      case 'update':
        return renderPlaceholder('更新')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-[720px] h-[560px] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">设置</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <nav className="w-44 border-r border-gray-200 dark:border-gray-700 py-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  activePage === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 p-5 overflow-y-auto">
            <h3 className="text-sm font-medium mb-4 text-gray-900 dark:text-gray-100">
              {navItems.find((i) => i.id === activePage)?.label}
            </h3>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
