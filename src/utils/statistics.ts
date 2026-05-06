export interface WordCountResult {
  totalChars: number;
  chineseChars: number;
  englishChars: number;
  charsNoSpace: number;
  paragraphs: number;
  images: number;
}

export function countWords(content: string): WordCountResult {
  const chineseMatches = content.match(/[\u4e00-\u9fff]/g) || [];
  const englishMatches = content.match(/[a-zA-Z]/g) || [];
  const imageMatches = content.match(/!\[.*?\]\(.*?\)/g) || [];

  const paragraphs = content
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  const charsNoSpace = content.replace(/\s/g, '').length;

  return {
    totalChars: content.length,
    chineseChars: chineseMatches.length,
    englishChars: englishMatches.length,
    charsNoSpace,
    paragraphs,
    images: imageMatches.length,
  };
}
