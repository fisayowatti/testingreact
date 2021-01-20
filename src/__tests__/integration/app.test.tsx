import React from 'react'
import { Axios } from '../../helpers/axios'
import {
  render,
  fireEvent,
  act,
  waitFor,
  findByText,
} from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { productBuilder } from '../utils'

import App from '../../components/App'
import { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../../helpers/axios')

const mockAxios = Axios as any

describe('The app ', () => {
  const setupApp = (
    routerProps = {
      initialEntries: ['/', '/products/1'],
      initialIndex: 0,
    },
  ) =>
    render(
      <StoreProvider store={createStore()}>
        <MemoryRouter {...routerProps}>
          <FiltersWrapper>
            <App />
          </FiltersWrapper>
        </MemoryRouter>
      </StoreProvider>,
    )

  afterEach(() => jest.clearAllMocks())

  test('it fetches and renders all products on the page', async () => {
    mockAxios.get.mockResolvedValue({
      data: [productBuilder(), productBuilder()],
    })
    const { findAllByTestId } = setupApp()

    expect(await findAllByTestId('ProductTile')).toHaveLength(2)
  })

  test('it can open and close the filters panel', async () => {
    const { getByText, queryByText } = setupApp()

    const filterButton = getByText(/filter/i)

    expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument()

    fireEvent.click(filterButton)

    expect(queryByText(/reset to defaults/i)).toBeInTheDocument()

    fireEvent.click(getByText(/view results/i))

    expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument()
    expect(queryByText(/view results/i)).not.toBeInTheDocument()
  })

  test('it can search products as user types in the search field', async () => {
    jest.useFakeTimers()
    mockAxios.get
      //fetches the products in the shopping cart
      .mockResolvedValueOnce({
        data: [productBuilder()],
      })
      //fetches all the products on the homepage
      .mockResolvedValueOnce({
        data: [
          productBuilder(),
          productBuilder(),
          productBuilder(),
          productBuilder(),
          productBuilder(),
        ],
      })
      //searches products
      .mockResolvedValueOnce({
        data: [productBuilder(), productBuilder()],
      })
    const { findAllByTestId, getByText, getByPlaceholderText } = setupApp()

    expect(await findAllByTestId('ProductTile')).toHaveLength(5)

    fireEvent.click(getByText(/filter/i))

    const searchBox = getByPlaceholderText(/largo/i)

    fireEvent.change(searchBox, {
      target: {
        value: 'searching',
      },
    })

    act(() => {
      jest.runAllTimers()
    })

    // shopping cart, products home page, search products
    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(3))

    expect(await findAllByTestId('ProductTile')).toHaveLength(2)
  })

  test('it can navigate to the single product page', async () => {
    const product = productBuilder()

    mockAxios.get.mockImplementation((url: string) => {
      console.log('>> URL', url)
      return new Promise((resolve) => {
        if (url === `products/${product.id}`) {
          return resolve({
            data: product,
          })
        }
        return resolve({
          data: [product],
        })
      })
    })

    const { findByTestId, findByText } = setupApp()

    const link = await findByTestId('ProductTileLink')

    fireEvent.click(link)

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(3))

    expect(await findByText(product.price)).toBeInTheDocument()
  })

  test('it can add a product to cart', async () => {
    const [product1, product2, product3] = [
      productBuilder(),
      productBuilder(),
      productBuilder(),
    ]

    mockAxios.get.mockImplementation((url: string) => {
      return new Promise((resolve) => {
        if (url === `cart`) {
          return resolve({
            data: [],
          })
        }

        if (url === `products/${product1.id}`) {
          return resolve({
            data: product1,
          })
        }

        return resolve({
          data: [product1, product2, product3],
        })
      })
    })

    mockAxios.post.mockResolvedValue({
      data: [product1],
    })

    const { findByTestId, findByText, getByText } = setupApp({
      initialEntries: ['/', `/products/${product1.id}`],
      initialIndex: 1,
    })

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2))

    await findByText(product1.price)

    fireEvent.click(getByText(/add to cart/i))

    await waitFor(() => expect(mockAxios.post).toHaveBeenCalledTimes(1))

    expect(getByText(/remove from cart/i)).toBeInTheDocument()

    expect(await findByTestId('CartButton')).toHaveTextContent('Cart (1)')

    // debug()
  })

  test('❌it can remove a product from cart', async () => {})

  test('❌it can go through and complete the checkout flow', async () => {})
})
