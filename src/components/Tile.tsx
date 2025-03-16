import styled, { css } from 'styled-components';

export type TileStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

interface TileProps {
  letter?: string;
  status: TileStatus;
  position: number;
}

const TileContainer = styled.div<{ $status: TileStatus }>`
  width: ${({ theme }) => theme.sizes.tile};
  height: ${({ theme }) => theme.sizes.tile};
  border: 2px solid ${({ theme, $status }) => 
    $status === 'empty' ? theme.colors.border : 
    $status === 'filled' ? theme.colors.text : 'transparent'
  };
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  user-select: none;
  
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
          background-color: transparent;
          color: ${theme.colors.text};
        `;
    }
  }}

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: calc(${({ theme }) => theme.sizes.tile} * 0.8);
    height: calc(${({ theme }) => theme.sizes.tile} * 0.8);
    font-size: 1.5rem;
  }
`;

export const Tile: React.FC<TileProps> = ({ letter = '', status, position }) => {
  return (
    <TileContainer 
      $status={status}
      style={{
        animationDelay: `${position * 300}ms`
      }}
    >
      {letter}
    </TileContainer>
  );
}; 