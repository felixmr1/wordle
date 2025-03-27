import styled from 'styled-components';
import { Key } from './Key';
import { KEYBOARD_ROWS } from '../utils/keyboard';
import type { KeyStatus } from '../utils/keyboard';

interface KeyboardProps {
  onKey: (key: string) => void;
  keyStatus: KeyStatus;
}

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  margin-top: auto;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
`;

const KeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.sizes.keyboard.gap};
  width: 100%;
  padding: 0 5px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.mobileSizes.keyboard.gap};
  }
`;

export const Keyboard: React.FC<KeyboardProps> = ({ onKey, keyStatus }) => {
  return (
    <KeyboardContainer>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <KeyboardRow key={rowIndex}>
          {row.map((key) => (
            <Key
              key={key}
              value={key}
              status={keyStatus[key]}
              onClick={onKey}
              wide={key === 'ENTER' || key === 'BACKSPACE'}
            />
          ))}
        </KeyboardRow>
      ))}
    </KeyboardContainer>
  );
}; 