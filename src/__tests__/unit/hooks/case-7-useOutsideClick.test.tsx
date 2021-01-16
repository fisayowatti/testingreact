import React, { useRef, useState } from 'react'
import { render, fireEvent, getByText } from '@testing-library/react'

import useOutsideClick from '../../../hooks/useOutsideClick'

describe('The useOutsideClick hook', () => {
  const Panel = () => {
    const [showing, setShowing] = useState(false)
    const canvasRef = useRef(null)

    useOutsideClick(canvasRef, () => setShowing(!showing))

    return (
      <div>
        <button data-testid="outside">off canvas</button>
        <div ref={canvasRef} data-testid="inside">
          {showing ? 'CURRENTLY SHOWING' : 'CURRENTLY HIDDEN'}
        </div>
      </div>
    )
  }

  const PanelToggle = () => {
    const [showing, setShowing] = useState(true)

    return (
      <>
        <button
          data-testid="PanelToggleButton"
          onClick={() => setShowing(false)}
        >
          Toggle Panel
        </button>
        {showing ? <Panel /> : null}
      </>
    )
  }
  // This test is important if you are going to be creating libraries in future.
  // Very important to make sure the component is used the right way.
  // This test can be migrated in future, if the useOutsideClick
  // hook is moved to an external library at your company.
  it('calls the outside click handler when an outside click is initiated', () => {
    const { getByTestId } = render(<Panel />)

    const canvas = getByTestId('inside')

    expect(canvas).toHaveTextContent('CURRENTLY HIDDEN')

    fireEvent.click(getByTestId('outside'))

    expect(canvas).toHaveTextContent('CURRENTLY SHOWING')
  })

  it('cleans up the event listeners after component is unmounted', () => {
    const removeEventListener = jest.spyOn(document, 'removeEventListener')

    const { getByTestId } = render(<PanelToggle />)

    fireEvent.click(getByTestId('PanelToggleButton'))

    expect(removeEventListener).toHaveBeenCalled()
  })
})
