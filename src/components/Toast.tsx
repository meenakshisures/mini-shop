import { useShop } from '../context/ShopContext'

export function Toast() {
  const { toast } = useShop()
  if (!toast) return null

  return (
    <div className="toast" role="status" data-testid="toast">
      {toast}
    </div>
  )
}
