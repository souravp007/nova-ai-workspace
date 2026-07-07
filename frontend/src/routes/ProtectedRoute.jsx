import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadCurrentUser } from "../features/auth/authSlice.js";
import FullPageLoader from "../components/FullPageLoader.jsx";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { accessToken, user, bootstrapped } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(loadCurrentUser());
    }
  }, [accessToken, dispatch, user]);

  if (accessToken && !bootstrapped) return <FullPageLoader />;
  if (!accessToken) return <Navigate to="/login" replace />;

  return children;
}
