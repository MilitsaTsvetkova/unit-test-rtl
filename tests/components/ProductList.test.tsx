import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import ProductList from '../../src/components/ProductList'
import { db } from '../mocks/db'
import { server } from '../mocks/server'

describe('ProductList', () => {
  const productIds: number[] = []
  beforeAll(() =>
    [1, 2, 3].forEach(() => {
      const product = db.product.create()
      productIds.push(product.id)
    })
  )
  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } })
  })
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
  it('should render an error message when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()))
    render(<ProductList />)

    const message = await screen.findByText(/error/i)
    expect(message).toBeInTheDocument()
  })
})
