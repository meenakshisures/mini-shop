export interface ShopUser {
  username: string
  password: string
  status: 'active' | 'locked' | 'slow'
}

export const users: ShopUser[] = [
  { username: 'standard_user', password: 'test123', status: 'active' },
  { username: 'locked_user', password: 'test123', status: 'locked' },
  { username: 'slow_user', password: 'test123', status: 'slow' },
]
