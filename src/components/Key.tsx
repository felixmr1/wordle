import styled, { css } from 'styled-components';
import { TileStatus } from './Tile';

interface KeyProps {
  value: string;
  status?: TileStatus;
  onClick: (value: string) => void;
  wide?: boolean;
}

const KeyContainer = styled.button<{ $status?: TileStatus; $wide?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  height: 58px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.keyboardBg};
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  flex: ${({ $wide }) => ($wide ? 1.5 : 1)};
  font-size: ${({ $wide }) => ($wide ? '12px' : '1.25rem')};
  min-width: ${({ theme }) => theme.sizes.keyboard.key};

  ${({ $status, theme }) => {
    switch ($status) {
      case 'correct':
        return css`
          background-color: ${theme.colors.correct};
          color: white;
        `;
      case 'present':
        return css`
          background-color: ${theme.colors.present};
          color: white;
        `;
      case 'absent':
        return css`
          background-color: ${theme.colors.absent};
          color: white;
        `;
      default:
        return css`
          &:hover {
            background-color: ${theme.colors.border};
          }
        `;
    }
  }}

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 48px;
    font-size: ${({ $wide }) => ($wide ? '11px' : '1.125rem')};
  }
`;

export const Key: React.FC<KeyProps> = ({ value, status, onClick, wide }) => {
  const displayValue = value === 'BACKSPACE' ? '←' : value;

  return (
    <KeyContainer
      $status={status}
      $wide={wide}
      onClick={() => onClick(value)}
      aria-label={value.toLowerCase()}
    >
      {displayValue}
    </KeyContainer>
  );
}; 