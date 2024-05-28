import { render, screen } from '@testing-library/react'
import AuthStatus from '../../src/components/AuthStatus'
import { mockAuth } from '../utils'

describe('AuthStatus', () => {
  const renderComponent = () => {
    render(<AuthStatus />)
    return {
      getLogInButton: () => screen.queryByRole('button', { name: /log in/i }),
      getLogOutButton: () => screen.queryByRole('button', { name: /log out/i }),
      getLoadingMessage: () => screen.getByText(/loading/i),
    }
  }
  it('should render loading message while fetching the authentication status', () => {
    mockAuth({ isAuthenticated: false, user: undefined, isLoading: true })
    const { getLoadingMessage } = renderComponent()
    expect(getLoadingMessage()).toBeInTheDocument()
  })
  it('should render login button if user is not authenticated', () => {
    mockAuth({ isAuthenticated: false, user: undefined, isLoading: false })
    const { getLogInButton, getLogOutButton } = renderComponent()
    expect(getLogInButton()).toBeInTheDocument()
    expect(getLogOutButton()).not.toBeInTheDocument()
  })
  it('should render user name if user has authenticated successfully', () => {
    mockAuth({
      isAuthenticated: true,
      user: { name: 'John' },
      isLoading: false,
    })
    const { getLogInButton, getLogOutButton } = renderComponent()
    expect(screen.getByText(/john/i)).toBeInTheDocument()
    expect(getLogOutButton()).toBeInTheDocument()
    expect(getLogInButton()).not.toBeInTheDocument()
  })
})
