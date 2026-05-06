import { codeToHtml } from 'shiki';
import { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeView, EditorView } from 'prosemirror-view';
import useSettingsStore from '../../stores/settingsStore';

const codeBlockPluginKey = new PluginKey('codeBlockPlugin');

class CodeBlockView implements NodeView {
  dom: HTMLElement;
  contentDOM?: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;
  private headerEl: HTMLElement;
  private codeContainer: HTMLElement;
  private codeContent: HTMLElement;
  private lineNumbersEl: HTMLElement;
  private copyBtn: HTMLButtonElement;
  private langLabel: HTMLElement;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.dom = document.createElement('div');
    this.dom.className = 'code-block-container';
    this.dom.style.cssText = 'position: relative; margin: 1em 0; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-color, #e0e0e0); background: var(--bg-secondary, #1e1e2e);';

    this.headerEl = document.createElement('div');
    this.headerEl.className = 'code-block-header';
    this.headerEl.style.cssText = 'display: flex; justify-content: flex-end; align-items: center; padding: 0.3em 0.6em; background: var(--bg-tertiary, #2a2a3e); font-size: 0.75em; gap: 0.5em;';

    this.langLabel = document.createElement('span');
    this.langLabel.className = 'code-block-lang';
    this.langLabel.style.cssText = 'color: var(--text-secondary, #999); text-transform: uppercase; letter-spacing: 0.05em;';
    this.headerEl.appendChild(this.langLabel);

    this.copyBtn = document.createElement('button');
    this.copyBtn.className = 'code-block-copy';
    this.copyBtn.textContent = 'Copy';
    this.copyBtn.style.cssText = 'background: transparent; border: 1px solid var(--border-color, #555); color: var(--text-secondary, #999); border-radius: 3px; padding: 0.15em 0.5em; cursor: pointer; font-size: 0.9em;';
    this.headerEl.appendChild(this.copyBtn);

    this.dom.appendChild(this.headerEl);

    this.codeContainer = document.createElement('div');
    this.codeContainer.className = 'code-block-body';
    this.codeContainer.style.cssText = 'display: flex; overflow-x: auto;';

    this.lineNumbersEl = document.createElement('div');
    this.lineNumbersEl.className = 'code-block-line-numbers';
    this.lineNumbersEl.style.cssText = 'padding: 0.8em 0; text-align: right; user-select: none; color: var(--text-tertiary, #666); font-family: monospace; font-size: 0.85em; line-height: 1.5; min-width: 2.5em; padding-right: 0.8em; border-right: 1px solid var(--border-color, #333);';
    this.codeContainer.appendChild(this.lineNumbersEl);

    this.codeContent = document.createElement('div');
    this.codeContent.className = 'code-block-content';
    this.codeContent.style.cssText = 'flex: 1; padding: 0.8em; font-family: monospace; font-size: 0.9em; line-height: 1.5; white-space: pre; overflow-x: auto; color: var(--text-primary, #ccc);';
    this.codeContainer.appendChild(this.codeContent);

    this.dom.appendChild(this.codeContainer);

    this.updateLanguage();
    this.renderCode();
    this.updateLineNumbers();
    this.setupEvents();
  }

  private async renderCode() {
    const text = this.node.textContent;
    const lang = this.node.attrs.language || '';

    if (lang && text) {
      try {
        const html = await codeToHtml(text, {
          lang,
          theme: 'github-dark',
        });
        this.codeContent.innerHTML = html;
        const preEl = this.codeContent.querySelector('pre');
        if (preEl) {
          preEl.style.margin = '0';
          preEl.style.background = 'transparent';
          preEl.style.padding = '0';
        }
        return;
      } catch {
        this.fallbackRender(text);
      }
    } else {
      this.fallbackRender(text);
    }
  }

  private fallbackRender(text: string) {
    this.codeContent.textContent = text;
  }

  private updateLanguage() {
    const lang = this.node.attrs.language || 'plain';
    this.langLabel.textContent = lang;
  }

  private updateLineNumbers() {
    const showLines = useSettingsStore.getState().showLineNumber;
    this.lineNumbersEl.style.display = showLines ? '' : 'none';

    if (showLines) {
      const lines = this.node.textContent.split('\n');
      this.lineNumbersEl.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    }
  }

  private setupEvents() {
    this.copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = this.node.textContent;
      navigator.clipboard.writeText(text).then(() => {
        this.copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          this.copyBtn.textContent = 'Copy';
        }, 2000);
      });
    });
  }

  update(node: Node) {
    if (node.type.name !== 'code_block') return false;
    this.node = node;
    this.updateLanguage();
    this.renderCode();
    this.updateLineNumbers();
    return true;
  }

  destroy() {
    this.dom.remove();
  }
}

export function codeBlockPlugin(): Plugin {
  return new Plugin({
    key: codeBlockPluginKey,
    props: {
      nodeViews: {
        code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos),
      },
    },
  });
}
