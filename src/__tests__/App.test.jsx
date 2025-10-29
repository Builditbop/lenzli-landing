import { render, screen } from '@testing-library/react'
import React from 'react'
import App from '../App.jsx'

describe('LenzliLanding', () => {
  it('renders hero heading', () => {
    render(<App />)
    expect(screen.getByText(/Connect\. Collaborate\. Create\./i)).toBeInTheDocument()
  })

  it('has a waitlist form', () => {
    render(<App />)
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
  })

  it('shows success message after submit', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/enter your email/i)
    const button = screen.getByRole('button', { name: /join waitlist/i })
    input.value = 'test@example.com'
    button.click()
    expect(screen.getByText(/You’re on the list!/i)).toBeInTheDocument()
  })
})
