const imageModules: Record<string, { default: string }> = import.meta.glob(
  '/src/lesson_images/*.{png,jpg,jpeg,gif,webp,svg}',
  { eager: true, query: '?url' },
)

export function getLessonImageUrl(filename: string): string | undefined {
  const key = `/src/lesson_images/${filename}`
  const mod = imageModules[key]
  return mod?.default
}
