import { render, screen } from '@testing-library/react'
import UserAccount from '../../src/components/UserAccount'
import { User } from '../../src/entities'

describe('UserAccount', () => {
  it('should render edit button if user is admin', () => {
    render(<UserAccount user={{ name: 'John Doe', isAdmin: true, id: 123 }} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(/edit/i)
  })
  it('should not render edit button if user is not admin', () => {
    render(<UserAccount user={{ name: 'John Doe', id: 123 }} />)
    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
  })
  it('should render user name', () => {
    const user: User = { name: 'John Doe', id: 123 }
    render(<UserAccount user={user} />)

    expect(screen.getByText(user.name)).toBeInTheDocument()
  })
})

//queryByRole - not to throw exception
//expect().not.ToBeInTheDocument
