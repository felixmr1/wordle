import { TileStatus } from '../components/Tile';

export const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export type KeyStatus = {
  [key: string]: TileStatus;
};

export const isValidKey = (key: string): boolean => {
  return KEYBOARD_ROWS.flat().includes(key.toUpperCase()) ||
    (key.toUpperCase() === 'ENTER') ||
    (key.toUpperCase() === 'BACKSPACE');
}; 