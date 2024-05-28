import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuantitySelector from '../../src/components/QuantitySelector'
import { Product } from '../../src/entities'
import { CartProvider } from '../../src/providers/CartProvider'

describe('QuantitySelector', () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: 'Product 1',
      price: 100,
      categoryId: 1,
    }
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    )
    const user = userEvent.setup()
    const getAddToCartButton = () =>
      screen.queryByRole('button', { name: /add to cart/i })
    const getQuantityControls = () => ({
      quantity: screen.queryByRole('status'),
      incrementButton: screen.queryByRole('button', { name: '+' }),
      decrementButton: screen.queryByRole('button', { name: '-' }),
    })
    return {
      addToCart: async () => {
        await user.click(getAddToCartButton()!)
      },
      increment: async () => {
        await user.click(getQuantityControls().incrementButton!)
      },
      decrement: async () => {
        await user.click(getQuantityControls().decrementButton!)
      },
      getAddToCartButton,
      getQuantityControls,
    }
  }
  it('should render add to cart button', () => {
    const { getAddToCartButton } = renderComponent()

    expect(getAddToCartButton()).toBeInTheDocument()
  })
  it('should add product to cart', async () => {
    const { addToCart, getAddToCartButton, getQuantityControls } =
      renderComponent()

    await addToCart()

    const { quantity, incrementButton, decrementButton } = getQuantityControls()
    expect(quantity).toHaveTextContent('1')
    expect(incrementButton).toBeInTheDocument()
    expect(decrementButton).toBeInTheDocument()
    expect(getAddToCartButton()).not.toBeInTheDocument()
  })

  it('should increment the quantity', async () => {
    const { addToCart, increment, getQuantityControls } = renderComponent()
    await addToCart()

    await increment()

    const { quantity } = getQuantityControls()
    expect(quantity).toHaveTextContent('2')
  })
  it('should decrement the quantity', async () => {
    const { addToCart, increment, decrement, getQuantityControls } =
      renderComponent()
    await addToCart()

    await increment()
    await decrement()

    const { quantity } = getQuantityControls()
    expect(quantity).toHaveTextContent('1')
  })
  it('should remove product from the cart', async () => {
    const { getAddToCartButton, addToCart, decrement, getQuantityControls } =
      renderComponent()

    await addToCart()
    await decrement()

    const { quantity, decrementButton, incrementButton } = getQuantityControls()
    expect(quantity).not.toBeInTheDocument()
    expect(decrementButton).not.toBeInTheDocument()
    expect(incrementButton).not.toBeInTheDocument()
    expect(getAddToCartButton()).toBeInTheDocument()
  })
})
