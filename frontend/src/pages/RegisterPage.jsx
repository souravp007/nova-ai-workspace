import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../features/auth/AuthForm.jsx";
import { register } from "../features/auth/authSlice.js";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [values, setValues] = useState({ name: "", email: "", password: "" });

  const onChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(register(values));
  };

  return (
    <AuthForm
      mode="register"
      values={values}
      error={error}
      loading={status === "loading"}
      onChange={onChange}
      onSubmit={onSubmit}
      footer={
        <>
          Already have access?{" "}
          <Link className="font-bold text-brand-700 hover:text-brand-500" to="/login">
            Sign in
          </Link>
        </>
      }
    />
  );
}
