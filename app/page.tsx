import ProtectedRoute from '@/components/ProtectedRoute'
import HeroInventory from '@/components/HeroInventory'

export default function Home() {
  return (
    <ProtectedRoute>
      <HeroInventory />
    </ProtectedRoute>
  )
}