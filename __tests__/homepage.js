/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'

describe('Homepage', () => {
  it('renders the welcome header', () => {
    render(<Home/>);

    const heading = screen.getByTestId('welcome');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Welcome to Checkmate");
  })
})