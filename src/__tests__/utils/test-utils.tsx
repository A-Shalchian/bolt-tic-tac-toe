import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import '@testing-library/jest-dom'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Common test helpers
export const createMockGameState = (overrides = {}) => ({
  phase: 'mainMenu',
  gameMode: null,
  currentPlayer: 'X',
  player1: { name: 'Player 1', symbol: 'X' },
  player2: { name: 'Player 2', symbol: 'O' },
  player1Char: null,
  player2Char: null,
  difficulty: 'medium',
  timeLimit: 30,
  isTimed: false,
  timed: false,
  multiplayerTimer: 30,
  boardSize: 3,
  winCondition: 3,
  player1Score: 0,
  player2Score: 0,
  ...overrides,
})

// Mock functions for testing
export const createMockFunctions = () => ({
  setPhase: jest.fn(),
  setGameMode: jest.fn(),
  setCurrentPlayer: jest.fn(),
  setPlayer1: jest.fn(),
  setPlayer2: jest.fn(),
  setPlayer1Char: jest.fn(),
  setPlayer2Char: jest.fn(),
  setDifficulty: jest.fn(),
  setTimeLimit: jest.fn(),
  setIsTimed: jest.fn(),
  setTimed: jest.fn(),
  setMultiplayerTimer: jest.fn(),
  setBoardSize: jest.fn(),
  setWinCondition: jest.fn(),
  setPlayer1Score: jest.fn(),
  setPlayer2Score: jest.fn(),
  incrementPlayer1Score: jest.fn(),
  incrementPlayer2Score: jest.fn(),
  resetScores: jest.fn(),
})

// Helper to wait for async operations
export const waitFor = (callback: () => void, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const check = () => {
      try {
        callback()
        resolve(true)
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error)
        } else {
          setTimeout(check, 10)
        }
      }
    }
    check()
  })
}
