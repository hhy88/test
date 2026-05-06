import mermaid from 'mermaid';
import { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeView, EditorView } from 'prosemirror-view';

const mermaidPluginKey = new PluginKey('mermaidPlugin');

let mermaidInitialized = false;

function initMermaid() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
  });
  mermaidInitialized = true;
}

class MermaidBlockView implements NodeView {
  dom: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;
  private editing: boolean = false;
  private renderContainer: HTMLElement;
  private editArea: HTMLTextAreaElement;
  private errorContainer: HTMLElement;
  private renderId: number = 0;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    initMermaid();

    this.dom = document.createElement('div');
    this.dom.className = 'mermaid-block-container';
    this.dom.style.cssText = 'margin: 1em 0; padding: 1em; border-radius: 4px; background: var(--bg-secondary, #f5f5f5); min-height: 3em; cursor: pointer; position: relative;';

    this.renderContainer = document.createElement('div');
    this.renderContainer.className = 'mermaid-block-render';
    this.renderContainer.style.cssText = 'text-align: center; overflow-x: auto;';
    this.dom.appendChild(this.renderContainer);

    this.errorContainer = document.createElement('div');
    this.errorContainer.className = 'mermaid-block-error';
    this.errorContainer.style.cssText = 'color: red; font-size: 0.85em; margin-top: 0.5em; display: none;';
    this.dom.appendChild(this.errorContainer);

    this.editArea = document.createElement('textarea');
    this.editArea.className = 'mermaid-block-edit';
    this.editArea.style.cssText = 'width: 100%; min-height: 6em; font-family: monospace; font-size: 0.9em; border: 1px solid var(--border-color, #ccc); border-radius: 4px; padding: 0.5em; resize: vertical; box-sizing: border-box; display: none; background: var(--bg-primary, #fff); color: var(--text-primary, #333);';
    this.dom.appendChild(this.editArea);

    this.renderDiagram();
    this.setupEvents();
  }

  private async renderDiagram() {
    const code = this.node.attrs.code || this.node.textContent || '';
    this.renderContainer.innerHTML = '';
    this.errorContainer.style.display = 'none';

    if (!code) {
      this.renderContainer.textContent = 'Empty mermaid diagram';
      this.renderContainer.style.color = 'var(--text-secondary, #999)';
      return;
    }

    this.renderContainer.style.color = '';
    const currentId = ++this.renderId;
    const id = `mermaid-${currentId}-${Date.now()}`;

    try {
      const { svg } = await mermaid.render(id, code);
      if (currentId !== this.renderId) return;
      this.renderContainer.innerHTML = svg;
      const svgEl = this.renderContainer.querySelector('svg');
      if (svgEl) {
        svgEl.style.maxWidth = '100%';
        svgEl.style.height = 'auto';
      }
    } catch (e) {
      if (currentId !== this.renderId) return;
      this.errorContainer.textContent = (e as Error).message || 'Failed to render mermaid diagram';
      this.errorContainer.style.display = 'block';
      this.renderContainer.textContent = 'Diagram render failed';
      this.renderContainer.style.color = 'var(--text-secondary, #999)';
    }
  }

  private setupEvents() {
    this.dom.addEventListener('dblclick', () => {
      this.enterEditMode();
    });

    this.editArea.addEventListener('blur', () => {
      this.exitEditMode();
    });

    this.editArea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.editArea.blur();
      }
    });
  }

  private enterEditMode() {
    this.editing = true;
    const code = this.node.attrs.code || this.node.textContent || '';
    this.editArea.value = code;
    this.renderContainer.style.display = 'none';
    this.errorContainer.style.display = 'none';
    this.editArea.style.display = 'block';
    this.editArea.focus();
  }

  private exitEditMode() {
    this.editing = false;
    const newCode = this.editArea.value;
    const pos = this.getPos();
    if (pos !== undefined && newCode !== (this.node.attrs.code || this.node.textContent)) {
      const tr = this.view.state.tr.setNodeMarkup(pos, undefined, { code: newCode });
      this.view.dispatch(tr);
    }
    this.editArea.style.display = 'none';
    this.renderContainer.style.display = '';
    this.renderDiagram();
  }

  update(node: Node) {
    if (node.type.name !== 'mermaid_block') return false;
    this.node = node;
    if (!this.editing) {
      this.renderDiagram();
    }
    return true;
  }

  destroy() {
    this.renderId++;
    this.dom.remove();
  }
}

export function mermaidPlugin(): Plugin {
  return new Plugin({
    key: mermaidPluginKey,
    props: {
      nodeViews: {
        mermaid_block: (node, view, getPos) => new MermaidBlockView(node, view, getPos),
      },
    },
  });
}
