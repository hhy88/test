import { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeView, EditorView } from 'prosemirror-view';

const imagePluginKey = new PluginKey('imagePlugin');

class ImageView implements NodeView {
  dom: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;
  private imgEl: HTMLImageElement;
  private captionEl: HTMLElement;
  private loadingEl: HTMLElement;
  private errorEl: HTMLElement;
  private contextMenuEl: HTMLElement;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.dom = document.createElement('div');
    this.dom.className = 'image-container';
    this.dom.style.cssText = 'display: inline-block; max-width: 100%; text-align: center; position: relative; margin: 0.5em 0;';

    this.loadingEl = document.createElement('div');
    this.loadingEl.className = 'image-loading';
    this.loadingEl.style.cssText = 'padding: 2em; color: var(--text-secondary, #999); font-size: 0.9em;';
    this.loadingEl.textContent = 'Loading...';
    this.dom.appendChild(this.loadingEl);

    this.errorEl = document.createElement('div');
    this.errorEl.className = 'image-error';
    this.errorEl.style.cssText = 'padding: 2em; color: #e74c3c; font-size: 0.9em; display: none; align-items: center; gap: 0.5em;';
    this.errorEl.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg> Broken image';
    this.dom.appendChild(this.errorEl);

    this.imgEl = document.createElement('img');
    this.imgEl.className = 'image-render';
    this.imgEl.style.cssText = 'max-width: 100%; height: auto; display: none; cursor: pointer; border-radius: 4px;';
    this.imgEl.alt = node.attrs.alt || '';
    this.imgEl.src = node.attrs.src || '';
    this.dom.appendChild(this.imgEl);

    this.captionEl = document.createElement('div');
    this.captionEl.className = 'image-caption';
    this.captionEl.style.cssText = 'font-size: 0.85em; color: var(--text-secondary, #999); margin-top: 0.3em; font-style: italic;';
    this.dom.appendChild(this.captionEl);

    this.contextMenuEl = document.createElement('div');
    this.contextMenuEl.className = 'image-context-menu';
    this.contextMenuEl.style.cssText = 'position: fixed; background: var(--bg-primary, #fff); border: 1px solid var(--border-color, #ccc); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); padding: 0.3em 0; display: none; z-index: 1000; min-width: 160px;';

    const saveItem = document.createElement('div');
    saveItem.textContent = '另存图片';
    saveItem.style.cssText = 'padding: 0.4em 1em; cursor: pointer; font-size: 0.85em; color: var(--text-primary, #333);';
    saveItem.addEventListener('click', () => this.saveImage());
    saveItem.addEventListener('mouseenter', () => { saveItem.style.background = 'var(--bg-secondary, #f0f0f0)'; });
    saveItem.addEventListener('mouseleave', () => { saveItem.style.background = ''; });

    const copyUrlItem = document.createElement('div');
    copyUrlItem.textContent = '复制图片地址';
    copyUrlItem.style.cssText = 'padding: 0.4em 1em; cursor: pointer; font-size: 0.85em; color: var(--text-primary, #333);';
    copyUrlItem.addEventListener('click', () => this.copyUrl());
    copyUrlItem.addEventListener('mouseenter', () => { copyUrlItem.style.background = 'var(--bg-secondary, #f0f0f0)'; });
    copyUrlItem.addEventListener('mouseleave', () => { copyUrlItem.style.background = ''; });

    this.contextMenuEl.appendChild(saveItem);
    this.contextMenuEl.appendChild(copyUrlItem);
    document.body.appendChild(this.contextMenuEl);

    this.updateCaption();
    this.setupEvents();
  }

  private updateCaption() {
    this.captionEl.textContent = this.node.attrs.alt || '';
    this.captionEl.style.display = this.node.attrs.alt ? '' : 'none';
  }

  private setupEvents() {
    this.imgEl.addEventListener('load', () => {
      this.loadingEl.style.display = 'none';
      this.errorEl.style.display = 'none';
      this.imgEl.style.display = '';
    });

    this.imgEl.addEventListener('error', () => {
      this.loadingEl.style.display = 'none';
      this.imgEl.style.display = 'none';
      this.errorEl.style.display = 'flex';
    });

    this.imgEl.addEventListener('click', () => {
      this.viewFullscreen();
    });

    this.dom.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showContextMenu(e);
    });

    document.addEventListener('click', () => {
      this.contextMenuEl.style.display = 'none';
    });
  }

  private viewFullscreen() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: zoom-out;';
    const fullImg = document.createElement('img');
    fullImg.src = this.node.attrs.src;
    fullImg.style.cssText = 'max-width: 95vw; max-height: 95vh; object-fit: contain;';
    overlay.appendChild(fullImg);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  }

  private showContextMenu(e: MouseEvent) {
    this.contextMenuEl.style.display = 'block';
    this.contextMenuEl.style.left = `${e.clientX}px`;
    this.contextMenuEl.style.top = `${e.clientY}px`;
  }

  private saveImage() {
    const a = document.createElement('a');
    a.href = this.node.attrs.src;
    a.download = this.node.attrs.alt || 'image';
    a.click();
    this.contextMenuEl.style.display = 'none';
  }

  private copyUrl() {
    navigator.clipboard.writeText(this.node.attrs.src || '');
    this.contextMenuEl.style.display = 'none';
  }

  update(node: Node) {
    if (node.type.name !== 'image') return false;
    this.node = node;
    this.imgEl.src = node.attrs.src || '';
    this.imgEl.alt = node.attrs.alt || '';
    this.updateCaption();
    return true;
  }

  destroy() {
    this.contextMenuEl.remove();
    this.dom.remove();
  }
}

export function imagePlugin(): Plugin {
  return new Plugin({
    key: imagePluginKey,
    props: {
      nodeViews: {
        image: (node, view, getPos) => new ImageView(node, view, getPos),
      },
    },
  });
}
