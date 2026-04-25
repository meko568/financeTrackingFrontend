import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicOnlyRoute
