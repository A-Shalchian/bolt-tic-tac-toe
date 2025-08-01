/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '../../__tests__/utils/test-utils'
import { Game } from '../Game'
import { useGameStore } from '@/store'

jest.mock('../shared/MainMenu', () => ({
  MainMenu: ({ onModeSelect }: { onModeSelect: (mode: string) => void }) => (
    <div data-testid="main-menu">
      <button onClick={() => onModeSelect('single')}>Single Player</button>
      <button onClick={() => onModeSelect('multi')}>Multiplayer</button>
    </div>
  ),
}))

jest.mock('../SinglePlayerGame/SinglePlayerGame', () => ({
  SinglePlayerGame: () => <div data-testid="single-player-game">Single Player Game</div>,
}))

jest.mock('../MultiPlayerGame/MultiPlayerGame', () => ({
  MultiPlayerGame: () => <div data-testid="multiplayer-game">Multiplayer Game</div>,
}))

jest.mock('../PageTitleManager', () => ({
  PageTitleManager: () => <div data-testid="page-title-manager" />,
}))

const mockStore = {
  gameMode: null,
  setGameMode: jest.fn(),
  setPhase: jest.fn(),
}

jest.mock('@/store', () => ({
  useGameStore: jest.fn(),
}))

const mockedUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>

describe('Game Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseGameStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore as unknown as ReturnType<typeof useGameStore.getState>)
      }
      return mockStore
    })
  })

  describe('Main Menu State', () => {
    it('should render main menu when no game mode is selected', () => {
      mockStore.gameMode = null
      
      render(<Game />)
      
      expect(screen.getByTestId('main-menu')).toBeInTheDocument()
      expect(screen.getByTestId('page-title-manager')).toBeInTheDocument()
      expect(screen.queryByTestId('single-player-game')).not.toBeInTheDocument()
      expect(screen.queryByTestId('multiplayer-game')).not.toBeInTheDocument()
    })

    it('should handle single player mode selection', () => {
      mockStore.gameMode = null
      
      render(<Game />)
      
      const singlePlayerButton = screen.getByText('Single Player')
      fireEvent.click(singlePlayerButton)
      
      expect(mockStore.setGameMode).toHaveBeenCalledWith('single')
      expect(mockStore.setPhase).toHaveBeenCalledWith('difficultySelection')
    })

    it('should handle multiplayer mode selection', () => {
      mockStore.gameMode = null
      
      render(<Game />)
      
      const multiplayerButton = screen.getByText('Multiplayer')
      fireEvent.click(multiplayerButton)
      
      expect(mockStore.setGameMode).toHaveBeenCalledWith('multi')
      expect(mockStore.setPhase).toHaveBeenCalledWith('timeOptionSelection')
    })
  })

  describe('Single Player Game State', () => {
    it('should render single player game when single mode is selected', async () => {
      mockStore.gameMode = 'single'
      
      render(<Game />)
      
      // Should show loading state initially for lazy loaded component
      expect(screen.getByText('Loading Single Player Game...')).toBeInTheDocument()
      expect(screen.getByTestId('page-title-manager')).toBeInTheDocument()
      expect(screen.queryByTestId('main-menu')).not.toBeInTheDocument()
      expect(screen.queryByTestId('multiplayer-game')).not.toBeInTheDocument()
      
      // Wait for lazy component to load (in test environment, it loads immediately)
      await waitFor(() => {
        expect(screen.queryByText('Loading Single Player Game...')).not.toBeInTheDocument()
      })
    })
  })

  describe('Multiplayer Game State', () => {
    it('should render multiplayer game when multi mode is selected', async () => {
      mockStore.gameMode = 'multi'
      
      render(<Game />)
      
      // Should show loading state initially for lazy loaded component
      expect(screen.getByText('Loading Multiplayer Game...')).toBeInTheDocument()
      expect(screen.getByTestId('page-title-manager')).toBeInTheDocument()
      expect(screen.queryByTestId('main-menu')).not.toBeInTheDocument()
      expect(screen.queryByTestId('single-player-game')).not.toBeInTheDocument()
      
      // Wait for lazy component to load (in test environment, it loads immediately)
      await waitFor(() => {
        expect(screen.queryByText('Loading Multiplayer Game...')).not.toBeInTheDocument()
      })
    })
  })

  describe('PageTitleManager Integration', () => {
    it('should always include PageTitleManager component', () => {
      // Test with main menu
      mockStore.gameMode = null
      const { rerender } = render(<Game />)
      expect(screen.getByTestId('page-title-manager')).toBeInTheDocument()
      
      // Test with single player
      mockStore.gameMode = 'single'
      rerender(<Game />)
      expect(screen.getByTestId('page-title-manager')).toBeInTheDocument()
      
      // Test with multiplayer
      mockStore.gameMode = 'multi'
      rerender(<Game />)
      expect(screen.getByTestId('page-title-manager')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle undefined game mode gracefully', () => {
      mockStore.gameMode = undefined as unknown as typeof mockStore.gameMode
      
      expect(() => render(<Game />)).not.toThrow()
      expect(screen.getByTestId('main-menu')).toBeInTheDocument()
    })

    it('should handle invalid game mode gracefully', () => {
      mockStore.gameMode = 'invalid' as unknown as typeof mockStore.gameMode
      
      render(<Game />)
      
      // Should not render any game components for invalid mode
      expect(screen.queryByTestId('single-player-game')).not.toBeInTheDocument()
      expect(screen.queryByTestId('multiplayer-game')).not.toBeInTheDocument()
      
      // Should fall back to main menu for invalid modes
      expect(screen.getByTestId('main-menu')).toBeInTheDocument()
      expect(screen.getByTestId('page-title-manager')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      mockStore.gameMode = null
      
      render(<Game />)
      
      // The component should render without accessibility violations
      // This is a basic test - in a real app, you'd use @testing-library/jest-dom
      // with more specific accessibility testing tools
      expect(screen.getByTestId('main-menu')).toBeInTheDocument()
    })
  })
})
