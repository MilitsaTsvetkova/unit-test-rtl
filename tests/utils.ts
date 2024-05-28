import { useAuth0, User } from '@auth0/auth0-react'
import { delay, http, HttpResponse } from 'msw'
import { server } from './mocks/server'

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay()
      HttpResponse.json([])
    })
  )
}

export const simulateError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()))
}

type AuthState = {
  isAuthenticated: boolean
  user: User | undefined
  isLoading: boolean
}

export const mockAuth = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue('mocked-access-token'),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  })
}
