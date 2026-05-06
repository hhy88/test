interface SearchOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  regex?: boolean;
}

export interface MatchPosition {
  start: number;
  end: number;
  text: string;
}

export function searchInContent(
  content: string,
  query: string,
  options: SearchOptions = {}
): MatchPosition[] {
  if (!query) return [];

  const { caseSensitive = false, wholeWord = false, regex = false } = options;
  const flags = caseSensitive ? 'g' : 'gi';

  let pattern: RegExp;
  if (regex) {
    try {
      pattern = new RegExp(query, flags);
    } catch {
      return [];
    }
  } else {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const finalPattern = wholeWord ? `\\b${escaped}\\b` : escaped;
    pattern = new RegExp(finalPattern, flags);
  }

  const matches: MatchPosition[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });

    if (match[0].length === 0) {
      pattern.lastIndex++;
    }
  }

  return matches;
}

export function replaceInContent(
  content: string,
  query: string,
  replacement: string,
  options: SearchOptions = {}
): string {
  const matches = searchInContent(content, query, options);
  if (matches.length === 0) return content;

  const firstMatch = matches[0];
  return content.slice(0, firstMatch.start) + replacement + content.slice(firstMatch.end);
}

export function replaceAllInContent(
  content: string,
  query: string,
  replacement: string,
  options: SearchOptions = {}
): string {
  if (!query) return content;

  const { caseSensitive = false, wholeWord = false, regex = false } = options;
  const flags = caseSensitive ? 'g' : 'gi';

  let pattern: RegExp;
  if (regex) {
    try {
      pattern = new RegExp(query, flags);
    } catch {
      return content;
    }
  } else {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const finalPattern = wholeWord ? `\\b${escaped}\\b` : escaped;
    pattern = new RegExp(finalPattern, flags);
  }

  return content.replace(pattern, replacement);
}
