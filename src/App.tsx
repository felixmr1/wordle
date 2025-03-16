import { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import styled, { keyframes } from 'styled-components';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard';
import { isValidKey, type KeyStatus } from './utils/keyboard';
import type { TileStatus } from './components/Tile';
import { getRandomWord, isValidWord } from './services/wordService';

type GameStats = {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  failures: number;
};

const initialStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0], // Index 0-5 = wins in 1-6 tries
  failures: 0 // Track total failures
};

const MainContainer = styled.main`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 500px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  padding-bottom: 10px;
`;

const ReplayButton = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const ResetStatsButton = styled(ReplayButton)`
  background-color: ${({ theme }) => theme.colors.secondary};
  margin-left: 10px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
`;

const StatBox = styled.div`
  text-align: center;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 5px;

  .number {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
  }

  .label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const GuessDistribution = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const GuessBar = styled.div<{ $percentage: number; $isFailure?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;

  .guess-number {
    min-width: 20px;
  }

  .bar {
    flex: 1;
    background-color: ${({ theme }) => theme.colors.surface};
    height: 20px;
    border-radius: 3px;
    overflow: hidden;

    .fill {
      height: 100%;
      width: ${props => props.$percentage}%;
      background-color: ${props => props.$isFailure ? '#ff4444' : props.theme.colors.primary};
      transition: width 0.3s ease;
    }
  }

  .count {
    min-width: 30px;
    text-align: right;
  }
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  50% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

const GameOverlay = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 10;
  min-width: 300px;
`;

const Message = styled.div<{ $type: 'error' | 'success' }>`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.$type === 'error' ? '#ff4444' : '#44ff44'};
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  animation: ${shake} 0.5s ease-in-out;
  z-index: 10;
`;

function App() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [keyStatus, setKeyStatus] = useState<KeyStatus>({});
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [gameOver, setGameOver] = useState<'won' | 'lost' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const statsRef = useRef<GameStats>(initialStats);
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('wordleStats');
    if (saved) {
      const parsedStats = JSON.parse(saved);
      // Ensure failures is initialized for existing stored stats
      if (!('failures' in parsedStats)) {
        parsedStats.failures = 0;
      }
      statsRef.current = parsedStats;
      return parsedStats;
    }
    statsRef.current = initialStats;
    return initialStats;
  });

  // Load initial word
  useEffect(() => {
    getRandomWord().then(word => {
      setSolution(word);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    statsRef.current = stats;
    localStorage.setItem('wordleStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const updateStats = useCallback((won: boolean, numGuesses?: number) => {
    console.log('Updating stats:', { won, numGuesses, currentGuesses: guesses.length });
    console.log('Current stats ref:', statsRef.current);
    
    const newStats = {
      ...statsRef.current,
      gamesPlayed: statsRef.current.gamesPlayed + 1,
      gamesWon: won ? statsRef.current.gamesWon + 1 : statsRef.current.gamesWon,
      currentStreak: won ? statsRef.current.currentStreak + 1 : 0,
      maxStreak: won ? Math.max(statsRef.current.maxStreak, statsRef.current.currentStreak + 1) : statsRef.current.maxStreak,
      guessDistribution: [...statsRef.current.guessDistribution],
      failures: won ? statsRef.current.failures : statsRef.current.failures + 1
    };
    
    if (won && numGuesses) {
      newStats.guessDistribution[numGuesses - 1]++;
    }
    
    console.log('New stats to be set:', newStats);
    setStats(newStats);
  }, [guesses.length]);

  const updateKeyStatus = useCallback((guess: string) => {
    const newStatus: { [key: string]: TileStatus } = { ...keyStatus };
    const upperGuess = guess.toUpperCase();
    
    for (let i = 0; i < upperGuess.length; i++) {
      const letter = upperGuess[i];
      
      if (solution[i] === letter) {
        newStatus[letter] = 'correct';
      } else if (solution.includes(letter)) {
        if (newStatus[letter] !== 'correct') {
          newStatus[letter] = 'present';
        }
      } else {
        if (!newStatus[letter]) {
          newStatus[letter] = 'absent';
        }
      }
    }
    
    setKeyStatus(newStatus);
  }, [solution, keyStatus]);

  const onKey = useCallback(async (key: string) => {
    if (gameOver || isLoading) return;
    
    if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        setMessage({ text: 'Not enough letters', type: 'error' });
        return;
      }
      
      const upperGuess = currentGuess.toUpperCase();
      const isValid = await isValidWord(upperGuess);
      
      if (!isValid) {
        setMessage({ text: 'Not in word list', type: 'error' });
        return;
      }
      
      setGuesses(prev => [...prev, upperGuess]);
      updateKeyStatus(upperGuess);
      setCurrentGuess('');

      // Log current game state
      console.log('Current game state:', {
        guessCount: guesses.length + 1,
        isLastGuess: guesses.length === 5,
        isCorrect: upperGuess === solution
      });

      if (upperGuess === solution) {
        console.log('Game won on guess #', guesses.length + 1);
        setGameOver('won');
        setMessage({ text: 'Brilliant!', type: 'success' });
        updateStats(true, guesses.length + 1);
      } else if (guesses.length === 5) {
        console.log('Game lost after 6 guesses');
        setGameOver('lost');
        updateStats(false, 6); // Pass the actual number of guesses (6) for losses
      }
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    } else {
      setMessage({ text: 'Word too long', type: 'error' });
    }
  }, [currentGuess, guesses.length, updateKeyStatus, solution, gameOver, isLoading, updateStats]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    const key = event.key.toUpperCase();
    
    const mappedKey = key === 'ENTER' ? 'ENTER' : 
                     key === 'BACKSPACE' ? 'BACKSPACE' : 
                     key;
                     
    if (!isValidKey(mappedKey)) return;
    onKey(mappedKey);
  }, [onKey]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetGame = useCallback(async () => {
    setIsLoading(true);
    const newWord = await getRandomWord();
    setSolution(newWord);
    setGuesses([]);
    setCurrentGuess('');
    setKeyStatus({});
    setMessage(null);
    setGameOver(null);
    setIsLoading(false);
  }, []);

  const resetStats = useCallback(() => {
    const freshStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0],
      failures: 0
    };
    statsRef.current = freshStats;
    setStats(freshStats);
    localStorage.removeItem('wordleStats');
    console.log('Stats reset to:', freshStats);
  }, []);

  const renderStats = () => {
    const maxGuesses = Math.max(...stats.guessDistribution, stats.failures);
    return (
      <>
        <StatsContainer>
          <StatBox>
            <div className="number">{stats.gamesPlayed}</div>
            <div className="label">Played</div>
          </StatBox>
          <StatBox>
            <div className="number">{stats.gamesWon}</div>
            <div className="label">Won</div>
          </StatBox>
          <StatBox>
            <div className="number">{stats.failures}</div>
            <div className="label">Lost</div>
          </StatBox>
          <StatBox>
            <div className="number">{stats.currentStreak}</div>
            <div className="label">Streak</div>
          </StatBox>
          <StatBox>
            <div className="number">{stats.maxStreak}</div>
            <div className="label">Best</div>
          </StatBox>
        </StatsContainer>
        <GuessDistribution>
          {stats.guessDistribution.map((count, index) => (
            <GuessBar 
              key={index} 
              $percentage={maxGuesses > 0 ? (count / maxGuesses) * 100 : 0}
              $isFailure={false}
            >
              <div className="guess-number">{index + 1}</div>
              <div className="bar">
                <div className="fill" />
              </div>
              <div className="count">{count}</div>
            </GuessBar>
          ))}
          <GuessBar 
            key="failures" 
            $percentage={maxGuesses > 0 ? (stats.failures / maxGuesses) * 100 : 0}
            $isFailure={true}
          >
            <div className="guess-number">X</div>
            <div className="bar">
              <div className="fill" />
            </div>
            <div className="count">{stats.failures}</div>
          </GuessBar>
        </GuessDistribution>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <ReplayButton onClick={resetGame}>
            Play Again
          </ReplayButton>
          <ResetStatsButton onClick={resetStats}>
            Reset Stats
          </ResetStatsButton>
        </div>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <MainContainer>
        <Content>
          <Title>Wordle</Title>
          {message && (
            <Message $type={message.type}>
              {message.text}
            </Message>
          )}
          {gameOver && (
            <GameOverlay>
              <h2>{gameOver === 'won' ? '🎉 Congratulations!' : '😔 Game Over'}</h2>
              <p>
                {gameOver === 'won' 
                  ? `You won in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}!` 
                  : `The word was: ${solution}`}
              </p>
              {renderStats()}
            </GameOverlay>
          )}
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <GameBoard
                guesses={guesses}
                currentGuess={currentGuess.toUpperCase()}
                solution={solution}
              />
              <Keyboard
                onKey={onKey}
                keyStatus={keyStatus}
              />
            </>
          )}
        </Content>
      </MainContainer>
    </ThemeProvider>
  );
}

export default App;
