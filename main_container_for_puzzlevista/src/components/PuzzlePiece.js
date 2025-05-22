import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';

// PUBLIC_INTERFACE
/**
 * PuzzlePiece - Individual draggable puzzle piece component
 * @param {Object} piece - Object containing piece data
 * @param {Function} onDrop - Function to handle piece drop
 * @param {Image} image - Source image for the puzzle
 */
const PuzzlePiece = ({ piece, onDrop, image }) => {
  const ref = useRef(null);

  // Configure drag behavior
  const [{ isDragging }, drag] = useDrag({
    type: 'PUZZLE_PIECE',
    item: { ...piece, id: piece.id },
    // We're no longer calculating position here as PuzzleBoard now handles this
=======
  // Configure drag behavior
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Apply drag ref to the element
  drag(ref);

  // Create canvas with the piece's portion of the image
  const renderPieceCanvas = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = piece.width;
    canvas.height = piece.height;
    
    // Draw the piece portion from the source image
    if (image && image.complete) {
      ctx.drawImage(
        image,
        piece.imageX,
        piece.imageY,
        piece.imageWidth,
        piece.imageHeight,
        0,
        0,
        piece.width,
        piece.height
      );
      
      // Add a border to make pieces more visible
      ctx.strokeStyle = piece.isPlaced ? '#D4AF37' : '#4A3C2C';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, piece.width, piece.height);
    }
    
    return canvas.toDataURL();
  };

  // Styling for the puzzle piece
  const pieceStyle = {
    position: 'absolute',
    width: `${piece.width}px`,
    height: `${piece.height}px`,
    left: `${piece.x}px`,
    top: `${piece.y}px`,
    cursor: 'move',
    backgroundImage: `url(${renderPieceCanvas()})`,
    backgroundSize: 'cover',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : (piece.isPlaced ? 1 : 10),
    boxShadow: piece.isPlaced 
      ? '0 0 5px #D4AF37' 
      : isDragging 
        ? '0 0 15px rgba(0,0,0,0.3)' 
        : '0 2px 5px rgba(0,0,0,0.2)',
    transition: isDragging ? 'none' : 'box-shadow 0.3s ease',
  };

  return (
    <div
      ref={ref}
      style={pieceStyle}
      className="puzzle-piece"
    />
  );
};

export default PuzzlePiece;
