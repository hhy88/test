export function isMac(): boolean {
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

export function isWindows(): boolean {
  return /Win/.test(navigator.platform);
}

export function isLinux(): boolean {
  return /Linux/.test(navigator.platform) && !/Android/.test(navigator.userAgent);
}

export function getModifierKey(): '⌘' | 'Ctrl' {
  return isMac() ? '⌘' : 'Ctrl';
}
