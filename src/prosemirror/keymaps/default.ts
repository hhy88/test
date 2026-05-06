import { keymap } from 'prosemirror-keymap';
import {
  baseKeymap,
  toggleMark,
  setBlockType,
  wrapIn,
  chainCommands,
  exitCode,
  joinUp,
  joinDown,
  lift,
  selectParentNode,
} from 'prosemirror-commands';
import {
  wrapInList,
  splitListItem,
  liftListItem,
  sinkListItem,
} from 'prosemirror-schema-list';
import { undo, redo, undoNoScroll, redoNoScroll } from 'prosemirror-history';
import { markEditSchema } from '../schema';

const schema = markEditSchema;

export const keymapPlugin = keymap({
  'Mod-z': undo,
  'Mod-y': redo,
  'Mod-Shift-z': redo,
  'Mod-b': toggleMark(schema.marks.bold),
  'Mod-i': toggleMark(schema.marks.italic),
  'Mod-u': toggleMark(schema.marks.underline),
  'Mod-Shift-s': toggleMark(schema.marks.strikethrough),
  'Mod-Shift-h': toggleMark(schema.marks.highlight),
  'Mod-Alt-Subtract': toggleMark(schema.marks.subscript),
  'Mod-Alt-Add': toggleMark(schema.marks.superscript),
  'Mod-`': toggleMark(schema.marks.code),
  'Mod-Shift-`': setBlockType(schema.nodes.code_block),
  'Mod-Alt-0': setBlockType(schema.nodes.paragraph),
  'Mod-Alt-1': setBlockType(schema.nodes.heading, { level: 1 }),
  'Mod-Alt-2': setBlockType(schema.nodes.heading, { level: 2 }),
  'Mod-Alt-3': setBlockType(schema.nodes.heading, { level: 3 }),
  'Mod-Alt-4': setBlockType(schema.nodes.heading, { level: 4 }),
  'Mod-Alt-5': setBlockType(schema.nodes.heading, { level: 5 }),
  'Mod-Alt-6': setBlockType(schema.nodes.heading, { level: 6 }),
  'Mod-Shift-8': wrapInList(schema.nodes.bullet_list),
  'Mod-Shift-9': wrapInList(schema.nodes.ordered_list),
  'Mod-Shift-b': wrapIn(schema.nodes.blockquote),
  'Mod-Shift-\\': setBlockType(schema.nodes.horizontal_rule),
  'Enter': splitListItem(schema.nodes.list_item),
  'Mod-[': liftListItem(schema.nodes.list_item),
  'Mod-]': sinkListItem(schema.nodes.list_item),
  'Shift-Ctrl-8': wrapInList(schema.nodes.bullet_list),
  'Shift-Ctrl-9': wrapInList(schema.nodes.ordered_list),
  'Shift-Ctrl-0': setBlockType(schema.nodes.paragraph),
  'Shift-Ctrl-1': setBlockType(schema.nodes.heading, { level: 1 }),
  'Shift-Ctrl-2': setBlockType(schema.nodes.heading, { level: 2 }),
  'Shift-Ctrl-3': setBlockType(schema.nodes.heading, { level: 3 }),
  'Shift-Ctrl-4': setBlockType(schema.nodes.heading, { level: 4 }),
  'Shift-Ctrl-5': setBlockType(schema.nodes.heading, { level: 5 }),
  'Shift-Ctrl-6': setBlockType(schema.nodes.heading, { level: 6 }),
  'Shift-Enter': chainCommands(exitCode, (state, dispatch) => {
    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(schema.nodes.hard_break.create()).scrollIntoView());
    }
    return true;
  }),
  'Alt-ArrowUp': joinUp,
  'Alt-ArrowDown': joinDown,
  'Mod-Alt-l': lift,
  'Escape': selectParentNode,
});

export const baseKeymapPlugin = keymap(baseKeymap);
