/**
 * @jest-environment jsdom
 */

import { checkWin } from '../botLogic'

describe('Bot Logic Utilities', () => {
  describe('checkWin function', () => {
    it('should return true for horizontal wins', () => {
      expect(checkWin([0, 1, 2])).toBe(true)
      expect(checkWin([3, 4, 5])).toBe(true)
      expect(checkWin([6, 7, 8])).toBe(true)
    })

    it('should return true for vertical wins', () => {
      expect(checkWin([0, 3, 6])).toBe(true)
      expect(checkWin([1, 4, 7])).toBe(true)
      expect(checkWin([2, 5, 8])).toBe(true)
    })

    it('should return true for diagonal wins', () => {
      // Main diagonal (top-left to bottom-right)
      expect(checkWin([0, 4, 8])).toBe(true)
      // Anti-diagonal (top-right to bottom-left)
      expect(checkWin([2, 4, 6])).toBe(true)
    })

    it('should return false for non-winning combinations', () => {
      // Random positions that don't form a line
      expect(checkWin([0, 1, 3])).toBe(false)
      expect(checkWin([0, 4, 7])).toBe(false)
      expect(checkWin([1, 3, 8])).toBe(false)
    })

    it('should return false for incomplete patterns', () => {
      // Only 2 positions (not enough for a win)
      expect(checkWin([0, 1])).toBe(false)
      expect(checkWin([4, 8])).toBe(false)
      
      // Only 1 position
      expect(checkWin([4])).toBe(false)
      expect(checkWin([])).toBe(false)
    })

    it('should work with moves in different order', () => {
      // Same winning positions but in different order
      expect(checkWin([2, 0, 1])).toBe(true)
      expect(checkWin([8, 4, 0])).toBe(true) 
      expect(checkWin([6, 2, 4])).toBe(true) 
    })

    it('should handle extra moves beyond winning pattern', () => {
      // Winning pattern plus extra moves
      expect(checkWin([0, 1, 2, 3, 4])).toBe(true) // Top row + extras
      expect(checkWin([0, 4, 8, 1, 5, 7])).toBe(true) // Main diagonal + extras
    })

    it('should handle duplicate positions', () => {
      expect(checkWin([0, 0, 1, 2])).toBe(true) 
      expect(checkWin([4, 4, 4])).toBe(false) 
    })

    describe('Edge cases', () => {
      it('should handle invalid board positions gracefully', () => {
        expect(checkWin([9, 10, 11])).toBe(false)
        expect(checkWin([-1, 0, 1])).toBe(false)
      })

      it('should handle very large arrays', () => {
        const largeMoveArray = Array.from({ length: 100 }, (_, i) => i)
        // Should still detect the winning pattern within the large array
        largeMoveArray.push(0, 1, 2) // Add winning pattern
        expect(checkWin(largeMoveArray)).toBe(true)
      })
    })

    describe('Performance', () => {
      it('should handle reasonable array sizes efficiently', () => {
        const start = Date.now()
        
        // Test with a reasonably large array
        const moves = Array.from({ length: 1000 }, (_, i) => i % 9)
        moves.push(0, 1, 2) // Add winning pattern
        
        const result = checkWin(moves)
        const end = Date.now()
        
        expect(result).toBe(true)
        expect(end - start).toBeLessThan(100) // Should complete in less than 100ms
      })
    })
  })

  describe('Win pattern validation', () => {
    it('should validate all possible win patterns exist', () => {
      const allWinPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
        [0, 4, 8], [2, 4, 6], // Diagonal
      ]

      allWinPatterns.forEach((pattern, index) => {
        expect(checkWin(pattern)).toBe(true)
      })
    })

    it('should ensure no false positives for near-miss patterns', () => {
      const nearMissPatterns = [
        [0, 1, 3], // Almost top row
        [0, 3, 7], // Almost left column
        [0, 4, 7], // Almost main diagonal
        [2, 4, 7], // Almost anti-diagonal
        [1, 4, 8], // Mixed positions
      ]

      nearMissPatterns.forEach((pattern) => {
        expect(checkWin(pattern)).toBe(false)
      })
    })
  })
})
