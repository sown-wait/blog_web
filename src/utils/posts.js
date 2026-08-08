const rawPostModules = import.meta.glob('../posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

const postComponentModules = import.meta.glob('../posts/*.md', { eager: true })

function parseValue(value) {
  const cleanValue = value.trim()

  if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) || (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
    return cleanValue.slice(1, -1)
  }

  if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
    return cleanValue
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  return cleanValue
}

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
  const metadata = {}

  if (!match) {
    return { metadata, body: source }
  }

  match[1].split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':')

    if (separatorIndex === -1) {
      return
    }

    const key = line.slice(0, separatorIndex).trim()
    metadata[key] = parseValue(line.slice(separatorIndex + 1))
  })

  return {
    metadata,
    body: source.slice(match[0].length)
  }
}

function getPostId(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

function normalizePost(path) {
  const { metadata } = parseFrontmatter(rawPostModules[path])
  const id = getPostId(path)

  return {
    id,
    title: metadata.title || id,
    date: metadata.date || '',
    category: metadata.category || '随笔',
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    excerpt: metadata.excerpt || '',
    component: postComponentModules[path].default
  }
}

export const posts = Object.keys(rawPostModules)
  .map(normalizePost)
  .sort((firstPost, secondPost) => new Date(secondPost.date) - new Date(firstPost.date))

export const categories = ['全部', ...new Set(posts.map((post) => post.category))]

export function findPost(id) {
  return posts.find((post) => post.id === id)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}
