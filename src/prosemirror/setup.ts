import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { markEditSchema } from './schema';
import { plugins } from './plugins/index';
import { parseMarkdown, serializeToMarkdown } from './serializers/markdown';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';

export function createEditorState(content: string = ''): EditorState {
  const doc = content ? parseMarkdown(content) : markEditSchema.nodes.paragraph.create();

  const allPlugins = [
    ...plugins,
    keymap(baseKeymap),
  ];

  return EditorState.create({
    doc,
    schema: markEditSchema,
    plugins: allPlugins,
  });
}

export function createEditorView(
  place: HTMLElement | ((mount: HTMLElement) => void),
  content: string = '',
  onUpdate?: (markdown: string) => void
): EditorView {
  const state = createEditorState(content);

  return new EditorView(place, {
    state,
    dispatchTransaction(transaction) {
      const newState = this.state.apply(transaction);
      this.updateState(newState);
      if (onUpdate && transaction.docChanged) {
        onUpdate(serializeToMarkdown(newState.doc));
      }
    },
  });
}

export { markEditSchema, parseMarkdown, serializeToMarkdown };
