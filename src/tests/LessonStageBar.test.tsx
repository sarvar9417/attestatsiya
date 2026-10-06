import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LessonStageBar from '../components/learning/LessonStageBar'

describe('LessonStageBar', () => {
  it('nazariya bosqichini joriy holat sifatida ko‘rsatadi', () => {
    render(
      <LessonStageBar
        phase="theory"
        moduleTitle="Axborot va raqamli savodxonlik"
        topicTitle="Axborot hajmi"
        moduleCode="M01"
        topicIndex={1}
        topicCount={12}
        onBack={() => {}}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Axborot hajmi' }),
    ).toBeDefined()
    expect(screen.getByText('2 / 12 mavzu')).toBeDefined()
    expect(
      screen.getByText('O‘rganish').closest('[aria-current="step"]'),
    ).not.toBeNull()
  })

  it('natija bosqichida oldingi bosqichlarni tugallangan ko‘rsatadi', () => {
    render(
      <LessonStageBar
        phase="result"
        moduleTitle="Axborot va raqamli savodxonlik"
        topicTitle="Axborot hajmi"
        moduleCode="M01"
        onBack={() => {}}
      />,
    )

    expect(
      screen.getByText('Natija').closest('[aria-current="step"]'),
    ).not.toBeNull()
    expect(screen.getByText('O‘rganish').parentElement?.textContent).toContain(
      'O‘rganish',
    )
  })

  it('orqaga tugmasi caller callbackini chaqiradi', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()

    render(
      <LessonStageBar
        phase="test"
        moduleTitle="Axborot va raqamli savodxonlik"
        topicTitle="Axborot hajmi"
        moduleCode="M01"
        onBack={onBack}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Mavzular ro‘yxatiga qaytish' }),
    )

    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
