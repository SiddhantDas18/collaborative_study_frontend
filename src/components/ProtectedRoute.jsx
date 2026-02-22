import { Navigate, useLocation } from 'react-router-dom'
import { useStudyPlanner } from '../context/StudyPlannerContext'

export default function ProtectedRoute({ children }) {
  const { user } = useStudyPlanner()
  const location = useLocation()

  if (!user?.id) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
