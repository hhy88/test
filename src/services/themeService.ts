const BUILT_IN_THEMES = ['default', 'dark', 'github', 'github-dark', 'newsprint', 'night', 'pixyll', 'whitey'];

const customThemeStyleId = 'markedit-custom-theme';

export function applyTheme(themeName: string): void {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('markedit-theme', themeName);
}

export function getAvailableThemes(): string[] {
  return [...BUILT_IN_THEMES];
}

export function importCustomTheme(cssContent: string): boolean {
  const isValid = validateCustomCSS(cssContent);
  if (!isValid) {
    return false;
  }

  let styleEl = document.getElementById(customThemeStyleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = customThemeStyleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = cssContent;
  document.documentElement.setAttribute('data-theme', 'custom');
  localStorage.setItem('markedit-custom-theme', cssContent);
  localStorage.setItem('markedit-theme', 'custom');

  return true;
}

export function exportCurrentTheme(): string {
  const currentTheme = localStorage.getItem('markedit-theme') || 'default';

  if (currentTheme === 'custom') {
    return localStorage.getItem('markedit-custom-theme') || '';
  }

  const themeSheet = findThemeStyleSheet(currentTheme);
  if (themeSheet) {
    try {
      const rules: string[] = [];
      for (let i = 0; i < themeSheet.cssRules.length; i++) {
        rules.push(themeSheet.cssRules[i].cssText);
      }
      return rules.join('\n');
    } catch {
      return '';
    }
  }

  return '';
}

function validateCustomCSS(css: string): boolean {
  if (!css || css.trim().length === 0) return false;

  const dangerousPatterns = [
    /<script/i,
    /javascript\s*:/i,
    /expression\s*\(/i,
    /@import\s+url\s*\(/i,
    /behavior\s*:/i,
    /-moz-binding\s*:/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(css)) return false;
  }

  const openBraces = (css.match(/{/g) || []).length;
  const closeBraces = (css.match(/}/g) || []).length;
  if (openBraces !== closeBraces) return false;

  return true;
}

function findThemeStyleSheet(themeName: string): CSSStyleSheet | null {
  for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];
    try {
      for (let j = 0; j < sheet.cssRules.length; j++) {
        const rule = sheet.cssRules[j] as CSSStyleRule;
        if (
          rule.selectorText &&
          rule.selectorText.includes(`[data-theme="${themeName}"]`)
        ) {
          return sheet;
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}
