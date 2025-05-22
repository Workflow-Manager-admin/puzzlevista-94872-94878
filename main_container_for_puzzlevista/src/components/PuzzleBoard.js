import React from 'react';
import { useDrop } from 'react-dnd';
import PuzzlePiece from './PuzzlePiece';
import { isPieceNearCorrectPosition } from '../utils/puzzleUtils';

// PUBLIC_INTERFACE
/**
 * PuzzleBoard - Component that renders the puzzle grid and handles piece placement
 * @param {Array} pieces - Array of puzzle piece objects
 * @param {Function} onPieceDrop - Function to handle piece drop events
 * @param {Object} boardSize - Object with width and height of the board
 * @param {Image} image - Source image for the puzzle
 */
const PuzzleBoard = ({ pieces, onPieceDrop, boardSize, image }) => {
  // Configure drop behavior for the entire board
  const boardRef = React.useRef(null);
  
  const [, drop] = useDrop({
    accept: 'PUZZLE_PIECE',
    drop: (item, monitor) => {
      const boardRect = boardRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      
      // Calculate position relative to the board
      if (clientOffset) {
        const position = {
          x: clientOffset.x - boardRect.left,
          y: clientOffset.y - boardRect.top,
        };
        
        // Check if the piece is near its correct position
        const piece = pieces.find(p => p.id === item.id);
        if (piece) {
          const shouldSnap = isPieceNearCorrectPosition(piece, position);
          
          // Update piece position and snapping status
          const finalPosition = shouldSnap
            ? {
                x: piece.correctPosition.col * piece.width,
                y: piece.correctPosition.row * piece.height,
                isPlaced: true
              }
            : {
                x: position.x - (piece.width / 2),
                y: position.y - (piece.height / 2),
                isPlaced: false
              };
          
          onPieceDrop(item.id, finalPosition);
        }
      }
      
      return { moved: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  // Handle when a piece is dropped
  const handlePieceDrop = (pieceId, newPosition) => {
    const piece = pieces.find(p => p.id === pieceId);
    if (piece) {
      // Check if piece is near its correct position for snapping
      const shouldSnap = isPieceNearCorrectPosition(piece, newPosition);
      
      // Update piece position and snapping status
      const finalPosition = shouldSnap
        ? {
            x: piece.correctPosition.col * piece.width,
            y: piece.correctPosition.row * piece.height,
            isPlaced: true
          }
        : {
            x: newPosition.x,
            y: newPosition.y,
            isPlaced: false
          };
      
      onPieceDrop(pieceId, finalPosition);
    }
  };

  // Styling for the puzzle board
  const boardStyle = {
    position: 'relative',
    width: `${boardSize.width}px`,
    height: `${boardSize.height}px`,
    backgroundColor: 'var(--ancient-papyrus)',
    border: '2px dashed var(--ancient-clay)',
    margin: '0 auto',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };
  
  // Grid overlay styling to show the puzzle grid
  const gridOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0
  };
  
  // Create grid lines based on the number of rows and columns
  const createGridLines = () => {
    if (!pieces.length) return null;
    
    const rowCount = Math.max(...pieces.map(p => p.correctPosition.row)) + 1;
    const colCount = Math.max(...pieces.map(p => p.correctPosition.col)) + 1;
    
    const gridLines = [];
    const pieceWidth = boardSize.width / colCount;
    const pieceHeight = boardSize.height / rowCount;
    
    // Create vertical lines
    for (let i = 1; i < colCount; i++) {
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={i * pieceWidth}
          y1="0"
          x2={i * pieceWidth}
          y2={boardSize.height}
          stroke="var(--ancient-clay)"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.3"
        />
      );
    }
    
    // Create horizontal lines
    for (let i = 1; i < rowCount; i++) {
      gridLines.push(
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * pieceHeight}
          x2={boardSize.width}
          y2={i * pieceHeight}
          stroke="var(--ancient-clay)"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.3"
        />
      );
    }
    
    return gridLines;
  };

  return (
    <div ref={drop} style={boardStyle} className="puzzle-board">
      <svg style={gridOverlayStyle}>
        {createGridLines()}
      </svg>
      
      {pieces.map(piece => (
        <PuzzlePiece
          key={piece.id}
          piece={piece}
          onDrop={handlePieceDrop}
          image={image}
        />
      ))}
    </div>
  );
};

export default PuzzleBoard;
