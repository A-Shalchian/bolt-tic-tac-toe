/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { useGameStore } from '../index'

// Mock Zustand to reset state between tests
const initialStoreState = useGameStore.getState()

beforeEach(() => {
  useGameStore.setState(initialStoreState)
})

describe('Game Store', () => {
  describe('Game Phase State', () => {
    it('should have correct initial phase and game mode', () => {
      const { result } = renderHook(() => useGameStore())
      
      expect(result.current.phase).toBe('mainMenu')
      expect(result.current.gameMode).toBe(null)
    })

    it('should update phase correctly', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setPhase('difficultySelection')
      })
      
      expect(result.current.phase).toBe('difficultySelection')
    })

    it('should update game mode correctly', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setGameMode('single')
      })
      
      expect(result.current.gameMode).toBe('single')
    })
  })

  describe('Player State', () => {
    it('should have correct initial player state', () => {
      const { result } = renderHook(() => useGameStore())
      
      expect(result.current.currentPlayer).toBe('X')
      expect(result.current.player1).toEqual({ name: 'Player 1', symbol: 'X' })
      expect(result.current.player2).toEqual({ name: 'Player 2', symbol: 'O' })
      expect(result.current.player1Char).toBe(null)
      expect(result.current.player2Char).toBe(null)
    })

    it('should update current player', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setCurrentPlayer('O')
      })
      
      expect(result.current.currentPlayer).toBe('O')
    })

    it('should update player information', () => {
      const { result } = renderHook(() => useGameStore())
      
      const newPlayer1 = { name: 'Alice', symbol: '🔥' }
      
      act(() => {
        result.current.setPlayer1(newPlayer1)
      })
      
      expect(result.current.player1).toEqual(newPlayer1)
    })

    it('should update player characters', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setPlayer1Char('🎯')
        result.current.setPlayer2Char('⚡')
      })
      
      expect(result.current.player1Char).toBe('🎯')
      expect(result.current.player2Char).toBe('⚡')
    })
  })

  describe('Game Settings State', () => {
    it('should have correct initial settings', () => {
      const { result } = renderHook(() => useGameStore())
      
      expect(result.current.difficulty).toBe('medium')
      expect(result.current.timeLimit).toBe(30)
      expect(result.current.isTimed).toBe(false)
      expect(result.current.timed).toBe(false)
      expect(result.current.multiplayerTimer).toBe(30)
      expect(result.current.boardSize).toBe(3)
      expect(result.current.winCondition).toBe(3)
    })

    it('should update difficulty', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setDifficulty('hard')
      })
      
      expect(result.current.difficulty).toBe('hard')
    })

    it('should update time settings with aliases', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setTimeLimit(60)
      })
      
      expect(result.current.timeLimit).toBe(60)
      expect(result.current.multiplayerTimer).toBe(60)
    })

    it('should update timed settings with aliases', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setIsTimed(true)
      })
      
      expect(result.current.isTimed).toBe(true)
      expect(result.current.timed).toBe(true)
    })

    it('should update board settings', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setBoardSize(5)
        result.current.setWinCondition(4)
      })
      
      expect(result.current.boardSize).toBe(5)
      expect(result.current.winCondition).toBe(4)
    })
  })

  describe('Score State', () => {
    it('should have correct initial scores', () => {
      const { result } = renderHook(() => useGameStore())
      
      expect(result.current.player1Score).toBe(0)
      expect(result.current.player2Score).toBe(0)
    })

    it('should set scores directly', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setPlayer1Score(5)
        result.current.setPlayer2Score(3)
      })
      
      expect(result.current.player1Score).toBe(5)
      expect(result.current.player2Score).toBe(3)
    })

    it('should increment scores', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.incrementPlayer1Score()
        result.current.incrementPlayer1Score()
        result.current.incrementPlayer2Score()
      })
      
      expect(result.current.player1Score).toBe(2)
      expect(result.current.player2Score).toBe(1)
    })

    it('should reset scores', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Set some scores first
      act(() => {
        result.current.setPlayer1Score(10)
        result.current.setPlayer2Score(8)
      })
      
      expect(result.current.player1Score).toBe(10)
      expect(result.current.player2Score).toBe(8)
      
      // Reset scores
      act(() => {
        result.current.resetScores()
      })
      
      expect(result.current.player1Score).toBe(0)
      expect(result.current.player2Score).toBe(0)
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete game flow state changes', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Start game
      act(() => {
        result.current.setGameMode('single')
        result.current.setPhase('difficultySelection')
        result.current.setDifficulty('hard')
      })
      
      expect(result.current.gameMode).toBe('single')
      expect(result.current.phase).toBe('difficultySelection')
      expect(result.current.difficulty).toBe('hard')
      
      // Configure players
      act(() => {
        result.current.setPlayer1({ name: 'Human', symbol: 'X' })
        result.current.setPlayer2({ name: 'AI', symbol: 'O' })
        result.current.setPhase('game')
      })
      
      expect(result.current.player1.name).toBe('Human')
      expect(result.current.player2.name).toBe('AI')
      expect(result.current.phase).toBe('game')
      
      // Play some rounds
      act(() => {
        result.current.incrementPlayer1Score()
        result.current.incrementPlayer2Score()
        result.current.incrementPlayer1Score()
      })
      
      expect(result.current.player1Score).toBe(2)
      expect(result.current.player2Score).toBe(1)
    })
  })
})
