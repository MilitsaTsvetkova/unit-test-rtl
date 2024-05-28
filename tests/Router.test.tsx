import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import routes from '../src/routes'
import { db } from './mocks/db'

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
  it('should render the product details page for /products/:id', async () => {
    const product = db.product.create()

    navigateTo('/products/' + product.id)
    expect(
      await screen.findByRole('heading', { name: product.name })
    ).toBeInTheDocument()

    db.product.delete({ where: { id: { equals: product.id } } })
  })
  it('should render the  not found page for invalid routes', () => {
    navigateTo('/test')
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
})
