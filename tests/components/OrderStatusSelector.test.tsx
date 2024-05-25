import { Theme } from '@radix-ui/themes'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderStatusSelector from '../../src/components/OrderStatusSelector'

describe('OrderStatusSelector', () => {
  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    )
    return {
      button: screen.getByRole('combobox'),
      //lazy evaluation
      getOptions: () => screen.findAllByRole('option'),
    }
  }
  it('should render correctly with initial state', () => {
    const { button } = renderComponent()

    expect(button).toHaveTextContent(/new/i)
  })
  it('should render correct statuses', async () => {
    const { button, getOptions } = renderComponent()

    const user = userEvent.setup()
    await user.click(button)

    const options = await getOptions()
    expect(options).toHaveLength(3)
    const labels = options.map((option) => option.textContent)
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled'])
  })
})
