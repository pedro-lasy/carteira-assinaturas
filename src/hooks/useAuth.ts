import { useSession } from '@/components/SessionContextProvider'

export function useAuth() {
  const { user, loading } = useSession()
  return { user, loading }
}