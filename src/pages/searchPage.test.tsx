import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import SearcPages from './searchPage'
import type { AxiosResponse } from 'axios'
import * as userStoreModule from '../store/userStore'

// Mock store
vi.mock('../store/userStore', () => ({
  useUserStore: () => ({
    users: [],
    setUsers: vi.fn(),
    clearUsers: vi.fn()
  })
}))

// Mock utility
vi.mock('../tools/utility', () => ({
  default: {
    responseCode: vi.fn(() => true)
  }
}))

// Mock API
vi.mock('../services/githubService', () => ({
  searchUsers: vi.fn()
}))

import { useUserStore } from '../store/userStore'
import utility from '../tools/utility'
import { searchUsers } from '../services/githubService'

describe('SearcPages Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders input and button', () => {
    render(<SearcPages />)
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('does nothing when input is empty and Search is clicked', async () => {
    render(<SearcPages />)
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(searchUsers).not.toHaveBeenCalled()
  })

it('calls searchUsers and sets result on success', async () => {
  const mockSetUsers = vi.fn()
  const mockClearUsers = vi.fn()

  // Pakai spyOn untuk mock useUserStore
  vi.spyOn(userStoreModule, 'useUserStore').mockReturnValue({
    users: [],
    setUsers: mockSetUsers,
    clearUsers: mockClearUsers
  })

  const mockResponse: AxiosResponse = {
    data: {
      total_count: 2,
      items: [
        { login: 'user1', id: 1 },
        { login: 'user2', id: 2 }
      ]
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  }

  vi.mocked(searchUsers).mockResolvedValue(mockResponse)

  render(<SearcPages />)

  fireEvent.change(screen.getByPlaceholderText('Enter username'), {
    target: { value: 'react' }
  })

  fireEvent.click(screen.getByRole('button', { name: /search/i }))

  await waitFor(() => {
    expect(searchUsers).toHaveBeenCalledWith('react', 5, 5)
    expect(mockSetUsers).toHaveBeenCalledWith([
      { login: 'user1', id: 1 },
      { login: 'user2', id: 2 }
    ])
    expect(screen.getByText(/showing users of: "react"/i)).toBeInTheDocument()
  })
})
 it('sets error when total_count is 0', async () => {
  const mockClearUsers = vi.fn()
  const mockSetUsers = vi.fn()

  // Spy on useUserStore and override return value dynamically
  vi.spyOn(userStoreModule, 'useUserStore').mockReturnValue({
    users: [],
    setUsers: mockSetUsers,
    clearUsers: mockClearUsers
  })

  const mockEmptyResponse: AxiosResponse = {
    data: {
      total_count: 0,
      items: []
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  }

  vi.mocked(searchUsers).mockResolvedValue(mockEmptyResponse)

  render(<SearcPages />)

  fireEvent.change(screen.getByPlaceholderText('Enter username'), {
    target: { value: 'unknownuser' }
  })

  fireEvent.click(screen.getByRole('button', { name: /search/i }))

  await waitFor(() => {
    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
    expect(mockClearUsers).toHaveBeenCalled()
  })
})

test('shows error message on fetch failure', async () => {
  vi.spyOn(userStoreModule, 'useUserStore').mockReturnValue({
    users: [],
    setUsers: vi.fn(),
    clearUsers: vi.fn()
  })

  vi.mocked(searchUsers).mockRejectedValue(new Error('Something went wrong'))

  render(<SearcPages />)

  fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
    target: { value: 'invaliduser' }
  })
  fireEvent.click(screen.getByRole('button', { name: /search/i }))

  const errorMessage = await screen.findByText(/something went wrong/i)
  expect(errorMessage).toBeInTheDocument()
})
})
