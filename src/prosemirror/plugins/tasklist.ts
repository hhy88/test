import { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { NodeView, EditorView } from 'prosemirror-view';

const taskListPluginKey = new PluginKey('taskListPlugin');

class TaskListItemView implements NodeView {
  dom: HTMLElement;
  contentDOM?: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;
  private checkbox: HTMLInputElement;
  private contentEl: HTMLElement;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.dom = document.createElement('li');
    this.dom.className = 'task-list-item';
    this.dom.setAttribute('data-type', 'taskItem');
    this.dom.setAttribute('data-checked', String(node.attrs.checked));
    this.dom.style.cssText = 'display: flex; align-items: flex-start; gap: 0.5em; list-style: none; margin-left: -1.5em;';

    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this.checkbox.className = 'task-list-checkbox';
    this.checkbox.checked = node.attrs.checked;
    this.checkbox.style.cssText = 'margin-top: 0.35em; cursor: pointer; flex-shrink: 0; width: 1em; height: 1em; accent-color: var(--accent-color, #4a90d9);';
    this.dom.appendChild(this.checkbox);

    this.contentEl = document.createElement('div');
    this.contentEl.className = 'task-list-item-content';
    this.contentEl.style.cssText = 'flex: 1;';
    this.dom.appendChild(this.contentEl);

    this.applyCheckedStyle();
    this.setupEvents();
  }

  private applyCheckedStyle() {
    if (this.node.attrs.checked) {
      this.contentEl.style.textDecoration = 'line-through';
      this.contentEl.style.color = 'var(--text-secondary, #999)';
    } else {
      this.contentEl.style.textDecoration = '';
      this.contentEl.style.color = '';
    }
  }

  private setupEvents() {
    this.checkbox.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleChecked();
    });
  }

  private toggleChecked() {
    const pos = this.getPos();
    if (pos === undefined) return;
    const checked = !this.node.attrs.checked;
    const tr = this.view.state.tr.setNodeMarkup(pos, undefined, { checked });
    this.view.dispatch(tr);
  }

  update(node: Node) {
    if (node.type.name !== 'task_list_item') return false;
    this.node = node;
    this.checkbox.checked = node.attrs.checked;
    this.dom.setAttribute('data-checked', String(node.attrs.checked));
    this.applyCheckedStyle();
    return true;
  }

  destroy() {
    this.dom.remove();
  }
}

export function taskListPlugin(): Plugin {
  return new Plugin({
    key: taskListPluginKey,
    props: {
      nodeViews: {
        task_list_item: (node, view, getPos) => new TaskListItemView(node, view, getPos),
      },
    },
  });
}
