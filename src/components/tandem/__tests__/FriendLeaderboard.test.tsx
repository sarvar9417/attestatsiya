// ═══════════════════════════════════════════════════════════════════════════
// FriendLeaderboard.test.tsx — Do'stlar reytingi komponenti testlari
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'

const { mockGetLeaderboard, mockGetEloLeaderboard } = vi.hoisted(() => ({ mockGetLeaderboard: vi.fn(), mockGetEloLeaderboard: vi.fn() }))

vi.mock('../../../services/tandemService', () => ({ getFriendLeaderboard: mockGetLeaderboard, getEloLeaderboard: mockGetEloLeaderboard }))

vi.mock('../../../utils/eloRating', () => ({ getEloTierInfo: () => ({ emoji: '🥉', name: 'Bronze', tier: 'bronze', minRating: 0, maxRating: 999 }) }))

import FriendLeaderboard from '../FriendLeaderboard'
import type { LeaderboardEntry } from '../../../services/tandemService'

function entry(over: Partial<LeaderboardEntry> = {}): LeaderboardEntry {
  return { userId: 'u1', name: 'Ali', level: 'B1', totalXP: 500, streak: 5, isCurrentUser: false, ...over }
}

beforeEach(() => mockGetLeaderboard.mockReset())
afterEach(() => cleanup())

describe('FriendLeaderboard', () => {
  it('shows spinner while loading', async () => {
    let resolve!: (v: LeaderboardEntry[]) => void
    mockGetLeaderboard.mockReturnValue(new Promise<LeaderboardEntry[]>((r) => { resolve = r }))
    const { container } = render(<FriendLeaderboard />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    resolve([])  // dangling promise qoldirmaymiz
    await waitFor(() => expect(container.querySelector('.animate-spin')).not.toBeInTheDocument())
  })

  it('renders nothing when there are no entries', async () => {
    mockGetLeaderboard.mockResolvedValue([])
    const { container } = render(<FriendLeaderboard />)
    await waitFor(() => expect(container.querySelector('.animate-spin')).not.toBeInTheDocument())
    expect(container.firstChild).toBeNull()
  })

  it('renders entries with names, "Siz" badge and footer stats', async () => {
    mockGetLeaderboard.mockResolvedValue([
      entry({ userId: 'me', name: 'Me', totalXP: 900, streak: 10, isCurrentUser: true }),
      entry({ userId: 'u2', name: 'Bob', totalXP: 400, streak: 3 }),
    ])
    render(<FriendLeaderboard />)

    expect(await screen.findByText('Me')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Siz')).toBeInTheDocument()        // joriy foydalanuvchi belgisi
    expect(screen.getByText(/Eng yuqori:/)).toBeInTheDocument() // footer
    expect(screen.getByText(/ta o'yinchi/)).toBeInTheDocument()
  })

  it('shows only top 5 by default and expands on "Hammasi"', async () => {
    const many = Array.from({ length: 7 }, (_, i) =>
      entry({ userId: 'u' + i, name: 'Player' + i, totalXP: 1000 - i * 100 }))
    mockGetLeaderboard.mockResolvedValue(many)
    render(<FriendLeaderboard />)

    expect(await screen.findByText('Player0')).toBeInTheDocument()
    expect(screen.queryByText('Player5')).not.toBeInTheDocument() // 6-chi yashirin

    fireEvent.click(screen.getByText('Hammasi'))
    expect(screen.getByText('Player5')).toBeInTheDocument()
    expect(screen.getByText('Player6')).toBeInTheDocument()
  })
})
