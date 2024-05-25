import { Theme } from '@radix-ui/themes'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderStatusSelector from '../../src/components/OrderStatusSelector'

describe('OrderStatusSelector', () => {
  const renderComponent = () => {
    const onChange = vi.fn()
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    )
    return {
      button: screen.getByRole('combobox'),
      //lazy evaluation
      getOptions: () => screen.findAllByRole('option'),
      user: userEvent.setup(),
      onChange,
      getOption: (label: RegExp) =>
        screen.findByRole('option', { name: label }),
    }
  }
  it('should render correctly with initial state', () => {
    const { button } = renderComponent()

    expect(button).toHaveTextContent(/new/i)
  })
  it('should render correct statuses', async () => {
    const { button, getOptions, user } = renderComponent()

    await user.click(button)

    const options = await getOptions()
    expect(options).toHaveLength(3)
    const labels = options.map((option) => option.textContent)
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled'])
  })

  //parametrized test
  it.each([
    { value: 'processed', label: /processed/i },
    { value: 'fulfilled', label: /fulfilled/i },
  ])(
    'should call onChange with $value when $label option is selected',
    async ({ value, label }) => {
      const { button, onChange, user, getOption } = renderComponent()

      await user.click(button)

      const option = await getOption(label)
      await user.click(option)
      expect(onChange).toHaveBeenCalledWith(value)
    }
  )

  it("should call onChange with 'new' when /new/i option is selected", async () => {
    const { button, getOption, user, onChange } = renderComponent()

    await user.click(button)

    const processedOption = await getOption(/processed/i)
    await user.click(processedOption)

    await user.click(button)

    const newOption = await getOption(/new/i)
    await user.click(newOption)

    expect(onChange).toHaveBeenCalledWith('new')
  })
})
