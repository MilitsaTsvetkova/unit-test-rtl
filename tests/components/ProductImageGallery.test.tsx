import { render, screen } from '@testing-library/react'
import ProductImageGallery from '../../src/components/ProductImageGallery'

describe('ProductImageGallery', () => {
  it('should not render element when image url list is empty', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
  it('should render list of images', () => {
    const imageUrls = ['image1.jpg', 'image2.jpg']
    render(<ProductImageGallery imageUrls={imageUrls} />)
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(imageUrls.length)
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url)
    })
  })
})
