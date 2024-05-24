import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBox from '../../src/components/SearchBox'

describe('SearchBox', () => {
  const renderComponent = () => {
    const onChange = vi.fn()
    render(<SearchBox onChange={onChange} />)

    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
      user: userEvent.setup(),
    }
  }
  it('should render input field for searching', () => {
    const { input } = renderComponent()

    expect(input).toBeInTheDocument()
  })
  it('should invoke onChange when enter is pressed', async () => {
    const { input, onChange, user } = renderComponent()

    const searchTerm = 'hello'
    await user.type(input, searchTerm + '{enter}')

    expect(onChange).toHaveBeenCalledWith(searchTerm)
  })
  it('should not invoke onChange if input field is empty', async () => {
    const { input, onChange, user } = renderComponent()

    await user.type(input, '{enter}')

    expect(onChange).not.toHaveBeenCalled()
  })
})
