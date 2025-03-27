export const theme = {
  colors: {
    background: '#ffffff',
    surface: '#f3f3f3',
    primary: '#6aaa64',
    secondary: '#c9b458',
    border: '#d3d6da',
    text: '#1a1a1b',
    error: '#ff4d4d',
    keyboardBg: '#d3d6da',
    absent: '#787c7e',
    present: '#c9b458',
    correct: '#6aaa64'
  },
  fonts: {
    body: "'Arial', sans-serif"
  },
  sizes: {
    tile: '62px',
    gap: '5px',
    keyboard: {
      key: '43px',
      gap: '6px'
    }
  },
  breakpoints: {
    mobile: '500px'
  },
  mobileSizes: {
    keyboard: {
      gap: '4px'
    }
  }
} as const;

export type Theme = typeof theme; 