import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import ProductList from '../../src/components/ProductList'
import { server } from '../mocks/server'

describe('ProductList', () => {
  it('should render the list of products', async () => {
    render(<ProductList />)
    const items = await screen.findAllByRole('listitem')
    expect(items.length).toBeGreaterThanOrEqual(0)
  })
  it('should render no product available if no product is found', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])))
    render(<ProductList />)

    const message = await screen.findByText(/no products/i)
    expect(message).toBeInTheDocument()
  })
})