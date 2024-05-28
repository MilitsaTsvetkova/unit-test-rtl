/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toaster } from 'react-hot-toast'
import ProductForm from '../../src/components/ProductForm'
import { Category, Product } from '../../src/entities'
import AllProviders from '../AllProviders'
import { db } from '../mocks/db'

describe('ProductForm', () => {
  let category: Category

  beforeAll(() => {
    category = db.category.create()
  })

  afterAll(() => {
    db.category.delete({
      where: { id: { equals: category.id } },
    })
  })

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn()
    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} /> <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    )
    const user = userEvent.setup()
    return {
      onSubmit,
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole('alert')
        expect(error).toBeInTheDocument()
        expect(error).toHaveTextContent(errorMessage)
      },
      waitFoFormToLoad: async () => {
        await screen.findByRole('form')

        const name = screen.getByPlaceholderText(/name/i)
        const price = screen.getByPlaceholderText(/price/i)
        const categoryInput = screen.getByRole('combobox', {
          name: /category/i,
        })
        const submitButton = screen.getByRole('button', { name: /submit/i })

        type FormData = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [K in keyof Product]: any
        }
        const validData: FormData = {
          name: 'Product 1',
          price: 100,
          id: 1,
          categoryId: category.id,
        }
        const fill = async (product: FormData) => {
          if (product.name !== undefined) await user.type(name, product.name)

          if (product.price !== undefined)
            await user.type(price, product.price.toString())

          await user.tab()
          await user.click(categoryInput)
          const options = screen.getAllByRole('option')
          await user.click(options[0])
          await user.click(submitButton)
        }

        return {
          name,
          price,
          categoryInput,
          submitButton,
          fill,
          validData,
          user,
        }
      },
    }
  }
  it('should render form fields', async () => {
    const { waitFoFormToLoad } = renderComponent()
    const { name, price, categoryInput } = await waitFoFormToLoad()
    expect(name).toBeInTheDocument()
    expect(price).toBeInTheDocument()
    expect(categoryInput).toBeInTheDocument()
  })
  it('should render categories after fetching them', async () => {
    const { waitFoFormToLoad } = renderComponent()
    const { user } = await waitFoFormToLoad()

    const combobox = screen.queryByRole('combobox')

    expect(combobox).toBeInTheDocument()
    await user.click(combobox!)

    expect(
      screen.getByRole('option', {
        name: category.name,
      })
    ).toBeInTheDocument()
  })

  it('should populate form fields when editing a product', async () => {
    const product: Product = {
      id: 1,
      name: 'Product 1',
      price: 100,
      categoryId: category.id,
    }
    const { waitFoFormToLoad } = renderComponent(product)

    const { name, price, categoryInput } = await waitFoFormToLoad()
    expect(name).toHaveValue(product.name)
    expect(price).toHaveValue(product.price.toString())
    expect(categoryInput).toHaveTextContent(category.name)
  })
  it('should put focus on the name field', async () => {
    const { waitFoFormToLoad } = renderComponent()

    const { name } = await waitFoFormToLoad()
    expect(name).toHaveFocus()
  })
  it.each([
    { scenario: 'missing', errorMessage: /required/i },
    {
      scenario: 'longer than 255 characters',
      name: 'a'.repeat(256),
      errorMessage: /255/,
    },
  ])(
    'should display an error if name is $scenario',
    async ({ name, errorMessage }) => {
      const { waitFoFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent()

      const form = await waitFoFormToLoad()

      await form.fill({ ...form.validData, name })

      expectErrorToBeInTheDocument(errorMessage)
    }
  )
  it.each([
    { scenario: 'missing', errorMessage: /required/i },
    {
      scenario: 'less than or equal to 1000',
      price: 1101,
      errorMessage: /less than or equal/i,
    },
    {
      scenario: 'greater than or equal to 1',
      price: 0,
      errorMessage: /greater than or equal/i,
    },
    {
      scenario: 'not a number',
      price: 'a',
      errorMessage: /required/i,
    },
  ])(
    'should display an error if price is $scenario',
    async ({ price, errorMessage }) => {
      const { waitFoFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent()

      const form = await waitFoFormToLoad()
      await form.fill({ ...form.validData, price })

      expectErrorToBeInTheDocument(errorMessage)
    }
  )

  it('should call onSubmit with the correct data', async () => {
    const { waitFoFormToLoad, onSubmit } = renderComponent()

    const form = await waitFoFormToLoad()
    await form.fill(form.validData)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
    const { id, ...rest } = form.validData
    expect(onSubmit).toHaveBeenCalledWith(rest)
  })
  it('should display a toast if submission fails', async () => {
    const { waitFoFormToLoad, onSubmit } = renderComponent()
    onSubmit.mockRejectedValueOnce(new Error('An unexpected error occurred'))

    const form = await waitFoFormToLoad()
    await form.fill(form.validData)

    const toast = await screen.findByRole('status')
    expect(toast).toHaveTextContent(/error/i)
  })
  it('should disable the submit button upon submission', async () => {
    const { waitFoFormToLoad, onSubmit } = renderComponent()
    onSubmit.mockReturnValue(new Promise(() => {}))

    const form = await waitFoFormToLoad()
    await form.fill(form.validData)

    expect(form.submitButton).toBeDisabled()
  })

  it('should re-enable submit button after submission', async () => {
    const { waitFoFormToLoad, onSubmit } = renderComponent()
    onSubmit.mockResolvedValue({})

    const form = await waitFoFormToLoad()
    await form.fill(form.validData)

    expect(form.submitButton).not.toBeDisabled()
  })
  it('should re-enable submit button if submission fails', async () => {
    const { waitFoFormToLoad, onSubmit } = renderComponent()
    onSubmit.mockRejectedValue('error')

    const form = await waitFoFormToLoad()
    await form.fill(form.validData)

    expect(form.submitButton).not.toBeDisabled()
  })

  it('should reset form after submission', async () => {
    const { waitFoFormToLoad } = renderComponent()

    const form = await waitFoFormToLoad()

    await form.fill(form.validData)

    expect(form.name).toHaveValue('')
    expect(form.price).toHaveValue('')
  })
})
