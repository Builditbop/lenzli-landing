import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import LenzliLanding from '../pages/Landing.jsx'

// Mock IntersectionObserver
const mockIntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = mockIntersectionObserver

describe('LenzliLanding', () => {
  it('renders hero heading', () => {
    render(
      <BrowserRouter>
        <LenzliLanding />
      </BrowserRouter>
    )
    expect(screen.getByText(/Connect\. Collaborate\. Create\./i)).toBeInTheDocument()
  })

  it('has a waitlist form', () => {
    render(
      <BrowserRouter>
        <LenzliLanding />
      </BrowserRouter>
    )
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
  })

  it('shows saving state on submit', async () => {
    render(
      <BrowserRouter>
        <LenzliLanding />
      </BrowserRouter>
    )
    const input = screen.getByPlaceholderText(/enter your email/i)
    const button = screen.getByRole('button', { name: /^join$/i })
    
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)
    
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
})