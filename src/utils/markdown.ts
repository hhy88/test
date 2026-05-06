export interface Heading {
  level: number;
  text: string;
  id: string;
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/#+\s*$/, '').trim();
      const id = generateSlug(text);
      headings.push({ level, text, id });
    }
  }

  return headings;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stripMarkdown(content: string): string {
  let text = content;
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2');
  text = text.replace(/~~(.*?)~~/g, '$1');
  text = text.replace(/`{3}[\s\S]*?`{3}/g, '');
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/^>\s+/gm, '');
  text = text.replace(/^[-*+]\s+/gm, '');
  text = text.replace(/^\d+\.\s+/gm, '');
  text = text.replace(/^---+$/gm, '');
  text = text.replace(/\|/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}
