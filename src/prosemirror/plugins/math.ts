import katex from 'katex';
import { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeView, EditorView } from 'prosemirror-view';

const mathPluginKey = new PluginKey('mathPlugin');

function renderKatex(target: HTMLElement, latex: string, displayMode: boolean, emptyText: string) {
  target.innerHTML = '';
  if (!latex) {
    target.textContent = emptyText;
    target.style.color = 'var(--text-secondary, #999)';
    return;
  }
  try {
    katex.render(latex, target, { displayMode, throwOnError: true });
    target.style.color = '';
  } catch (e) {
    const err = document.createElement('span');
    err.style.color = 'red';
    if (!displayMode) err.style.fontSize = '0.85em';
    err.textContent = (e as Error).message;
    target.appendChild(err);
  }
}

class MathBlockView implements NodeView {
  dom: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;
  private editing = false;
  private renderEl: HTMLElement;
  private editEl: HTMLTextAreaElement;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');
    this.dom.className = 'math-block-container';
    this.dom.style.cssText = 'margin:1em 0;padding:0.5em;border-radius:4px;background:var(--bg-secondary,#f5f5f5);min-height:2em;cursor:pointer;';
    this.renderEl = document.createElement('div');
    this.renderEl.style.cssText = 'text-align:center;overflow-x:auto;';
    this.dom.appendChild(this.renderEl);
    this.editEl = document.createElement('textarea');
    this.editEl.style.cssText = 'width:100%;min-height:2em;font-family:monospace;font-size:0.9em;border:1px solid var(--border-color,#ccc);border-radius:4px;padding:0.5em;resize:vertical;box-sizing:border-box;display:none;background:var(--bg-primary,#fff);color:var(--text-primary,#333);';
    this.dom.appendChild(this.editEl);
    this.render();
    this.dom.addEventListener('dblclick', () => this.enterEdit());
    this.editEl.addEventListener('blur', () => this.exitEdit());
    this.editEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.editEl.blur(); });
  }

  private getLatex() { return this.node.attrs.math || this.node.textContent || ''; }

  private render() { renderKatex(this.renderEl, this.getLatex(), true, 'Empty math block'); }

  private enterEdit() {
    this.editing = true;
    this.editEl.value = this.getLatex();
    this.renderEl.style.display = 'none';
    this.editEl.style.display = 'block';
    this.editEl.focus();
  }

  private exitEdit() {
    this.editing = false;
    const val = this.editEl.value;
    const pos = this.getPos();
    if (pos !== undefined && val !== this.getLatex()) {
      this.view.dispatch(this.view.state.tr.setNodeMarkup(pos, undefined, { math: val }));
    }
    this.editEl.style.display = 'none';
    this.renderEl.style.display = '';
  }

  update(node: Node) {
    if (node.type.name !== 'math_block') return false;
    this.node = node;
    if (!this.editing) this.render();
    return true;
  }

  destroy() { this.dom.remove(); }
}

class MathInlineView implements NodeView {
  dom: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;
  private editing = false;
  private renderEl: HTMLSpanElement;
  private editEl: HTMLInputElement;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('span');
    this.dom.className = 'math-inline-container';
    this.dom.style.cssText = 'cursor:pointer;display:inline;';
    this.renderEl = document.createElement('span');
    this.dom.appendChild(this.renderEl);
    this.editEl = document.createElement('input');
    this.editEl.type = 'text';
    this.editEl.style.cssText = 'font-family:monospace;font-size:0.9em;border:1px solid var(--border-color,#ccc);border-radius:3px;padding:0 0.3em;display:none;background:var(--bg-primary,#fff);color:var(--text-primary,#333);';
    this.dom.appendChild(this.editEl);
    this.render();
    this.dom.addEventListener('dblclick', () => this.enterEdit());
    this.editEl.addEventListener('blur', () => this.exitEdit());
    this.editEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.editEl.blur(); });
  }

  private getLatex() { return this.node.attrs.math || this.node.textContent || ''; }

  private render() { renderKatex(this.renderEl, this.getLatex(), false, '∅'); }

  private enterEdit() {
    this.editing = true;
    this.editEl.value = this.getLatex();
    this.renderEl.style.display = 'none';
    this.editEl.style.display = 'inline';
    this.editEl.focus();
  }

  private exitEdit() {
    this.editing = false;
    const val = this.editEl.value;
    const pos = this.getPos();
    if (pos !== undefined && val !== this.getLatex()) {
      this.view.dispatch(this.view.state.tr.setNodeMarkup(pos, undefined, { math: val }));
    }
    this.editEl.style.display = 'none';
    this.renderEl.style.display = '';
  }

  update(node: Node) {
    if (node.type.name !== 'math_inline') return false;
    this.node = node;
    if (!this.editing) this.render();
    return true;
  }

  destroy() { this.dom.remove(); }
}

export function mathPlugin(): Plugin {
  return new Plugin({
    key: mathPluginKey,
    props: {
      nodeViews: {
        math_block: (node, view, getPos) => new MathBlockView(node, view, getPos),
        math_inline: (node, view, getPos) => new MathInlineView(node, view, getPos),
      },
    },
  });
}
