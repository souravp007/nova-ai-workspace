import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GuestRoute({ children }) {
  const { accessToken } = useSelector((state) => state.auth);
  return accessToken ? <Navigate to="/" replace /> : children;
}
