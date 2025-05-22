import React from 'react';
import { render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PuzzleBoard from '../components/PuzzleBoard';

// Mock the isPieceNearCorrectPosition function
jest.mock('../utils/puzzleUtils', () => ({
  isPieceNearCorrectPosition: jest.fn()
}));

// Import the mocked function
import { isPieceNearCorrectPosition } from '../utils/puzzleUtils';

describe('PuzzleBoard', () => {
  const mockPieces = [
    {
      id: 'piece-0-0',
      correctPosition: { row: 0, col: 0 },
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      isPlaced: false
    },
    {
      id: 'piece-0-1',
      correctPosition: { row: 0, col: 1 },
      x: 200,
      y: 50,
      width: 100,
      height: 100,
      isPlaced: true
    }
  ];

  const mockBoardSize = { width: 400, height: 400 };
  const mockImage = new Image();
  
  const mockOnPieceDrop = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders puzzle pieces', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <PuzzleBoard 
          pieces={mockPieces} 
          onPieceDrop={mockOnPieceDrop}
          boardSize={mockBoardSize}
          image={mockImage}
        />
      </DndProvider>
    );
    
    // Since we're mainly testing drag and drop behavior which requires manual interaction,
    // we'll just verify the component renders without errors
    expect(document.querySelector('.puzzle-board')).toBeInTheDocument();
  });

  // Testing the drop handler is challenging in a unit test environment
  // as it requires simulating the HTML5 drag and drop API
  test('board has proper dimensions', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <PuzzleBoard 
          pieces={mockPieces} 
          onPieceDrop={mockOnPieceDrop}
          boardSize={mockBoardSize}
          image={mockImage}
        />
      </DndProvider>
    );
    
    const board = document.querySelector('.puzzle-board');
    expect(board).toHaveStyle(`width: ${mockBoardSize.width}px`);
    expect(board).toHaveStyle(`height: ${mockBoardSize.height}px`);
  });
});
