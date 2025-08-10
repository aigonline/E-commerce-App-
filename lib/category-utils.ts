// Utility functions for safely handling category data

export type CategoryData = 
  | string 
  | { 
      id?: string
      name?: string 
      slug?: string 
      icon?: string 
      description?: string
      [key: string]: any 
    }

/**
 * Safely get the display name from a category, whether it's a string or object
 */
export function getCategoryName(category: CategoryData | null | undefined): string {
  if (!category) return ''
  
  if (typeof category === 'string') {
    return category
  }
  
  if (typeof category === 'object' && category.name) {
    return category.name
  }
  
  return ''
}

/**
 * Safely get the category slug from a category, whether it's a string or object
 */
export function getCategorySlug(category: CategoryData | null | undefined): string {
  if (!category) return ''
  
  if (typeof category === 'string') {
    return category.toLowerCase().replace(/\s+/g, '-')
  }
  
  if (typeof category === 'object' && category.slug) {
    return category.slug
  }
  
  if (typeof category === 'object' && category.name) {
    return category.name.toLowerCase().replace(/\s+/g, '-')
  }
  
  return ''
}

/**
 * Safely get the category icon from a category object
 */
export function getCategoryIcon(category: CategoryData | null | undefined): string {
  if (!category || typeof category === 'string') return ''
  
  if (typeof category === 'object' && category.icon) {
    return category.icon
  }
  
  return ''
}

/**
 * Check if a value is a category object (has category-like properties)
 */
export function isCategoryObject(value: any): boolean {
  return (
    typeof value === 'object' && 
    value !== null && 
    ('name' in value || 'slug' in value || 'id' in value)
  )
}
