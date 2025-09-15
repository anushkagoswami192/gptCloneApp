import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {

  const hastoken = document.cookie.includes("token=")

  return hastoken ? children : <Navigate to="/register" replace />;
}

export default ProtectedRoute
