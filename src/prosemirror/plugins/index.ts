import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { keymapPlugin } from '../keymaps/default';

const placeholderKey = new PluginKey('placeholder');

const placeholderPlugin = new Plugin({
  key: placeholderKey,
  props: {
    decorations(state) {
      const { doc } = state;
      if (
        doc.childCount === 1 &&
        doc.firstChild &&
        doc.firstChild.type.name === 'paragraph' &&
        doc.firstChild.content.size === 0
      ) {
        const placeholder = document.createElement('span');
        placeholder.className = 'ProseMirror-placeholder';
        placeholder.textContent = '开始输入...';
        return DecorationSet.create(doc, [Decoration.widget(1, placeholder)]);
      }
      return DecorationSet.empty;
    },
  },
});

const historyPlugin = history();

const gapcursorPlugin = gapCursor();

const dropcursorPlugin = dropCursor();

export const plugins = [
  keymapPlugin,
  historyPlugin,
  placeholderPlugin,
  gapcursorPlugin,
  dropcursorPlugin,
];

export { keymapPlugin, historyPlugin, placeholderPlugin, gapcursorPlugin, dropcursorPlugin };
