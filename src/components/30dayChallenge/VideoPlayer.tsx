import { useState } from 'react'
import { Film, Loader } from 'lucide-react'

interface Props {
  youtubeId: string
  title: string
}

export default function VideoPlayer({ youtubeId, title }: Props) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="rounded-2xl overflow-hidden bg-gray-900 shadow-xl">
      {/* Skeleton loading */}
      {isLoading && (
        <div className="relative pb-[56.25%] h-0 bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader size={32} className="mx-auto mb-2 text-gray-500 animate-spin" />
              <p className="text-xs text-gray-500">Video yuklanmoqda...</p>
            </div>
          </div>
          {/* Shimmer */}
          <div className="absolute inset-0 skeleton-shimmer opacity-30" />
        </div>
      )}

      <div className={`relative pb-[56.25%] h-0 ${isLoading ? 'hidden' : ''}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Video info */}
      <div className="p-3 bg-gray-900/95 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <Film size={14} className="text-red-400 shrink-0" />
          <p className="text-xs text-gray-400 truncate">{title}</p>
        </div>
      </div>
    </div>
  )
}
