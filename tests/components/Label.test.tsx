import { render, screen } from '@testing-library/react'
import Label from '../../src/components/Label'
import { LanguageProvider } from '../../src/providers/language/LanguageProvider'
import { Language } from '../../src/providers/language/type'

describe('Label', () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    )
  }
  describe('given the current language is Spanish', () => {
    it.each([
      { labelId: 'new_product', text: 'Nuevo Producto' },
      { labelId: 'welcome', text: 'Bienvenidos' },
      { labelId: 'edit_product', text: 'Editar Producto' },
    ])('should render text $text for label $labelId', ({ labelId, text }) => {
      renderComponent(labelId, 'es')
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
  describe('given the current language is English', () => {
    it.each([
      { labelId: 'new_product', text: 'New Product' },
      { labelId: 'welcome', text: 'Welcome' },
      { labelId: 'edit_product', text: 'Edit Product' },
    ])('should render text $text for label $labelId', ({ labelId, text }) => {
      renderComponent(labelId, 'en')
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
  it('should throw error if label id is not valid', () => {
    expect(() => renderComponent('invalid_label', 'en')).toThrowError()
  })
})
