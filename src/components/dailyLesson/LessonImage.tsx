import { getLessonImageUrl } from '../../lib/lessonImages'

interface Props {
  filename: string
  title: string
}

export default function LessonImage({ filename, title }: Props) {
  const src = getLessonImageUrl(filename)

  if (!src) return null

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <img
        src={src}
        alt={`${title} — vizual tushuntirish`}
        className="w-full h-auto object-contain"
        loading="lazy"
      />
    </div>
  )
}
