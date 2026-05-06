import { Schema } from 'prosemirror-model';

export const markEditSchema = new Schema({
  nodes: {
    doc: {
      content: 'block+',
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0];
      },
    },
    heading: {
      attrs: { level: { default: 1, validate: 'number' } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [1, 2, 3, 4, 5, 6].map((level) => ({
        tag: `h${level}`,
        attrs: { level },
      })),
      toDOM(node) {
        return [`h${node.attrs.level}`, 0];
      },
    },
    code_block: {
      attrs: { language: { default: '' } },
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      parseDOM: [
        {
          tag: 'pre',
          preserveWhitespace: 'full' as const,
          getAttrs(dom: HTMLElement) {
            const codeEl = dom.querySelector('code');
            if (codeEl) {
              const cls = codeEl.className || '';
              const match = cls.match(/language-(\S+)/);
              return { language: match ? match[1] : '' };
            }
            return { language: '' };
          },
        },
      ],
      toDOM(node) {
        const codeAttrs: Record<string, string> = {};
        if (node.attrs.language) {
          codeAttrs.class = `language-${node.attrs.language}`;
        }
        return ['pre', ['code', codeAttrs, 0]];
      },
    },
    image: {
      inline: true,
      attrs: {
        src: { default: '' },
        alt: { default: null },
        title: { default: null },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom: HTMLElement) {
            return {
              src: dom.getAttribute('src'),
              alt: dom.getAttribute('alt'),
              title: dom.getAttribute('title'),
            };
          },
        },
      ],
      toDOM(node) {
        return ['img', { src: node.attrs.src, alt: node.attrs.alt, title: node.attrs.title }];
      },
    },
    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM() {
        return ['br'];
      },
    },
    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM() {
        return ['hr'];
      },
    },
    blockquote: {
      content: 'block+',
      group: 'block',
      defining: true,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM() {
        return ['blockquote', 0];
      },
    },
    ordered_list: {
      content: 'list_item+',
      group: 'block',
      attrs: { order: { default: 1, validate: 'number' }, tight: { default: false } },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom: HTMLElement) {
            return {
              order: dom.hasAttribute('start') ? Number(dom.getAttribute('start')) : 1,
              tight: dom.hasAttribute('data-tight'),
            };
          },
        },
      ],
      toDOM(node) {
        const attrs: Record<string, string> = {};
        if (node.attrs.order !== 1) {
          attrs.start = String(node.attrs.order);
        }
        if (node.attrs.tight) {
          attrs['data-tight'] = 'true';
        }
        return ['ol', attrs, 0];
      },
    },
    bullet_list: {
      content: 'list_item+',
      group: 'block',
      attrs: { tight: { default: false } },
      parseDOM: [
        {
          tag: 'ul',
          getAttrs(dom: HTMLElement) {
            return { tight: dom.hasAttribute('data-tight') };
          },
        },
      ],
      toDOM(node) {
        return ['ul', node.attrs.tight ? { 'data-tight': 'true' } : {}, 0];
      },
    },
    list_item: {
      content: 'paragraph block*',
      parseDOM: [{ tag: 'li' }],
      toDOM() {
        return ['li', 0];
      },
      defining: true,
    },
    table: {
      content: 'table_row+',
      group: 'block',
      tableRole: 'table',
      isolating: true,
      parseDOM: [{ tag: 'table' }],
      toDOM() {
        return ['table', ['tbody', 0]];
      },
    },
    table_row: {
      content: 'table_cell | table_header',
      tableRole: 'row',
      parseDOM: [{ tag: 'tr' }],
      toDOM() {
        return ['tr', 0];
      },
    },
    table_cell: {
      content: 'inline*',
      attrs: { alignment: { default: null } },
      tableRole: 'cell',
      isolating: true,
      parseDOM: [
        {
          tag: 'td',
          getAttrs(dom: HTMLElement) {
            return { alignment: dom.style.textAlign || null };
          },
        },
      ],
      toDOM(node) {
        const attrs: Record<string, string> = {};
        if (node.attrs.alignment) {
          attrs.style = `text-align: ${node.attrs.alignment}`;
        }
        return ['td', attrs, 0];
      },
    },
    table_header: {
      content: 'inline*',
      attrs: { alignment: { default: null } },
      tableRole: 'header_cell',
      isolating: true,
      parseDOM: [
        {
          tag: 'th',
          getAttrs(dom: HTMLElement) {
            return { alignment: dom.style.textAlign || null };
          },
        },
      ],
      toDOM(node) {
        const attrs: Record<string, string> = {};
        if (node.attrs.alignment) {
          attrs.style = `text-align: ${node.attrs.alignment}`;
        }
        return ['th', attrs, 0];
      },
    },
    task_list_item: {
      content: 'paragraph block*',
      attrs: { checked: { default: false } },
      parseDOM: [
        {
          tag: 'li[data-type="taskItem"]',
          getAttrs(dom: HTMLElement) {
            return { checked: dom.getAttribute('data-checked') === 'true' };
          },
        },
      ],
      toDOM(node) {
        return [
          'li',
          {
            'data-type': 'taskItem',
            'data-checked': String(node.attrs.checked),
          },
          0,
        ];
      },
      defining: true,
    },
    math_inline: {
      inline: true,
      group: 'inline',
      content: 'text*',
      attrs: { math: { default: '' } },
      parseDOM: [
        {
          tag: 'span[data-type="mathInline"]',
          getAttrs(dom: HTMLElement) {
            return { math: dom.textContent || '' };
          },
        },
      ],
      toDOM(node) {
        return ['span', { 'data-type': 'mathInline' }, node.attrs.math];
      },
    },
    math_block: {
      content: 'text*',
      group: 'block',
      attrs: { math: { default: '' } },
      code: true,
      defining: true,
      parseDOM: [
        {
          tag: 'div[data-type="mathBlock"]',
          getAttrs(dom: HTMLElement) {
            return { math: dom.textContent || '' };
          },
        },
      ],
      toDOM(node) {
        return ['div', { 'data-type': 'mathBlock' }, node.attrs.math];
      },
    },
    footnote: {
      inline: true,
      group: 'inline',
      attrs: { id: { default: '' }, label: { default: '' } },
      parseDOM: [
        {
          tag: 'sup[data-type="footnote"]',
          getAttrs(dom: HTMLElement) {
            return {
              id: dom.getAttribute('data-id') || '',
              label: dom.textContent || '',
            };
          },
        },
      ],
      toDOM(node) {
        return ['sup', { 'data-type': 'footnote', 'data-id': node.attrs.id }, node.attrs.label];
      },
    },
    mermaid_block: {
      content: 'text*',
      group: 'block',
      attrs: { code: { default: '' } },
      code: true,
      defining: true,
      parseDOM: [
        {
          tag: 'div[data-type="mermaidBlock"]',
          getAttrs(dom: HTMLElement) {
            return { code: dom.textContent || '' };
          },
        },
      ],
      toDOM(node) {
        return ['div', { 'data-type': 'mermaidBlock' }, node.attrs.code];
      },
    },
    text: {
      group: 'inline',
    },
  },
  marks: {
    bold: {
      parseDOM: [
        { tag: 'strong' },
        { tag: 'b' },
        { style: 'font-weight=bold' },
        { style: 'font-weight=700' },
        { style: 'font-weight=800' },
        { style: 'font-weight=900' },
      ],
      toDOM() {
        return ['strong', 0];
      },
    },
    italic: {
      parseDOM: [{ tag: 'em' }, { tag: 'i' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['em', 0];
      },
    },
    link: {
      attrs: {
        href: { default: '' },
        title: { default: null },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom: HTMLElement) {
            return {
              href: dom.getAttribute('href'),
              title: dom.getAttribute('title'),
            };
          },
        },
      ],
      toDOM(mark) {
        const attrs: Record<string, string> = { href: mark.attrs.href };
        if (mark.attrs.title) {
          attrs.title = mark.attrs.title;
        }
        return ['a', attrs, 0];
      },
    },
    strikethrough: {
      parseDOM: [{ tag: 'del' }, { tag: 's' }, { style: 'text-decoration=line-through' }],
      toDOM() {
        return ['del', 0];
      },
    },
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM() {
        return ['code', 0];
      },
    },
    highlight: {
      parseDOM: [{ tag: 'mark' }],
      toDOM() {
        return ['mark', 0];
      },
    },
    subscript: {
      parseDOM: [{ tag: 'sub' }],
      toDOM() {
        return ['sub', 0];
      },
    },
    superscript: {
      parseDOM: [{ tag: 'sup' }],
      toDOM() {
        return ['sup', 0];
      },
    },
    underline: {
      parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
      toDOM() {
        return ['u', 0];
      },
    },
  },
});
