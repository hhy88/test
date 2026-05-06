import { MarkdownSerializer, MarkdownParser } from 'prosemirror-markdown';
import MarkdownIt from 'markdown-it';
import { markEditSchema as schema } from '../schema';

export const markdownSerializer = new MarkdownSerializer(
  {
    paragraph(state, node) {
      state.renderInline(node);
      state.closeBlock(node);
    },
    heading(state, node) {
      state.write(state.repeat('#', node.attrs.level) + ' ');
      state.renderInline(node);
      state.closeBlock(node);
    },
    code_block(state, node) {
      const lang = node.attrs.language || '';
      state.write('```' + lang + '\n');
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.write('```');
      state.closeBlock(node);
    },
    image(state, node) {
      state.write(
        '![' +
          state.esc(node.attrs.alt || '') +
          '](' +
          state.esc(node.attrs.src || '') +
          (node.attrs.title ? ' "' + node.attrs.title + '"' : '') +
          ')'
      );
    },
    hard_break(state) {
      state.write('  \n');
    },
    horizontal_rule(state, node) {
      state.write('---');
      state.closeBlock(node);
    },
    blockquote(state, node) {
      state.wrapBlock('> ', null, node, () => state.renderContent(node));
    },
    ordered_list(state, node) {
      const start = node.attrs.order || 1;
      const tight = node.attrs.tight;
      state.renderList(node, state.repeat(' ', String(start).length + 2), (i) =>
        String(start + i) + '. '
      );
    },
    bullet_list(state, node) {
      state.renderList(node, '  ', () => '- ');
    },
    list_item(state, node) {
      state.renderContent(node);
    },
    table(state, node) {
      const rows: string[][] = [];
      node.forEach((row) => {
        const cells: string[] = [];
        row.forEach((cell) => {
          cells.push(cell.textContent);
        });
        rows.push(cells);
      });
      if (rows.length === 0) return;
      const colCount = rows[0].length;
      const colWidths: number[] = [];
      for (let i = 0; i < colCount; i++) {
        colWidths.push(
          Math.max(3, ...rows.map((r) => (r[i] || '').length))
        );
      }
      const padCell = (text: string, width: number) => {
        const padded = text + ' '.repeat(width - text.length);
        return padded;
      };
      rows.forEach((row, rowIdx) => {
        const line = '| ' + row.map((cell, i) => padCell(cell, colWidths[i])).join(' | ') + ' |';
        state.write(line);
        state.ensureNewLine();
        if (rowIdx === 0) {
          const sep = '| ' + colWidths.map((w) => '-'.repeat(w)).join(' | ') + ' |';
          state.write(sep);
          state.ensureNewLine();
        }
      });
      state.closeBlock(node);
    },
    table_row() {},
    table_cell() {},
    table_header() {},
    task_list_item(state, node) {
      const checked = node.attrs.checked;
      state.write(checked ? '[x] ' : '[ ] ');
      state.renderContent(node);
    },
    math_inline(state, node) {
      state.write('$' + node.attrs.math + '$');
    },
    math_block(state, node) {
      state.write('$$\n');
      state.text(node.attrs.math || node.textContent, false);
      state.ensureNewLine();
      state.write('$$');
      state.closeBlock(node);
    },
    footnote(state, node) {
      state.write('[^' + node.attrs.label + ']');
    },
    mermaid_block(state, node) {
      state.write('```mermaid\n');
      state.text(node.attrs.code || node.textContent, false);
      state.ensureNewLine();
      state.write('```');
      state.closeBlock(node);
    },
    text(state, node) {
      state.text(node.text || '');
    },
  },
  {
    bold: { open: '**', close: '**', mixable: true, expelEnclosingWhitespace: true },
    italic: { open: '*', close: '*', mixable: true, expelEnclosingWhitespace: true },
    link: {
      open(state, mark) {
        return '[';
      },
      close(state, mark) {
        return '](' + state.esc(mark.attrs.href) + (mark.attrs.title ? ' "' + mark.attrs.title + '"' : '') + ')';
      },
      mixable: true,
    },
    strikethrough: { open: '~~', close: '~~', mixable: true, expelEnclosingWhitespace: true },
    code: { open: '`', close: '`', escape: false },
    highlight: { open: '==', close: '==', mixable: true, expelEnclosingWhitespace: true },
    subscript: { open: '~', close: '~', mixable: true },
    superscript: { open: '^', close: '^', mixable: true },
    underline: { open: '<u>', close: '</u>', mixable: true },
  }
);

const md = MarkdownIt('commonmark', {
  html: false,
  breaks: true,
  linkify: true,
  typographer: true,
});

md.enable('strikethrough');

export const markdownParser = new MarkdownParser(
  schema,
  md,
  {
    paragraph: { block: 'paragraph' },
    heading: {
      block: 'heading',
      getAttrs(tok) {
        return { level: Number(tok.tag.slice(1)) };
      },
    },
    code_block: {
      block: 'code_block',
      getAttrs(tok) {
        if (tok.info) {
          return { language: tok.info.trim() };
        }
        return { language: '' };
      },
    },
    fence: {
      block: 'code_block',
      getAttrs(tok) {
        if (tok.info === 'mermaid') {
          return { language: 'mermaid' };
        }
        if (tok.info) {
          return { language: tok.info.trim() };
        }
        return { language: '' };
      },
    },
    image: {
      node: 'image',
      getAttrs(tok) {
        return {
          src: tok.attrGet('src'),
          alt: tok.attrGet('alt') || tok.content || null,
          title: tok.attrGet('title') || null,
        };
      },
    },
    hardbreak: { node: 'hard_break' },
    hr: { node: 'horizontal_rule' },
    blockquote: { block: 'blockquote' },
    ordered_list: {
      block: 'ordered_list',
      getAttrs(tok) {
        return {
          order: Number(tok.attrGet('start')) || 1,
          tight: tok.attrGet('tight') === 'true',
        };
      },
    },
    bullet_list: {
      block: 'bullet_list',
      getAttrs(tok) {
        return { tight: tok.attrGet('tight') === 'true' };
      },
    },
    list_item: { block: 'list_item' },
    table: { block: 'table' },
    tbody: { ignore: true },
    thead: { ignore: true },
    tr: { block: 'table_row' },
    th: {
      block: 'table_header',
      getAttrs(tok) {
        const align = tok.attrGet('style');
        if (align) {
          const match = align.match(/text-align:\s*(\w+)/);
          return { alignment: match ? match[1] : null };
        }
        return { alignment: null };
      },
    },
    td: {
      block: 'table_cell',
      getAttrs(tok) {
        const align = tok.attrGet('style');
        if (align) {
          const match = align.match(/text-align:\s*(\w+)/);
          return { alignment: match ? match[1] : null };
        }
        return { alignment: null };
      },
    },
    em: { mark: 'italic' },
    strong: { mark: 'bold' },
    link: {
      mark: 'link',
      getAttrs(tok) {
        return {
          href: tok.attrGet('href'),
          title: tok.attrGet('title') || null,
        };
      },
    },
    s: { mark: 'strikethrough' },
    code_inline: { mark: 'code' },
  }
);

export function serializeToMarkdown(doc: import('prosemirror-model').Node): string {
  return markdownSerializer.serialize(doc);
}

export function parseMarkdown(content: string): import('prosemirror-model').Node {
  return markdownParser.parse(content);
}
