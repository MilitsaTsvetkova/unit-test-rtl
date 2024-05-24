import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExpandableText from '../../src/components/ExpandableText'

describe('ExpandableText', () => {
  const limit = 255
  const longText = 'a'.repeat(256)
  const truncatedText = longText.substring(0, limit) + '...'
  it('should render full text when it is short', () => {
    const text = 'Hello, World!'
    render(<ExpandableText text={text} />)
    expect(screen.getByText(text)).toBeInTheDocument()
  })
  it('should truncate text', () => {
    render(<ExpandableText text={longText} />)
    expect(screen.getByText(truncatedText)).toBeInTheDocument()

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(/more/i)
  })
  it('should expand text when show more button is clicked', async () => {
    userEvent.setup()
    render(<ExpandableText text={longText} />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(screen.getByText(longText)).toBeInTheDocument()
    expect(button).toHaveTextContent(/less/i)
  })
  it('should collapse text when show less button is clicked', async () => {
    userEvent.setup()
    render(<ExpandableText text={longText} />)
    const showMoreButton = screen.getByRole('button', { name: /more/i })
    await userEvent.click(showMoreButton)

    const showLessButton = screen.getByRole('button', { name: /less/i })
    await userEvent.click(showLessButton)

    expect(screen.getByText(truncatedText)).toBeInTheDocument()
    expect(showMoreButton).toHaveTextContent(/more/i)
  })
})
