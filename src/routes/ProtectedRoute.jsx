import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles, redirectTo = "/login" }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    const roleHome =
      user.role === "ADMIN"
        ? "/admin/dashboard"
        : user.role === "MENTOR"
        ? "/mentor/dashboard"
        : user.role === "TRUSTEE"
        ? "/trustee/dashboard"
        : "/student/profile";
    return <Navigate to={roleHome} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
