import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import routes from '../src/routes'

describe('Router', () => {
  const navigateTo = (path: string) => {
    const router = createMemoryRouter(routes, { initialEntries: [path] })
    render(<RouterProvider router={router} />)
  }
  it('should render home page for the root route /', () => {
    navigateTo('/')
    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument()
  })
  it('should render products page for /products', () => {
    navigateTo('/products')
    expect(
      screen.getByRole('heading', { name: /products/i })
    ).toBeInTheDocument()
  })
})
