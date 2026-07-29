import { useState } from 'react'
import { Heart, X, Zap, CheckCircle, TrendingUp } from 'lucide-react'
import { HEART_SHOP_ITEMS, MAX_HEARTS, buyHearts } from '../../data/hearts'
import { useStore } from '../../store/useStore'
import { playSfx } from '../../lib/sfx'
import BottomSheet from './BottomSheet'
import { useI18n } from '../../i18n'

interface HeartShopProps {
  open: boolean
  onClose: () => void
  onPurchased?: (heartsAdded: number) => void
}

export function HeartShop({ open, onClose, onPurchased }: HeartShopProps) {
  const { t } = useI18n()
  const { totalXP, addXP } = useStore()
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [result, setResult] = useState<{ hearts: number; remaining: number } | null>(null)

  if (!open) return null

  const handleBuy = (item: typeof HEART_SHOP_ITEMS[number]) => {
    if (purchasing) return
    setPurchasing(`buy-${item.hearts}`)

    // Simulate purchase delay for feel
    setTimeout(() => {
      const res = buyHearts(item.hearts, totalXP)
      if (res.success) {
        // Deduct XP via negative addXP (or directly set)
        addXP(-item.xpCost)
        playSfx('levelup')
        setResult({ hearts: res.heartsAdded, remaining: res.remainingXp })
        onPurchased?.(res.heartsAdded)
      }
      setPurchasing(null)
    }, 600)
  }

  const currentHearts = useStore.getState().hearts
  const canBuyMore = currentHearts < MAX_HEARTS

  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 to-rose-600 p-5 sm:p-6 text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center
              text-white hover:bg-white/30 transition-colors"
            aria-label={t('aria.close')}
          >
            <X size={16} />
          </button>
        </div>

        <div className="text-5xl mb-2">❤️</div>
        <h2 className="text-xl font-black text-white">Yurak Do'koni</h2>
        <p className="text-white/80 text-sm mt-1">
          Yuraklaringiz tugadimi? XP evaziga yangilarini oling!
        </p>
      </div>

      {/* Body */}
        <div className="p-5 space-y-3">
          {/* Current hearts */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                size={20}
                className={i < currentHearts ? 'text-red-500' : 'text-gray-200'}
                fill={i < currentHearts ? 'currentColor' : 'none'}
              />
            ))}
          </div>

          {/* Result message */}
          {result && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-center animate-pop-in">
              <CheckCircle size={20} className="text-green-500 mx-auto mb-1" />
              <p className="text-sm font-bold text-green-700 dark:text-green-400">
                +{result.hearts} yurak qo'shildi! 🎉
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Qolgan XP: {result.remaining.toLocaleString()}
              </p>
            </div>
          )}

          {/* Shop items */}
          {!result && (
            <div className="space-y-2">
              {HEART_SHOP_ITEMS.map((item) => {
                const affordable = totalXP >= item.xpCost
                const loading = purchasing === `buy-${item.hearts}`

                return (
                  <button
                    key={item.hearts}
                    onClick={() => handleBuy(item)}
                    disabled={!affordable || !canBuyMore || !!loading}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all relative
                      ${item.popular
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                        : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                      ${!affordable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      ${loading ? 'animate-pulse' : ''}
                    `}
                  >
                    {/* Popular badge */}
                    {item.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2
                        px-3 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500
                        text-white text-xs font-bold whitespace-nowrap shadow-lg">
                        ⭐ Eng yaxshi tanlov
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30
                      flex items-center justify-center shrink-0">
                      <Heart size={22} className="text-red-500" fill="currentColor" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {item.hearts} ta yurak
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          <Zap size={11} className="text-amber-500" />
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            {item.xpCost.toLocaleString()} XP
                          </span>
                        </div>
                        {'savedXp' in item && item.savedXp && (
                          <span className="text-xs text-green-500 font-semibold">
                            ({item.savedXp} XP tejash)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className={`px-4 py-1.5 rounded-xl text-xs font-bold
                      ${affordable
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}>
                      {loading ? '...' : affordable ? 'Sotib olish' : 'Yetarli XP yo\'q'}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Current XP */}
          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-gray-400">
            <TrendingUp size={13} />
            <span>Jami XP: <strong className="text-gray-700 dark:text-gray-300">{totalXP.toLocaleString()}</strong></span>
          </div>
        </div>
    </BottomSheet>
  )
}
