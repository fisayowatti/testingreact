import React from 'react'
import { Axios } from '../../helpers/axios'
import { render, fireEvent, act, waitFor } from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { build, fake } from '@jackfranklin/test-data-bot'

import App from '../../components/App'
import { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'

jest.mock('../../helpers/axios')

const mockAxios = Axios as any

const ProductBuilder = build('Product', {
  fields: {
    id: fake((f) => f.random.number()),
    image: fake((f) => f.image.imageUrl()),
    name: fake((f) => f.lorem.words()),
    price: fake((f) => `from $${f.random.number(100)}`),
  },
})

describe('The app ', () => {
  const setUpApp = () =>
    render(
      <StoreProvider store={createStore()}>
        <FiltersWrapper>
          <App />
        </FiltersWrapper>
      </StoreProvider>,
    )

  //this is to prevent ap calls in tests from being corrupted by api calls in previous tests
  afterEach(() => jest.clearAllMocks())

  test('it fetches and renders all products on the page', async () => {
    mockAxios.get.mockResolvedValue({
      data: [ProductBuilder(), ProductBuilder()],
    })

    const { findAllByTestId } = setUpApp()

    expect(await findAllByTestId('ProductTile')).toHaveLength(2)
  })

  test('it can open and close the filters panel', async () => {
    const { getByText, queryByText } = setUpApp()

    expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument()

    fireEvent.click(getByText(/filter/i))

    expect(queryByText(/reset to defaults/i)).toBeInTheDocument()

    fireEvent.click(getByText(/view results/i))

    expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument()
  })

  test('it can search products as the user types in the search field', async () => {
    jest.useFakeTimers()
    mockAxios.get
      .mockResolvedValueOnce({
        data: [
          ProductBuilder(),
          ProductBuilder(),
          ProductBuilder(),
          ProductBuilder(),
          ProductBuilder(),
        ],
      })
      .mockResolvedValueOnce({
        data: [ProductBuilder(), ProductBuilder()],
      })

    const { findAllByTestId, getByText, getByPlaceholderText } = setUpApp()

    expect(await findAllByTestId('ProductTile')).toHaveLength(5)

    fireEvent.click(getByText(/filter/i))

    const searchBox = getByPlaceholderText(/largo/i)

    fireEvent.change(searchBox, {
      target: {
        value: 'searching',
      },
    })

    act(() => jest.runAllTimers())

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2))

    expect(await findAllByTestId('ProductTile')).toHaveLength(2)
  })
})
