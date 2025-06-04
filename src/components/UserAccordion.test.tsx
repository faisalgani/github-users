import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, it, expect } from 'vitest'

import UserAccordion from './UserAccordion'
import * as userStore from '../store/userStore'
import * as userRepoStore from '../store/userRepo'
import * as githubService from '../services/githubService'
import * as utility from '../tools/utility'

// Mocks
vi.mock('../store/userStore')
vi.mock('../store/userRepo')
vi.mock('../services/githubService')
vi.mock('../tools/utility')

describe('UserAccordion', () => {
  const mockUsers = [
    { id: 1, login: 'user1' },
    { id: 2, login: 'user2' }
  ]

  const mockRepos = [
    { name: 'repo1', description: 'desc1', stargazers_count: 10 },
    { name: 'repo2', description: 'desc2', stargazers_count: 5 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(userStore, 'useUserStore').mockReturnValue({
      users: mockUsers
    })

    vi.spyOn(userRepoStore, 'useUserRepoStore').mockReturnValue({
      userRepo: [],
      setUserRepo: vi.fn(),
      clearUserRepo: vi.fn()
    })

    // Mock utility
    vi.mock('../tools/utility', () => ({
        default: {
            responseCode: vi.fn(() => true)
        }
    }))
  })

  it('shows "No users found" when user list is empty', () => {
    vi.spyOn(userStore, 'useUserStore').mockReturnValue({ users: [] })

    render(<UserAccordion />)
    expect(screen.getByText(/no users found/i)).toBeInTheDocument()
  })

  it('renders accordion for each user', () => {
    render(<UserAccordion />)

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('user2')).toBeInTheDocument()
  })

  it('calls getUserRepos on accordion expand and sets repos', async () => {
    const setUserRepoMock = vi.fn()
    vi.spyOn(userRepoStore, 'useUserRepoStore').mockReturnValue({
      userRepo: [],
      setUserRepo: setUserRepoMock,
      clearUserRepo: vi.fn()
    })

    vi.spyOn(githubService, 'getUserRepos').mockResolvedValue({
      status: 200,
      data: mockRepos
    })

    render(<UserAccordion />)

    const user1Accordion = screen.getByText('user1')
    fireEvent.click(user1Accordion)

    await waitFor(() => {
      expect(githubService.getUserRepos).toHaveBeenCalledWith('user1')
      expect(setUserRepoMock).toHaveBeenCalledWith(mockRepos)
    })
  })

  it('displays repositories when userRepo has data', () => {
    vi.spyOn(userRepoStore, 'useUserRepoStore').mockReturnValue({
      userRepo: mockRepos,
      setUserRepo: vi.fn(),
      clearUserRepo: vi.fn()
    })

    render(<UserAccordion />)

    fireEvent.click(screen.getByText('user1'))

    expect(screen.getByText('repo1')).toBeInTheDocument()
    expect(screen.getByText('repo2')).toBeInTheDocument()
    expect(screen.getByText('desc1')).toBeInTheDocument()
    expect(screen.getByText('desc2')).toBeInTheDocument()
    expect(screen.getAllByText('10')[0]).toBeInTheDocument()
    expect(screen.getAllByText('5')[0]).toBeInTheDocument()
  })

  it('shows "No repo found" if userRepo is empty', () => {
    vi.spyOn(userRepoStore, 'useUserRepoStore').mockReturnValue({
      userRepo: [],
      setUserRepo: vi.fn(),
      clearUserRepo: vi.fn()
    })

    render(<UserAccordion />)

    fireEvent.click(screen.getByText('user1'))

    expect(screen.getByText(/no repo found/i)).toBeInTheDocument()
  })
})
