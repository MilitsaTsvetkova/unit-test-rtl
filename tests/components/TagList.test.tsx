import { render, screen } from '@testing-library/react'
import TagList from '../../src/components/TagList'

describe('TagList', () => {
  it('should render correctly', async () => {
    render(<TagList />)

    // await waitFor(() => {
    //   const listItems = screen.getAllByRole('listitem')
    //   expect(listItems.length).toBeGreaterThan(0)
    // })

    await screen.findAllByRole('listitem').then((listItems) => {
      expect(listItems.length).toBeGreaterThan(0)
    })
  })
})
