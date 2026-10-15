export interface Product {
  id: string
  name: string
  price: number
  description: string
}

export const products: Product[] = [
  {
    id: 'wireless-headphones',
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'Comfortable over-ear headphones with clear, balanced sound.',
  },
  {
    id: 'everyday-backpack',
    name: 'Everyday Backpack',
    price: 54.99,
    description: 'A lightweight backpack with room for daily essentials.',
  },
  {
    id: 'ceramic-mug',
    name: 'Ceramic Mug',
    price: 14.99,
    description: 'A durable ceramic mug for your favorite hot drink.',
  },
  {
    id: 'desk-lamp',
    name: 'Desk Lamp',
    price: 39.99,
    description: 'An adjustable desk lamp designed for focused work.',
  },
  {
    id: 'water-bottle',
    name: 'Water Bottle',
    price: 24.99,
    description: 'A reusable insulated bottle for everyday hydration.',
  },
  {
    id: 'notebook-set',
    name: 'Notebook Set',
    price: 12.99,
    description: 'A set of three notebooks for notes, plans, and ideas.',
  },
  {
    id: 'wireless-mouse',
    name: 'Wireless Mouse',
    price: 29.99,
    description: 'A reliable wireless mouse with a comfortable, compact shape.',
  },
  {
    id: 'travel-tumbler',
    name: 'Travel Tumbler',
    price: 19.99,
    description: 'A spill-resistant tumbler that keeps drinks close at hand.',
  },
]
