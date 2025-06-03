import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { UserAccordion } from './UserAccordion'

import * as userStoreModule from '../store/userStore'
import * as userRepoStoreModule from '../store/userRepo'
import * as githubService from '../services/githubService'
import utility from '../tools/utility'

// Mock store hookss
vi.mock('../store/userStore')
vi.mock('../store/userRepo')
vi.mock('../services/githubService')
vi.mock('../tools/utility')

describe('UserAccordion Component', () => {
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

    vi.spyOn(userStoreModule, 'useUserStore').mockReturnValue({
      users: mockUsers
    })

    vi.spyOn(userRepoStoreModule, 'useUserRepoStore').mockReturnValue({
      userRepo: [],
      setUserRepo: vi.fn(),
      clearUserRepo: vi.fn()
    })

    vi.spyOn(utility, 'default').mockReturnValue(true)
    vi.spyOn(utility, 'responseCode').mockReturnValue(true)
  })

  it('shows no users message when users list is empty', () => {
    vi.spyOn(userStoreModule, 'useUserStore').mockReturnValue({
      users: []
    })

    render(<UserAccordion />)
    expect(screen.getByText(/no users found/i)).toBeInTheDocument()
  })

  it('renders user accordions', () => {
    render(<UserAccordion />)
    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('user2')).toBeInTheDocument()
  })

  it('calls getUserRepos on accordion expand and sets userRepo', async () => {
    const setUserRepoMock = vi.fn()
    vi.spyOn(userRepoStoreModule, 'useUserRepoStore').mockReturnValue({
      userRepo: [],
      setUserRepo: setUserRepoMock,
      clearUserRepo: vi.fn()
    })

    const mockResponse = {
      status: 200,
      data: mockRepos
    }

    vi.mocked(githubService.getUserRepos).mockResolvedValue(mockResponse)
    vi.spyOn(utility, 'responseCode').mockReturnValue(true)

    render(<UserAccordion />)

    const accordionSummary = screen.getByText('user1')
    fireEvent.click(accordionSummary)

    await waitFor(() => {
      expect(githubService.getUserRepos).toHaveBeenCalledWith('user1')
      expect(setUserRepoMock).toHaveBeenCalledWith(mockRepos)
    })
  })

  it('displays repos when userRepo has data', () => {
    vi.spyOn(userRepoStoreModule, 'useUserRepoStore').mockReturnValue({
      userRepo: mockRepos,
      setUserRepo: vi.fn(),
      clearUserRepo: vi.fn()
    })

    vi.spyOn(userStoreModule, 'useUserStore').mockReturnValue({
      users: mockUsers
    })

    render(<UserAccordion />)

    // Expand first accordion to show repos
    const accordionSummary = screen.getByText('user1')
    fireEvent.click(accordionSummary)

    // Check repo names and stars
    expect(screen.getByText('repo1')).toBeInTheDocument()
    expect(screen.getByText('repo2')).toBeInTheDocument()
    expect(screen.getAllByText('10')[0]).toBeInTheDocument()
    expect(screen.getAllByText('5')[0]).toBeInTheDocument()
  })

  it('shows "No repo found !" if userRepo is empty', () => {
    vi.spyOn(userRepoStoreModule, 'useUserRepoStore').mockReturnValue({
      userRepo: [],
      setUserRepo: vi.fn(),
      clearUserRepo: vi.fn()
    })

    vi.spyOn(userStoreModule, 'useUserStore').mockReturnValue({
      users: mockUsers
    })

    render(<UserAccordion />)

    // Expand accordion to show message
    const accordionSummary = screen.getByText('user1')
    fireEvent.click(accordionSummary)

    expect(screen.getByText(/no repo found/i)).toBeInTheDocument()
  })
})
