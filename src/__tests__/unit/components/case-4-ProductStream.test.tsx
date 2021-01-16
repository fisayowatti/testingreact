import React from 'react'
import { axe } from 'jest-axe'
import { render } from '@testing-library/react'
import ProductStream from '../../../components/ProductStream'

describe('The <ProductStream /> component', () => {
  const defaultProducts = [
    {
      id: 1,
      image: 'string',
      name: 'string',
      price: 'string',
      brand: 'string',
      createdAt: 'string',
      isActive: false,
      isNew: false,
      isSoldOut: false,
      priceUnformatted: 2,
    },
    {
      id: 2,
      image: 'string',
      name: 'string',
      price: 'string',
      brand: 'string',
      createdAt: 'string',
      isActive: false,
      isNew: false,
      isSoldOut: false,
      priceUnformatted: 3,
    },
  ]

  it('renders a list of Product tiles for each product passed to it', async () => {
    const { getAllByTestId } = render(
      <ProductStream products={defaultProducts as any} />,
    )

    expect(getAllByTestId('ProductTile')).toHaveLength(defaultProducts.length)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ProductStream products={defaultProducts as any} />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
