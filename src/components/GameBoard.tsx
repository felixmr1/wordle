import styled from 'styled-components';
import { Row } from './Row';

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizes.gap};
  padding: ${({ theme }) => theme.sizes.gap};
`;

export const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, solution }) => {
  return (
    <BoardContainer>
      {Array.from({ length: 6 }).map((_, index) => {
        // If this is the current row
        if (index === guesses.length) {
          return (
            <Row
              key={index}
              word={currentGuess}
              isSubmitted={false}
            />
          );
        }
        // If this is a completed row
        if (index < guesses.length) {
          return (
            <Row
              key={index}
              word={guesses[index]}
              solution={solution}
              isSubmitted={true}
            />
          );
        }
        // If this is a future row
        return (
          <Row
            key={index}
            word=""
            isSubmitted={false}
          />
        );
      })}
    </BoardContainer>
  );
}; 