import styled from 'styled-components';
import { Tile, TileStatus } from './Tile';

interface RowProps {
  word: string;
  solution?: string;
  isSubmitted: boolean;
}

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.sizes.gap};
  margin-bottom: ${({ theme }) => theme.sizes.gap};
`;

export const Row: React.FC<RowProps> = ({ word = '', solution = '', isSubmitted }) => {
  const getTileStatus = (letter: string, index: number): TileStatus => {
    if (!letter) return 'empty';
    if (!isSubmitted) return 'filled';
    
    if (solution[index] === letter) {
      return 'correct';
    }
    
    if (solution.includes(letter)) {
      // Count occurrences of the letter in the solution
      const letterCount = [...solution].filter(l => l === letter).length;
      // Count correct positions of this letter before current index
      const correctPositions = [...word].filter((l, i) => l === letter && solution[i] === letter && i < index).length;
      // Count present positions of this letter before current index
      const presentPositions = [...word].filter((l, i) => 
        l === letter && 
        solution[i] !== letter && 
        solution.includes(letter) && 
        i < index
      ).length;
      
      // If we haven't exceeded the count of this letter in the solution
      if (correctPositions + presentPositions < letterCount) {
        return 'present';
      }
    }
    
    return 'absent';
  };

  return (
    <RowContainer>
      {Array.from({ length: 5 }).map((_, index) => (
        <Tile
          key={index}
          letter={word[index]}
          status={getTileStatus(word[index], index)}
          position={index}
        />
      ))}
    </RowContainer>
  );
}; 