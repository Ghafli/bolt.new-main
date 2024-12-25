import { ITheme } from 'xterm';

export function getTheme(theme: 'light' | 'dark'): ITheme {
  const base = {
    background: 'var(--color-bg-primary)',
    foreground: 'var(--color-text-primary)',
    cursor: 'var(--color-accent)',
    selection: 'var(--color-bg-active)',
  };
  if (theme === 'light') {
    return {
      ...base,
      black: '#000000',
      red: '#C83737',
      green: '#32CD32',
      yellow: '#FFFF00',
      blue: '#4682B4',
      magenta: '#8A2BE2',
      cyan: '#00FFFF',
      white: '#D0D0D0',
      brightBlack: '#808080',
      brightRed: '#FF0000',
      brightGreen: '#00FF00',
      brightYellow: '#FFFF00',
      brightBlue: '#0000FF',
      brightMagenta: '#FF00FF',
      brightCyan: '#00FFFF',
      brightWhite: '#FFFFFF',
    };
  }
  return {
    ...base,
    black: '#000000',
    red: '#FF6B6B',
    green: '#42F56C',
    yellow: '#F0E68C',
    blue: '#66B2FF',
    magenta: '#F066FF',
    cyan: '#87CEEB',
    white: '#FFFFFF',
    brightBlack: '#808080',
    brightRed: '#FF0000',
    brightGreen: '#00FF00',
    brightYellow: '#FFFF00',
    brightBlue: '#0000FF',
    brightMagenta: '#FF00FF',
    brightCyan: '#00FFFF',
    brightWhite: '#FFFFFF',
  };
}
