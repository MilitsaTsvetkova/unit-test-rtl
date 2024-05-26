import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'
import ProductDetail from '../../src/components/ProductDetail'
import { db } from '../mocks/db'
import { server } from '../mocks/server'

describe('ProductDetail', () => {
  let productId: number
  beforeAll(() => {
    const product = db.product.create()
    productId = product.id
  })
  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } })
  })
  it('should render product details', async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    })
    render(<ProductDetail productId={productId} />)

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument()
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument()
  })
  it('should render message if product not found', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null)))
    render(<ProductDetail productId={1} />)

    const message = await screen.findByText(/not found/i)
    expect(message).toBeInTheDocument()
  })
  it('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />)

    const message = await screen.findByText(/invalid/i)
    expect(message).toBeInTheDocument()
  })
  it('should render an error message when there is an error', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()))
    render(<ProductDetail productId={1} />)

    const message = await screen.findByText(/error/i)
    expect(message).toBeInTheDocument()
  })

  it('should show loading indicator ', async () => {
    server.use(
      http.get('/products/1', async () => {
        await delay()
        return HttpResponse.json(null)
      })
    )
    render(<ProductDetail productId={1} />)
    expect(await screen.findByText(/loading/i)).toBeInTheDocument()
  })

  it('should remove loading indicator after data is fetched', async () => {
    render(<ProductDetail productId={1} />)
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })

  it('should remove loading indicator if data fetching fails', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()))
    render(<ProductDetail productId={1} />)
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })
})
