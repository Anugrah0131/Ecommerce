import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

export default function AdminRoute() {
  const user = useUserStore((state) => state.user);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT admin
  if (user?.isAdmin !== true) {
    return <Navigate to="/" replace />;
  }

  if (user?.isAdmin === true) {
  // admin access
}


  // Admin allowed
  return <Outlet />;
}
