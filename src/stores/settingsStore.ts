import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'default-light' | 'default-dark' | 'graphite' | 'eyecare' | 'minimal'

interface FontFamily {
  chinese: string
  english: string
}

interface AutoSave {
  enabled: boolean
  interval: number
}

interface EditorConfig {
  tabSize: number
  insertSpace: boolean
  wordWrap: boolean
  highlightActiveLine: boolean
  bracketMatching: boolean
  autoCloseBrackets: boolean
  formatOnPaste: boolean
  smoothScrolling: boolean
}

interface KeymapConfig {
  preset: 'default' | 'vim' | 'emacs'
  custom: Record<string, string>
}

interface SettingsState {
  theme: Theme
  fontSize: number
  fontFamily: FontFamily
  lineHeight: number
  autoSave: AutoSave
  spellCheck: boolean
  showLineNumber: boolean
  editorConfig: EditorConfig
  keymapConfig: KeymapConfig
  restoreSession: boolean
  defaultEncoding: string
  language: string
  backupCount: number

  setTheme: (theme: Theme) => void
  setFontSize: (size: number) => void
  setFontFamily: (fontFamily: Partial<FontFamily>) => void
  setLineHeight: (height: number) => void
  setAutoSave: (autoSave: Partial<AutoSave>) => void
  setSpellCheck: (enabled: boolean) => void
  setShowLineNumber: (show: boolean) => void
  setEditorConfig: (config: Partial<EditorConfig>) => void
  setKeymapConfig: (config: Partial<KeymapConfig>) => void
  setRestoreSession: (enabled: boolean) => void
  setDefaultEncoding: (encoding: string) => void
  setLanguage: (language: string) => void
  setBackupCount: (count: number) => void
  resetSettings: () => void
}

const defaultSettings = {
  theme: 'default-light' as Theme,
  fontSize: 16,
  fontFamily: {
    chinese: '思源宋体, Noto Serif SC, 宋体, SimSun, serif',
    english: 'Georgia, Times New Roman, serif',
  },
  lineHeight: 1.6,
  autoSave: {
    enabled: true,
    interval: 5,
  },
  spellCheck: false,
  showLineNumber: false,
  editorConfig: {
    tabSize: 4,
    insertSpace: true,
    wordWrap: true,
    highlightActiveLine: true,
    bracketMatching: true,
    autoCloseBrackets: true,
    formatOnPaste: true,
    smoothScrolling: true,
  },
  keymapConfig: {
    preset: 'default' as const,
    custom: {},
  },
  restoreSession: true,
  defaultEncoding: 'UTF-8',
  language: 'zh-CN',
  backupCount: 10,
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme) => set({ theme }),
      setFontSize: (size) => set({ fontSize: size }),
      setFontFamily: (fontFamily) =>
        set((state) => ({
          fontFamily: { ...state.fontFamily, ...fontFamily },
        })),
      setLineHeight: (height) => set({ lineHeight: height }),
      setAutoSave: (autoSave) =>
        set((state) => ({
          autoSave: { ...state.autoSave, ...autoSave },
        })),
      setSpellCheck: (enabled) => set({ spellCheck: enabled }),
      setShowLineNumber: (show) => set({ showLineNumber: show }),
      setEditorConfig: (config) =>
        set((state) => ({
          editorConfig: { ...state.editorConfig, ...config },
        })),
      setKeymapConfig: (config) =>
        set((state) => ({
          keymapConfig: { ...state.keymapConfig, ...config },
        })),
      setRestoreSession: (enabled) => set({ restoreSession: enabled }),
      setDefaultEncoding: (encoding) => set({ defaultEncoding: encoding }),
      setLanguage: (language) => set({ language }),
      setBackupCount: (count) => set({ backupCount: count }),
      resetSettings: () => set({ ...defaultSettings }),
    }),
    {
      name: 'markedit-settings',
    }
  )
)

export default useSettingsStore
