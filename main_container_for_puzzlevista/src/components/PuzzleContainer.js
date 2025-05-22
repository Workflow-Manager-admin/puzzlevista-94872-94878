import React, { useState, useEffect, useCallback, useRef } from 'react';
import PuzzleBoard from './PuzzleBoard';
import { 
  generatePuzzlePieces, 
  shufflePieces, 
  isPuzzleComplete,
  formatElapsedTime
} from '../utils/puzzleUtils';
import { ANCIENT_PUZZLE_IMAGE } from '../assets/ancient_puzzle';

// PUBLIC_INTERFACE
/**
 * PuzzleContainer - Main container component for the PuzzleVista game
 * Provides an Ancient themed container with puzzle elements and controls
 */
const PuzzleContainer = () => {
  // Puzzle configuration
  const [difficulty, setDifficulty] = useState('Medium');
  const difficultySettings = {
    Easy: { rows: 3, columns: 3 },
    Medium: { rows: 4, columns: 4 },
    Hard: { rows: 5, columns: 5 }
  };

  // Puzzle state
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const startTimeRef = useRef(null);
  const [currentTime, setCurrentTime] = useState('00:00');
  const timerRef = useRef(null);
  
  // Board size ref to maintain consistent dimensions
  const puzzleAreaRef = useRef(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  
  // Calculate board size based on container size
  const updateBoardSize = useCallback(() => {
    if (puzzleAreaRef.current) {
      const { clientWidth, clientHeight } = puzzleAreaRef.current;
      // Keep the board square with some padding
      const size = Math.min(clientWidth, clientHeight) * 0.9;
      setBoardSize({ width: size, height: size });
    }
  }, []);
  
  // Initialize board size on mount and window resize
  useEffect(() => {
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, [updateBoardSize]);
  
  // Start the game timer
  useEffect(() => {
    if (gameStarted && !isComplete) {
      const now = Date.now();
      startTimeRef.current = now;
      
      // Update timer every second
      timerRef.current = setInterval(() => {
        setCurrentTime(formatElapsedTime(now));
      }, 1000);
    } else if (isComplete && timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, isComplete]);

  // Check for puzzle completion after every move
  useEffect(() => {
    if (puzzlePieces.length > 0) {
      const completed = isPuzzleComplete(puzzlePieces);
      setIsComplete(completed);
      
      if (completed) {
        // Show completion message
        setTimeout(() => {
          alert('Congratulations! You completed the puzzle!');
        }, 500);
      }
    }
  }, [puzzlePieces]);

  // Initialize puzzle pieces
  const initializePuzzle = useCallback(() => {
    if (boardSize.width === 0 || !ANCIENT_PUZZLE_IMAGE) return;
    
    const { rows, columns } = difficultySettings[difficulty];
    
    // Generate pieces in correct positions first
    const pieces = generatePuzzlePieces(
      ANCIENT_PUZZLE_IMAGE, 
      rows, 
      columns, 
      boardSize.width, 
      boardSize.height
    );
    
    // Then shuffle them
    const shuffledPieces = shufflePieces(pieces, boardSize.width, boardSize.height);
    
    setPuzzlePieces(shuffledPieces);
    setIsComplete(false);
    setGameStarted(true);
    setStartTime(Date.now());
  }, [boardSize, difficulty, difficultySettings]);
  
  // Handle new puzzle button click
  const handleNewPuzzle = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameStarted(false);
    setCurrentTime('00:00');
    setTimeout(initializePuzzle, 100);
  };
  
  // Handle hint button click - move one random piece to correct position
  const handleHint = () => {
    if (!gameStarted || isComplete) return;
    
    // Find a piece that's not in correct position yet
    const unplacedPieces = puzzlePieces.filter(p => !p.isPlaced);
    if (unplacedPieces.length === 0) return;
    
    // Select a random unplaced piece
    const randomPiece = unplacedPieces[Math.floor(Math.random() * unplacedPieces.length)];
    
    // Place it correctly
    handlePieceDrop(randomPiece.id, {
      x: randomPiece.correctPosition.col * randomPiece.width,
      y: randomPiece.correctPosition.row * randomPiece.height,
      isPlaced: true
    });
  };
  
  // Handle shuffle button click
  const handleShuffle = () => {
    if (!gameStarted) return;
    
    const shuffledPieces = shufflePieces([...puzzlePieces], boardSize.width, boardSize.height);
    setPuzzlePieces(shuffledPieces);
    
    // Reset game state
    setIsComplete(false);
    setStartTime(Date.now());
  };
  
  // Handle piece drop event
  const handlePieceDrop = (pieceId, newPosition) => {
    setPuzzlePieces(prevPieces => {
      return prevPieces.map(piece => {
        if (piece.id === pieceId) {
          return {
            ...piece,
            x: newPosition.x,
            y: newPosition.y,
            isPlaced: newPosition.isPlaced !== undefined ? newPosition.isPlaced : piece.isPlaced
          };
        }
        return piece;
      });
    });
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    if (gameStarted) {
      // If already in a game, restart with new difficulty
      setGameStarted(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCurrentTime('00:00');
      // Small delay to ensure state updates first
      setTimeout(() => {
        setDifficulty(newDifficulty);
        setTimeout(initializePuzzle, 100);
      }, 100);
    }
  };

  return (
    <div className="puzzle-vista-container">
      <div className="ancient-border">
        <div ref={puzzleAreaRef} className="puzzle-area">
          {!gameStarted ? (
            <div className="puzzle-placeholder">
              <div className="hieroglyph-icon">𓀀</div>
              <p>Select difficulty and click "New Puzzle" to begin</p>
            </div>
          ) : (
            <PuzzleBoard
              pieces={puzzlePieces}
              onPieceDrop={handlePieceDrop}
              boardSize={boardSize}
              image={ANCIENT_PUZZLE_IMAGE}
            />
          )}
          
          {/* Overlay completion message */}
          {isComplete && (
            <div className="puzzle-complete-overlay">
              <h3>Puzzle Complete!</h3>
              <p>Time: {currentTime}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="controls-area">
        <div className="control-panel">
          <h3 className="ancient-text">Controls</h3>
          <button 
            className="ancient-button" 
            onClick={handleNewPuzzle}
          >
            New Puzzle
          </button>
          <button 
            className="ancient-button" 
            onClick={handleHint}
            disabled={!gameStarted || isComplete}
          >
            Hint
          </button>
          <button 
            className="ancient-button" 
            onClick={handleShuffle}
            disabled={!gameStarted || isComplete}
          >
            Shuffle
          </button>
          
          <div className="difficulty-selector">
            <h4 className="ancient-text" style={{ marginTop: '20px' }}>Difficulty</h4>
            <div className="difficulty-buttons">
              {Object.keys(difficultySettings).map(level => (
                <button
                  key={level}
                  className={`difficulty-button ${difficulty === level ? 'active-difficulty' : ''}`}
                  onClick={() => handleDifficultyChange(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="puzzle-info">
          <h3 className="ancient-text">Puzzle Information</h3>
          <div className="info-tile">
            <span className="info-label">Difficulty:</span>
            <span className="info-value">{difficulty}</span>
          </div>
          <div className="info-tile">
            <span className="info-label">Pieces:</span>
            <span className="info-value">
              {gameStarted ? 
                `${difficultySettings[difficulty].rows * difficultySettings[difficulty].columns}` : 
                '0'}
            </span>
          </div>
          <div className="info-tile">
            <span className="info-label">Time:</span>
            <span className="info-value">{currentTime}</span>
          </div>
          <div className="info-tile">
            <span className="info-label">Status:</span>
            <span className="info-value">
              {!gameStarted ? 'Ready to start' : isComplete ? 'Completed!' : 'In progress...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleContainer;
