interface ExportOptions {
  filename?: string;
  title?: string;
  theme?: string;
}

export async function exportToPDF(html: string, options: ExportOptions = {}): Promise<Blob> {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  } else {
    window.print();
  }

  return new Blob([html], { type: 'application/pdf' });
}

export async function exportToHTML(markdown: string, options: ExportOptions = {}): Promise<Blob> {
  const title = options.title || 'MarkEdit Export';
  const theme = options.theme || 'default';

  const htmlContent = `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
    img { max-width: 100%; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; }
    th { background: #f4f4f4; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
${markdown}
</body>
</html>`;

  return new Blob([htmlContent], { type: 'text/html' });
}

export async function exportToText(markdown: string): Promise<Blob> {
  const text = stripAllMarkdown(markdown);
  return new Blob([text], { type: 'text/plain' });
}

export async function exportToDocx(html: string): Promise<Blob> {
  const docxContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.6; }
        h1 { font-size: 24pt; font-weight: bold; }
        h2 { font-size: 18pt; font-weight: bold; }
        h3 { font-size: 14pt; font-weight: bold; }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `;

  return new Blob([docxContent], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

export async function exportToImage(element: HTMLElement): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const rect = element.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;

  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new Blob([], { type: 'image/png' });
  }

  ctx.scale(scale, scale);

  const svgData = new XMLSerializer().serializeToString(createSVGFromElement(element, rect));
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        resolve(blob || new Blob([], { type: 'image/png' }));
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(new Blob([], { type: 'image/png' }));
    };
    img.src = url;
  });
}

function createSVGFromElement(element: HTMLElement, rect: DOMRect): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(rect.width));
  svg.setAttribute('height', String(rect.height));
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  foreignObject.setAttribute('width', '100%');
  foreignObject.setAttribute('height', '100%');

  const clone = element.cloneNode(true) as HTMLElement;
  const style = document.createElement('style');
  style.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  `;
  clone.insertBefore(style, clone.firstChild);
  foreignObject.appendChild(clone);
  svg.appendChild(foreignObject);

  return svg;
}

function stripAllMarkdown(content: string): string {
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
