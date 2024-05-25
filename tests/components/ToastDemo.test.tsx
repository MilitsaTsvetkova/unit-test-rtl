import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'
import ToastDemo from '../../src/components/ToastDemo'

describe('ToastDemo', () => {
  it('should render correctly', async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    )
    const button = screen.getByRole('button')
    userEvent.setup()
    await userEvent.click(button)
    const toast = await screen.findByText(/success/i)
    expect(toast).toBeInTheDocument()
  })
})
