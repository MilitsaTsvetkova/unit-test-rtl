import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TermsAndConditions from '../../src/components/TermsAndConditions'

describe('TermsAndConditions', () => {
  const renderComponent = () => {
    render(<TermsAndConditions />)

    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button'),
    }
  }
  it('should render correctly with initial state', () => {
    const { heading, checkbox, button } = renderComponent()

    expect(heading).toHaveTextContent('Terms & Conditions')
    expect(checkbox).not.toBeChecked()
    expect(button).toBeDisabled()
  })

  it('should enable button when checkbox is checked', async () => {
    userEvent.setup()
    const { checkbox, button } = renderComponent()

    await userEvent.click(checkbox)

    expect(button).toBeEnabled()
  })
})
