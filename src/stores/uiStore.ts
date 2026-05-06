import { create } from 'zustand'

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  type: string | null
  target: string | null
}

interface UIState {
  sidebarVisible: boolean
  sidebarWidth: number
  sidebarTab: 'files' | 'outline'
  isFullscreen: boolean
  toolbarVisible: boolean
  searchVisible: boolean
  settingsVisible: boolean
  exportVisible: boolean
  aboutVisible: boolean
  contextMenu: ContextMenuState

  toggleSidebar: () => void
  setSidebarVisible: (visible: boolean) => void
  setSidebarWidth: (width: number) => void
  setSidebarTab: (tab: 'files' | 'outline') => void
  toggleFullscreen: () => void
  setFullscreen: (fullscreen: boolean) => void
  toggleToolbar: () => void
  setToolbarVisible: (visible: boolean) => void
  toggleSearch: () => void
  setSearchVisible: (visible: boolean) => void
  toggleSettings: () => void
  setSettingsVisible: (visible: boolean) => void
  toggleExport: () => void
  setExportVisible: (visible: boolean) => void
  toggleAbout: () => void
  setAboutVisible: (visible: boolean) => void
  showContextMenu: (x: number, y: number, type: string, target?: string | null) => void
  hideContextMenu: () => void
}

const useUIStore = create<UIState>((set) => ({
  sidebarVisible: true,
  sidebarWidth: 250,
  sidebarTab: 'files',
  isFullscreen: false,
  toolbarVisible: true,
  searchVisible: false,
  settingsVisible: false,
  exportVisible: false,
  aboutVisible: false,
  contextMenu: {
    visible: false,
    x: 0,
    y: 0,
    type: null,
    target: null,
  },

  toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
  setSidebarVisible: (visible) => set({ sidebarVisible: visible }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  toggleToolbar: () => set((state) => ({ toolbarVisible: !state.toolbarVisible })),
  setToolbarVisible: (visible) => set({ toolbarVisible: visible }),
  toggleSearch: () => set((state) => ({ searchVisible: !state.searchVisible })),
  setSearchVisible: (visible) => set({ searchVisible: visible }),
  toggleSettings: () => set((state) => ({ settingsVisible: !state.settingsVisible })),
  setSettingsVisible: (visible) => set({ settingsVisible: visible }),
  toggleExport: () => set((state) => ({ exportVisible: !state.exportVisible })),
  setExportVisible: (visible) => set({ exportVisible: visible }),
  toggleAbout: () => set((state) => ({ aboutVisible: !state.aboutVisible })),
  setAboutVisible: (visible) => set({ aboutVisible: visible }),

  showContextMenu: (x, y, type, target = null) =>
    set({
      contextMenu: { visible: true, x, y, type, target },
    }),

  hideContextMenu: () =>
    set({
      contextMenu: { visible: false, x: 0, y: 0, type: null, target: null },
    }),
}))

export default useUIStore
