import ingredients from '@/lib/ingredients.json'
import type { Ingredient } from '@/types'

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
}

export function searchIngredient(
  query: string,
  limit: number = 10
): Ingredient[] {
  if (!query || query.trim() === '') return []

  const normalizedQuery = normalize(query.trim())

  return (ingredients as Ingredient[])
    .filter((item) => {
      const normalizedName = normalize(item.name)
      return normalizedName.includes(normalizedQuery)
    })
    .slice(0, limit)
}