export function updatePageMeta(title: string, description: string) {
  document.title = `${title} | EnglishPath`
  const desc = document.querySelector('meta[name="description"]')
  if (desc) desc.setAttribute('content', description)
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', `${title} | EnglishPath`)
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', description)
}
