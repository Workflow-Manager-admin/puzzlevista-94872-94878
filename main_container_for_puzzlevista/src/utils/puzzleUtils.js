/**
 * Utility functions for puzzle operations
 */
import { shuffle } from 'lodash';

/**
 * Generate puzzle pieces from an image
 * @param {Image} image - The image to split into pieces
 * @param {number} rows - Number of rows in the puzzle grid
 * @param {number} columns - Number of columns in the puzzle grid
 * @param {number} boardWidth - Width of the puzzle board in pixels
 * @param {number} boardHeight - Height of the puzzle board in pixels
 * @returns {Array} Array of puzzle piece objects
 */
export const generatePuzzlePieces = (image, rows, columns, boardWidth, boardHeight) => {
  const pieces = [];
  const pieceWidth = boardWidth / columns;
  const pieceHeight = boardHeight / rows;
  const imageWidth = image.width;
  const imageHeight = image.height;
  
  // Calculate image scaling to fit the board
  const scaleX = imageWidth / boardWidth;
  const scaleY = imageHeight / boardHeight;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      pieces.push({
        id: `piece-${row}-${col}`,
        row,
        col,
        correctPosition: { row, col },
        x: col * pieceWidth,
        y: row * pieceHeight,
        width: pieceWidth,
        height: pieceHeight,
        imageX: col * pieceWidth * scaleX,
        imageY: row * pieceHeight * scaleY,
        imageWidth: pieceWidth * scaleX,
        imageHeight: pieceHeight * scaleY,
        isPlaced: false
      });
    }
  }
  
  return pieces;
};

/**
 * Shuffle puzzle pieces randomly
 * @param {Array} pieces - Array of puzzle piece objects
 * @param {number} boardWidth - Width of the puzzle board in pixels
 * @param {number} boardHeight - Height of the puzzle board in pixels
 * @returns {Array} Array of shuffled puzzle piece objects
 */
export const shufflePieces = (pieces, boardWidth, boardHeight) => {
  const shuffled = [...pieces];
  const positions = [];
  
  for (let i = 0; i < shuffled.length; i++) {
    let x, y, overlapping;
    const pieceWidth = shuffled[i].width;
    const pieceHeight = shuffled[i].height;
    
    // Try to find a non-overlapping position
    let attempts = 0;
    do {
      x = Math.random() * (boardWidth - pieceWidth);
      y = Math.random() * (boardHeight - pieceHeight);
      
      overlapping = positions.some(pos => 
        x < pos.x + pos.width && 
        x + pieceWidth > pos.x && 
        y < pos.y + pos.height && 
        y + pieceHeight > pos.y
      );
      
      attempts++;
      // Limit attempts to avoid infinite loop
    } while (overlapping && attempts < 100);
    
    // Update piece position
    shuffled[i] = {
      ...shuffled[i],
      x,
      y,
      isPlaced: false
    };
    
    // Add to positions array for overlap checking
    positions.push({ x, y, width: pieceWidth, height: pieceHeight });
  }
  
  return shuffled;
};

/**
 * Check if a puzzle piece is near its correct position
 * @param {Object} piece - Puzzle piece object
 * @param {Object} dropPosition - The position where the piece was dropped
 * @param {number} threshold - Distance threshold for snapping in pixels
 * @returns {boolean} True if the piece is near its correct position
 */
export const isPieceNearCorrectPosition = (piece, dropPosition, threshold = 20) => {
  const correctX = piece.correctPosition.col * piece.width;
  const correctY = piece.correctPosition.row * piece.height;
  
  const distance = Math.sqrt(
    Math.pow(dropPosition.x - correctX, 2) + 
    Math.pow(dropPosition.y - correctY, 2)
  );
  
  return distance < threshold;
};

/**
 * Check if all puzzle pieces are correctly placed
 * @param {Array} pieces - Array of puzzle piece objects
 * @returns {boolean} True if all pieces are correctly placed
 */
export const isPuzzleComplete = (pieces) => {
  return pieces.every(piece => piece.isPlaced);
};

/**
 * Calculate elapsed time in minutes and seconds
 * @param {number} startTime - Start time in milliseconds
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatElapsedTime = (startTime) => {
  if (!startTime) return '00:00';
  
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  
  return `${minutes}:${seconds}`;
};
