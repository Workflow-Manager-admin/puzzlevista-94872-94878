import { isPieceNearCorrectPosition, isPuzzleComplete } from '../utils/puzzleUtils';

describe('Puzzle Utils', () => {
  describe('isPieceNearCorrectPosition', () => {
    test('should return true when piece is near correct position', () => {
      // Mock piece with correctPosition at row 1, col 2
      const mockPiece = {
        correctPosition: { row: 1, col: 2 },
        width: 100,
        height: 100
      };

      // Position close to the correct position (within threshold)
      const closePosition = {
        x: 195, // Slightly off from 200 (col 2 * 100)
        y: 105  // Slightly off from 100 (row 1 * 100)
      };

      const result = isPieceNearCorrectPosition(mockPiece, closePosition);
      expect(result).toBe(true);
    });

    test('should return false when piece is far from correct position', () => {
      // Mock piece with correctPosition at row 1, col 2
      const mockPiece = {
        correctPosition: { row: 1, col: 2 },
        width: 100,
        height: 100
      };

      // Position far from the correct position (beyond threshold)
      const farPosition = {
        x: 250, // Far from 200 (col 2 * 100)
        y: 150  // Far from 100 (row 1 * 100)
      };

      const result = isPieceNearCorrectPosition(mockPiece, farPosition);
      expect(result).toBe(false);
    });

    test('should use dynamic threshold based on piece size', () => {
      // Mock piece with correctPosition at row 1, col 2
      const mockPiece = {
        correctPosition: { row: 1, col: 2 },
        width: 200, // Larger piece
        height: 200
      };

      // Position that would be too far with default threshold but should pass with dynamic threshold
      const position = {
        x: 420, // Position for col 2 would be 400
        y: 220  // Position for row 1 would be 200
      };

      // With our dynamic threshold calculation (25% of piece size), threshold would be 50
      // Distance is approximately 45, so it should snap
      const result = isPieceNearCorrectPosition(mockPiece, position);
      expect(result).toBe(true);
    });
  });

  describe('isPuzzleComplete', () => {
    test('should return true when all pieces are placed', () => {
      const pieces = [
        { id: '1', isPlaced: true },
        { id: '2', isPlaced: true },
        { id: '3', isPlaced: true }
      ];

      const result = isPuzzleComplete(pieces);
      expect(result).toBe(true);
    });

    test('should return false when some pieces are not placed', () => {
      const pieces = [
        { id: '1', isPlaced: true },
        { id: '2', isPlaced: false }, // Not placed
        { id: '3', isPlaced: true }
      ];

      const result = isPuzzleComplete(pieces);
      expect(result).toBe(false);
    });
  });
});
