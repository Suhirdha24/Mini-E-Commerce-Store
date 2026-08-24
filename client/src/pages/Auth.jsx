import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";

  const navigate = useNavigate();

  const {
    login,
    register,
  } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (isRegister) {
        await register(
          form.name,
          form.email,
          form.password
        );
      } else {
        await login(
          form.email,
          form.password
        );
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">

      <div className="auth-visual">

        <div className="auth-visual-copy">

          <span>
            NOVA STORE
          </span>

          <h1>
            Simple things,
            <br />
            beautifully chosen.
          </h1>

        </div>

      </div>

      <div className="auth-form-area">

        <div className="auth-form">

          <span className="eyebrow">

            {isRegister
              ? "WELCOME TO NOVA"
              : "WELCOME BACK"}

          </span>

          <h1>

            {isRegister
              ? "Create an account."
              : "Welcome back."}

          </h1>

          <p>

            {isRegister
              ? "Create your account to start your NOVA journey."
              : "Sign in to continue to your account."}

          </p>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {isRegister && (
              <label>
                Name

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label>
              Email

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </label>

            <button
              type="submit"
              className="dark-button full"
              disabled={loading}
            >

              {loading
                ? "Please wait..."
                : isRegister
                ? "Create Account"
                : "Sign In"}

              <span>
                →
              </span>

            </button>

          </form>

          <div className="auth-switch">

            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link to="/login">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link to="/register">
                  Create one
                </Link>
              </>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}