## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层 (React + TypeScript)"
        "主编辑器页面" --> "菜单栏组件"
        "主编辑器页面" --> "工具栏组件"
        "主编辑器页面" --> "文件树面板"
        "主编辑器页面" --> "大纲面板"
        "主编辑器页面" --> "编辑画布"
        "主编辑器页面" --> "状态栏组件"
        "编辑画布" --> "ProseMirror编辑引擎"
        "ProseMirror编辑引擎" --> "Markdown解析器"
        "ProseMirror编辑引擎" --> "实时渲染器"
        "ProseMirror编辑引擎" --> "源码模式切换"
        "实时渲染器" --> "代码高亮(Shiki)"
        "实时渲染器" --> "公式渲染(KaTeX)"
        "实时渲染器" --> "图表渲染(Mermaid)"
    end

    subgraph "状态管理层 (Zustand)"
        "编辑器状态" --> "文档内容"
        "编辑器状态" --> "光标位置"
        "编辑器状态" --> "编辑模式"
        "文件管理状态" --> "打开文件列表"
        "文件管理状态" --> "当前活跃文件"
        "UI状态" --> "面板显隐"
        "UI状态" --> "主题配置"
        "UI状态" --> "偏好设置"
    end

    subgraph "服务层 (Browser APIs)"
        "File System Access API" --> "文件读写"
        "IndexedDB" --> "本地缓存"
        "LocalStorage" --> "配置持久化"
        "Clipboard API" --> "剪贴板操作"
    end

    subgraph "渲染引擎层"
        "ProseMirror Core" --> "Schema定义"
        "ProseMirror Core" --> "插件系统"
        "ProseMirror Core" --> "事务管理"
        "Markdown双向转换" --> "prosemirror-markdown"
        "Markdown双向转换" --> "自定义序列化"
    end
```

## 2. 技术说明

- **前端框架**: React@18 + TypeScript + Vite
- **初始化工具**: vite-init (react-ts 模板)
- **样式方案**: Tailwind CSS@3 + CSS Variables 主题系统
- **状态管理**: Zustand
- **编辑器引擎**: ProseMirror (核心 WYSIWYG 编辑能力)
- **Markdown解析**: markdown-it + prosemirror-markdown (双向转换)
- **代码高亮**: Shiki (支持100+语言，VSCode同源引擎)
- **数学公式**: KaTeX (高性能公式渲染)
- **图表渲染**: Mermaid@11 (本地离线渲染)
- **文件系统**: File System Access API + IndexedDB 降级方案
- **导出功能**: html2pdf + html-docx-js + 自定义序列化器
- **后端**: 无 (纯前端本地应用)
- **数据库**: IndexedDB (本地文档缓存与配置存储)

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 主编辑器页面，包含全部编辑功能 |
| /settings | 偏好设置面板（模态弹窗形式，非独立路由） |

> 注：本应用为单页应用，核心功能全部在主编辑器页面完成，设置与导出均以模态弹窗形式呈现。

## 4. 核心模块架构

### 4.1 编辑器引擎模块

```mermaid
flowchart LR
    "用户输入" --> "ProseMirror EditorView"
    "ProseMirror EditorView" --> "Transaction"
    "Transaction" --> "EditorState"
    "EditorState" --> "DOM更新"
    "EditorState" --> "Markdown序列化"
    "Markdown序列化" --> "文档存储"
    "文档存储" --> "Markdown解析"
    "Markdown解析" --> "ProseMirror Node"
    "ProseMirror Node" --> "EditorState"
```

**ProseMirror 插件体系**:

| 插件 | 功能 |
|------|------|
| keymap | 快捷键映射 |
| history | 撤销/重做 |
| placeholder | 空白段落占位符 |
| gapcursor | 代码块/图表间隙光标 |
| dropcursor | 拖拽位置指示 |
| tableEditing | 表格可视化编辑 |
| mathPlugin | 公式块实时渲染 |
| codeBlockPlugin | 代码块语法高亮 |
| mermaidPlugin | Mermaid图表渲染 |
| imagePlugin | 图片插入与预览 |
| taskListPlugin | 任务列表勾选 |
| highlightPlugin | 行内高亮 |
| footnotePlugin | 脚注悬浮预览 |
| spellcheckPlugin | 拼写检查 |
| autoSavePlugin | 自动保存 |

### 4.2 文件管理模块

```mermaid
flowchart TD
    "File System Access API" --> "目录句柄获取"
    "目录句柄获取" --> "递归遍历文件树"
    "递归遍历文件树" --> "文件树状态更新"
    "文件树状态更新" --> "UI渲染"
    "UI渲染" --> "用户操作"
    "用户操作" --> "新建文件/文件夹"
    "用户操作" --> "重命名"
    "用户操作" --> "删除"
    "用户操作" --> "拖拽移动"
    "用户操作" --> "打开编辑"
```

### 4.3 主题系统模块

```mermaid
flowchart TD
    "主题配置" --> "CSS Variables注入"
    "CSS Variables注入" --> "编辑器样式"
    "CSS Variables注入" --> "UI组件样式"
    "CSS Variables注入" --> "代码高亮主题"
    "CSS Variables注入" --> "公式渲染配色"
    "CSS Variables注入" --> "Mermaid主题"
    "内置主题预设" --> "主题配置"
    "自定义CSS" --> "主题配置"
    "偏好设置" --> "主题配置"
```

## 5. 项目目录结构

```
src/
├── components/
│   ├── editor/               # 编辑器核心组件
│   │   ├── EditorCanvas.tsx   # 编辑画布主组件
│   │   ├── SourceMode.tsx     # 源码模式组件
│   │   ├── MenuBar.tsx        # 顶部菜单栏
│   │   ├── Toolbar.tsx        # 悬浮工具栏
│   │   └── StatusBar.tsx      # 底部状态栏
│   ├── sidebar/              # 左侧面板组件
│   │   ├── FileTree.tsx       # 文件树面板
│   │   ├── Outline.tsx        # 大纲导航面板
│   │   └── SidebarTabs.tsx    # 面板切换标签
│   ├── modals/               # 模态弹窗组件
│   │   ├── SettingsModal.tsx  # 偏好设置弹窗
│   │   ├── ExportModal.tsx    # 导出弹窗
│   │   ├── SearchModal.tsx    # 查找替换浮窗
│   │   └── AboutModal.tsx     # 关于弹窗
│   ├── context-menu/         # 右键菜单组件
│   │   └── ContextMenu.tsx    # 通用右键菜单
│   └── common/               # 通用UI组件
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       └── Toggle.tsx
├── hooks/                    # 自定义Hooks
│   ├── useEditor.ts          # 编辑器实例管理
│   ├── useFileSystem.ts      # 文件系统操作
│   ├── useTheme.ts           # 主题管理
│   ├── useKeymap.ts          # 快捷键管理
│   ├── useAutoSave.ts        # 自动保存
│   └── useSearch.ts          # 查找替换
├── stores/                   # Zustand状态管理
│   ├── editorStore.ts        # 编辑器状态
│   ├── fileStore.ts          # 文件管理状态
│   ├── uiStore.ts            # UI状态
│   └── settingsStore.ts      # 偏好设置状态
├── prosemirror/              # ProseMirror配置与插件
│   ├── schema.ts             # 文档Schema定义
│   ├── plugins/              # 自定义插件
│   │   ├── math.ts           # 公式插件
│   │   ├── mermaid.ts        # 图表插件
│   │   ├── codeblock.ts      # 代码块插件
│   │   ├── table.ts          # 表格插件
│   │   ├── image.ts          # 图片插件
│   │   ├── tasklist.ts       # 任务列表插件
│   │   └── spellcheck.ts     # 拼写检查插件
│   ├── serializers/          # 序列化器
│   │   ├── markdown.ts       # Markdown双向序列化
│   │   └── html.ts           # HTML序列化
│   └── keymaps/              # 快捷键映射
│       ├── default.ts        # 默认快捷键
│       └── custom.ts         # 自定义快捷键
├── services/                 # 业务服务
│   ├── fileService.ts        # 文件读写服务
│   ├── exportService.ts      # 导出服务
│   ├── themeService.ts       # 主题服务
│   ├── searchService.ts      # 搜索服务
│   └── backupService.ts      # 备份恢复服务
├── themes/                   # 主题样式
│   ├── default-light.css     # 默认浅色
│   ├── default-dark.css      # 默认深色
│   ├── graphite.css          # 石墨灰
│   ├── eyecare.css           # 护眼柔和
│   └── minimal.css           # 极简纯白
├── utils/                    # 工具函数
│   ├── markdown.ts           # Markdown解析工具
│   ├── statistics.ts         # 字数统计
│   ├── encoding.ts           # 编码处理
│   └── platform.ts           # 平台检测
├── pages/                    # 页面组件
│   └── EditorPage.tsx        # 主编辑器页面
├── App.tsx                   # 应用根组件
└── main.tsx                  # 入口文件
```

## 6. 关键技术决策

### 6.1 编辑器引擎选择：ProseMirror

**选择理由**:
- ProseMirror 是 Typora 底层使用的同源编辑引擎，可最大程度复刻其编辑行为
- 提供完整的文档模型、事务系统、插件架构
- 支持自定义 Schema，可精确控制 Markdown 语法节点的渲染行为
- prosemirror-markdown 提供双向转换能力
- 丰富的社区插件生态（表格、数学公式、代码块等）

### 6.2 公式渲染选择：KaTeX

**选择理由**:
- 渲染速度比 MathJax 快 10 倍以上，满足实时预览需求
- 支持 AMS 数学宏包子集
- 纯 CSS 渲染，无字体依赖问题
- 可通过 SSR 预渲染保证导出质量

### 6.3 代码高亮选择：Shiki

**选择理由**:
- 使用 VSCode 同源 TextMate 语法引擎
- 原生支持 100+ 编程语言
- 可加载任意 VSCode 主题，与编辑器主题系统无缝集成
- 输出 HTML+CSS，无需运行时 JS

### 6.4 文件系统选择：File System Access API

**选择理由**:
- 浏览器原生 API，无需服务端
- 支持目录遍历、文件读写、文件监听
- 降级方案：IndexedDB 存储文档 + 拖拽上传文件

## 7. 性能优化策略

| 优化方向 | 策略 |
|----------|------|
| 大文档渲染 | 虚拟滚动 + ProseMirror 增量更新 |
| 代码高亮 | Web Worker 异步高亮 + 缓存 |
| 公式渲染 | KaTeX 预编译 + 增量渲染 |
| 图表渲染 | Mermaid 懒加载 + 缓存 SVG |
| 文件树 | 虚拟化长列表 + 懒加载子目录 |
| 搜索 | Web Worker 异步搜索 + 增量匹配 |
| 自动保存 | 防抖写入 + IndexedDB 批量操作 |
| 主题切换 | CSS Variables 热替换 + 无重渲染 |

## 8. 数据模型

### 8.1 文档数据模型

```typescript
interface Document {
  id: string
  title: string
  content: string
  filePath?: string
  fileHandle?: FileSystemFileHandle
  encoding: string
  lineEnding: 'lf' | 'crlf'
  isModified: boolean
  lastSavedAt: number
  cursorPosition: { line: number; column: number }
  scrollPosition: number
  editMode: 'wysiwyg' | 'source'
}

interface EditorSession {
  documents: Document[]
  activeDocumentId: string
  windowBounds: { x: number; y: number; width: number; height: number }
  sidebarWidth: number
  sidebarVisible: boolean
  sidebarTab: 'files' | 'outline'
  theme: string
}

interface Settings {
  general: GeneralSettings
  editor: EditorSettings
  save: SaveSettings
  image: ImageSettings
  chart: ChartSettings
  math: MathSettings
  keymap: KeymapSettings
  appearance: AppearanceSettings
  language: LanguageSettings
  privacy: PrivacySettings
  update: UpdateSettings
}
```

### 8.2 本地存储策略

| 存储方式 | 用途 | 容量 |
|----------|------|------|
| LocalStorage | 偏好设置、主题配置、快捷键映射 | ~5MB |
| IndexedDB | 文档缓存、自动备份快照、会话状态 | 无限制 |
| File System Access API | 实际文件读写 | 磁盘空间 |
