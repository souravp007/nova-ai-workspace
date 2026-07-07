import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../features/auth/AuthForm.jsx";
import { login } from "../features/auth/authSlice.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [values, setValues] = useState({ email: "", password: "" });

  const onChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(login(values));
  };

  return (
    <AuthForm
      mode="login"
      values={values}
      error={error}
      loading={status === "loading"}
      onChange={onChange}
      onSubmit={onSubmit}
      footer={
        <>
          New here?{" "}
          <Link className="font-bold text-brand-700 hover:text-brand-500" to="/register">
            Create an account
          </Link>
        </>
      }
    />
  );
}
