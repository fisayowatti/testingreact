import React from 'react'
import { axe } from 'jest-axe'
import { render, fireEvent } from '@testing-library/react'

import Checkbox from '../../../components/Checkbox'
import { prependOnceListener } from 'process'

/**
 * This checkbox component renders a checkbox with a label.
 * Since we customized the default checkbox, we want to
 * make sure it still works as a regular checkbox
 * should.
 */
describe('The <Checkbox /> component', () => {
  const defaultCheckboxProps = {
    label: 'string',
    id: 'string',
    checked: false,
    // background?: string
    // checkMarkBackground?: string
    // borderColor?: string
    onChange: jest.fn(),
  }

  const setUpCheckBox = (props = defaultCheckboxProps) =>
    render(<Checkbox {...props} />)

  it('Should render the label and checkbox the user will see', () => {
    const { asFragment } = setUpCheckBox()

    expect(asFragment()).toMatchSnapshot()
  })

  it('Should make the checkbox accessible by setting the id and htmlFor attributes on label and checkbox', () => {
    const { getByLabelText, debug } = setUpCheckBox()

    expect(getByLabelText(defaultCheckboxProps.label)).toBeInTheDocument()
  })

  it('Should call the onChange handler when it is provided', () => {
    const { getByLabelText } = setUpCheckBox()

    const checkbox = getByLabelText(defaultCheckboxProps.label)

    fireEvent.click(checkbox)

    expect(defaultCheckboxProps.onChange).toHaveBeenCalled()
  })

  it('Should change state correctly when clicked (checked and unchecked)', () => {
    const { getByLabelText } = setUpCheckBox({
      ...defaultCheckboxProps,
      checked: true,
    })

    expect(getByLabelText(defaultCheckboxProps.label)).toBeChecked()
  })

  it('Should not fail any accessibility tests', async () => {
    const { container } = setUpCheckBox()

    expect(await axe(container)).toHaveNoViolations()
  })
})
