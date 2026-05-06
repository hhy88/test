import { addColumnBefore, addColumnAfter, deleteColumn, addRowBefore, addRowAfter, deleteRow } from 'prosemirror-tables';
import { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeView, EditorView } from 'prosemirror-view';

const tablePluginKey = new PluginKey('tablePlugin');

class TableView implements NodeView {
  dom: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;
  private tableEl: HTMLTableElement;
  private controlsEl: HTMLElement;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.dom = document.createElement('div');
    this.dom.className = 'table-wrapper';
    this.dom.style.cssText = 'position: relative; overflow-x: auto; margin: 1em 0;';

    this.controlsEl = document.createElement('div');
    this.controlsEl.className = 'table-controls';
    this.controlsEl.style.cssText = 'position: absolute; display: none; z-index: 10;';
    this.dom.appendChild(this.controlsEl);

    this.tableEl = document.createElement('table');
    this.tableEl.style.cssText = 'border-collapse: collapse; width: auto; min-width: 100%;';
    this.dom.appendChild(this.tableEl);

    this.buildTable();
    this.setupEvents();
  }

  private buildTable() {
    this.tableEl.innerHTML = '';
    const tbody = document.createElement('tbody');

    for (let i = 0; i < this.node.childCount; i++) {
      const rowNode = this.node.child(i);
      const tr = document.createElement('tr');

      for (let j = 0; j < rowNode.childCount; j++) {
        const cellNode = rowNode.child(j);
        const isHeader = cellNode.type.name === 'table_header';
        const cell = document.createElement(isHeader ? 'th' : 'td');
        cell.style.cssText = `border: 1px solid var(--border-color, #ddd); padding: 0.4em 0.8em; min-width: 60px; vertical-align: top;${cellNode.attrs.alignment ? ` text-align: ${cellNode.attrs.alignment};` : ''}`;
        cell.setAttribute('data-type', isHeader ? 'header' : 'cell');
        cell.setAttribute('data-col', String(j));
        tr.appendChild(cell);
      }

      tbody.appendChild(tr);
    }

    this.tableEl.appendChild(tbody);
  }

  private setupEvents() {
    this.dom.addEventListener('mouseenter', () => {
      this.controlsEl.style.display = 'flex';
    });

    this.dom.addEventListener('mouseleave', () => {
      this.controlsEl.style.display = 'none';
    });

    this.tableEl.addEventListener('contextmenu', (e) => {
      const target = e.target as HTMLElement;
      const cell = target.closest('td, th');
      if (!cell) return;
      e.preventDefault();
      this.showCellControls(cell as HTMLElement, e);
    });
  }

  private showCellControls(cell: HTMLElement, e: MouseEvent) {
    this.controlsEl.innerHTML = '';
    this.controlsEl.style.display = 'flex';
    this.controlsEl.style.left = `${e.clientX - this.dom.getBoundingClientRect().left}px`;
    this.controlsEl.style.top = `${e.clientY - this.dom.getBoundingClientRect().top}px`;
    this.controlsEl.style.background = 'var(--bg-primary, #fff)';
    this.controlsEl.style.border = '1px solid var(--border-color, #ccc)';
    this.controlsEl.style.borderRadius = '4px';
    this.controlsEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    this.controlsEl.style.padding = '0.3em 0';
    this.controlsEl.style.flexDirection = 'column';
    this.controlsEl.style.gap = '0';

    const actions = [
      { label: 'Insert column before', action: () => addColumnBefore(this.view.state, this.view.dispatch) },
      { label: 'Insert column after', action: () => addColumnAfter(this.view.state, this.view.dispatch) },
      { label: 'Delete column', action: () => deleteColumn(this.view.state, this.view.dispatch) },
      { label: 'Insert row before', action: () => addRowBefore(this.view.state, this.view.dispatch) },
      { label: 'Insert row after', action: () => addRowAfter(this.view.state, this.view.dispatch) },
      { label: 'Delete row', action: () => deleteRow(this.view.state, this.view.dispatch) },
    ];

    for (const item of actions) {
      const el = document.createElement('div');
      el.textContent = item.label;
      el.style.cssText = 'padding: 0.4em 1em; cursor: pointer; font-size: 0.8em; white-space: nowrap; color: var(--text-primary, #333);';
      el.addEventListener('click', () => {
        item.action();
        this.controlsEl.style.display = 'none';
      });
      el.addEventListener('mouseenter', () => { el.style.background = 'var(--bg-secondary, #f0f0f0)'; });
      el.addEventListener('mouseleave', () => { el.style.background = ''; });
      this.controlsEl.appendChild(el);
    }
  }

  update(node: Node) {
    if (node.type.name !== 'table') return false;
    this.node = node;
    this.buildTable();
    return true;
  }

  destroy() {
    this.dom.remove();
  }
}

export function tablePlugin(): Plugin {
  return new Plugin({
    key: tablePluginKey,
    props: {
      nodeViews: {
        table: (node, view, getPos) => new TableView(node, view, getPos),
      },
      attributes: {
        class: 'ProseMirror-table-editing',
      },
    },
    state: {
      init() {
        return null;
      },
      apply(tr, value) {
        return value;
      },
    },
  });
}
