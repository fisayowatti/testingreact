import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import useFilters from '../../../hooks/useFilters'

import { FiltersContext } from '../../../context/filters'
import { FiltersWrapper } from '../../../components/FiltersWrapper'

describe('The <FiltersWrapper /> component', () => {
  it('should render all children passed to it', () => {
    const { getByTestId } = render(
      <FiltersWrapper>
        <p data-testid="TestParagraph">Hello there</p>
      </FiltersWrapper>,
    )

    expect(getByTestId('TestParagraph')).toBeInTheDocument()
  })

  const trueMsg = 'CURRENTLY TRUE'
  const falseMsg = 'CURRENTLY FALSE'
  const setUpFiltersWrapper = () =>
    render(
      <FiltersWrapper>
        <FiltersContext.Consumer>
          {({ showingFilters, toggleShowingFilters }) => {
            return (
              <button onClick={toggleShowingFilters}>
                {showingFilters ? trueMsg : falseMsg}
              </button>
            )
          }}
        </FiltersContext.Consumer>
      </FiltersWrapper>,
    )

  it('should update the filters context with correct state values', () => {
    const { getByText } = setUpFiltersWrapper()

    expect(getByText(falseMsg)).toBeInTheDocument()

    fireEvent.click(getByText(falseMsg))

    expect(getByText(trueMsg)).toBeInTheDocument()

    //the following call is just to set it back to its default state so the next it() can use it
    fireEvent.click(getByText(trueMsg))
  })

  it('should update the body style to prevent scrolling when filter is toggled', () => {
    const { getByText } = setUpFiltersWrapper()

    expect(document.body.style.overflow).toBe('scroll')

    fireEvent.click(getByText(falseMsg))

    expect(document.body.style.overflow).toBe('hidden')
  })
})
