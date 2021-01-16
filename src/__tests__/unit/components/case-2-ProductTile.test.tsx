import React from 'react'
import { axe } from 'jest-axe'
import { queryByTestId, render } from '@testing-library/react'
import ProductTile from '../../../components/ProductTile'
import { Product } from '../../../types/Product'

describe('The <ProductTile /> component', () => {
  const defaultProductTileProps: Product = {
    id: 1,
    image: 'null',
    name: 'Nice product',
    price: '$15.00',
    brand: 'good brand',
    createdAt: 'string',
    isActive: false,
    isNew: false,
    isSoldOut: false,
    priceUnformatted: 15,
  }

  const setUpProductTile = (props = defaultProductTileProps) =>
    render(<ProductTile {...props} />)
  it('renders a product tile with name, image and price', () => {
    const { getByText, getByAltText } = setUpProductTile()

    expect(getByText(defaultProductTileProps.name)).toBeInTheDocument()
    expect(getByText(defaultProductTileProps.price)).toBeInTheDocument()
    expect(getByAltText(defaultProductTileProps.name)).toBeInTheDocument()
  })

  it('renders a product tile with name and price only', () => {
    const { queryByAltText, queryByTestId } = setUpProductTile({
      ...defaultProductTileProps,
      image: undefined,
    })

    expect(queryByAltText(defaultProductTileProps.name)).toBeNull()
    // expect(queryByTestId('ProductTileImage')).toBeNull()
  })

  it('has no accessibility violations', async () => {
    const { container } = setUpProductTile()

    expect(await axe(container)).toHaveNoViolations()
  })
})
