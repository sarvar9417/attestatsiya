import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ExamResultActions from './ExamResultActions'

describe('ExamResultActions', () => {
  it('provides the professional practice routes and a working restart control', () => {
    const onRestart = vi.fn()
    render(
      <MemoryRouter>
        <ExamResultActions
          examKind="pedagogik_15"
          backUrl="/professional-practice"
          onRestart={onRestart}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: 'Natijadan keyingi navigatsiya' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Bosh sahifa' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Testlarga qaytish' }).getAttribute('href')).toBe('/professional-practice')
    expect(screen.getByRole('link', { name: 'Nazariyani o‘rganish' }).getAttribute('href')).toBe('/learn/M15')
    expect(screen.getByRole('link', { name: 'Natijalar tarixi' }).getAttribute('href')).toBe('/history')

    fireEvent.click(screen.getByRole('button', { name: 'Yangi sinov' }))
    expect(onRestart).toHaveBeenCalledTimes(1)
  })

  it('falls back to the learning catalog and opens the selected module theory', () => {
    render(
      <MemoryRouter>
        <ExamResultActions examKind="mavzu" moduleId="M01" onRestart={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Bo‘limga qaytish' }).getAttribute('href')).toBe('/learn')
    expect(screen.getByRole('link', { name: 'Nazariyani o‘rganish' }).getAttribute('href')).toBe('/learn/M01')
  })
})
