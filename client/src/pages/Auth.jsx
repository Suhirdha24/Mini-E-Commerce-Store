import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function Auth({
  mode = "login",
}) {
  const isRegister = mode === "register";

  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    register,
  } = useAuth();


  /* =====================================================
     REMEMBER WHERE THE USER CAME FROM
  ===================================================== */

  const redirectPath =
    location.state?.from?.pathname ||
    "/";


  /* =====================================================
     FORM STATE
  ===================================================== */

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });


  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    /*
      Clear previous error as soon as
      the user starts correcting the form.
    */

    if (error) {
      setError("");
    }
  };


  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");


      /* ================================================
         REGISTER
      ================================================ */

      if (isRegister) {

        await register(
          form.name.trim(),
          form.email.trim(),
          form.password
        );

      }


      /* ================================================
         LOGIN
      ================================================ */

      else {

        await login(
          form.email.trim(),
          form.password
        );

      }


      /* ================================================
         REDIRECT
         
         If the user originally tried:
         
         /checkout
         
         they will go to:
         
         /login
             ↓
         successful login
             ↓
         /checkout
         
         Otherwise they go to home.
      ================================================ */

      navigate(
        redirectPath,
        {
          replace: true,
        }
      );

    } catch (err) {

      console.error(
        "Authentication error:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        (
          isRegister
            ? "Unable to create your account."
            : "Unable to sign in. Please check your email and password."
        )
      );

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="auth-page">


      {/* =================================================
          LEFT VISUAL PANEL
      ================================================= */}

      <div className="auth-visual">

        <div className="auth-visual-overlay" />

        <div className="auth-visual-copy">

          <span className="auth-brand">
            NOVA STORE
          </span>


          <h1>
            Simple things,
            <br />
            beautifully chosen.
          </h1>


          <p>
            Discover thoughtfully selected
            pieces designed for everyday living.
          </p>

        </div>

      </div>


      {/* =================================================
          RIGHT FORM PANEL
      ================================================= */}

      <div className="auth-form-area">

        <div className="auth-form">


          {/* =================================================
              BRAND
          ================================================= */}

          <Link
            to="/"
            className="auth-logo"
          >
            NOVA
          </Link>


          {/* =================================================
              HEADING
          ================================================= */}

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


          <p className="auth-description">

            {isRegister

              ? "Create your account and start exploring the NOVA collection."

              : "Sign in to continue to your NOVA account."}

          </p>


          {/* =================================================
              REDIRECT MESSAGE
              
              This appears when someone tries to access
              a protected page before logging in.
          ================================================= */}

          {location.state?.from && !isRegister && (

            <div className="auth-notice">

              Please sign in to continue.

            </div>

          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div
              className="form-error"
              role="alert"
            >

              {error}

            </div>

          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="auth-form-fields"
          >


            {/* =================================================
                NAME
            ================================================= */}

            {isRegister && (

              <label>

                <span>
                  Full Name
                </span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  disabled={loading}
                />

              </label>

            )}


            {/* =================================================
                EMAIL
            ================================================= */}

            <label>

              <span>
                Email Address
              </span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />

            </label>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <label>

              <span>
                Password
              </span>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete={
                  isRegister
                    ? "new-password"
                    : "current-password"
                }
                minLength={6}
                required
                disabled={loading}
              />

            </label>


            {/* =================================================
                SUBMIT BUTTON
            ================================================= */}

            <button
              type="submit"
              className="dark-button full"
              disabled={loading}
            >

              <span>

                {loading

                  ? (
                    isRegister
                      ? "Creating account..."
                      : "Signing in..."
                  )

                  : (
                    isRegister
                      ? "Create Account"
                      : "Sign In"
                  )}

              </span>


              {!loading && (

                <span>
                  →
                </span>

              )}

            </button>

          </form>


          {/* =================================================
              ACCOUNT SWITCH
          ================================================= */}

          <div className="auth-switch">

            {isRegister ? (

              <>
                <span>
                  Already have an account?
                </span>

                <Link
                  to="/login"
                  state={{
                    from:
                      location.state?.from,
                  }}
                >
                  Sign in
                </Link>
              </>

            ) : (

              <>
                <span>
                  Don't have an account?
                </span>

                <Link
                  to="/register"
                  state={{
                    from:
                      location.state?.from,
                  }}
                >
                  Create one
                </Link>
              </>

            )}

          </div>


          {/* =================================================
              BACK TO STORE
          ================================================= */}

          <Link
            to="/"
            className="back-to-store"
          >

            ← Back to store

          </Link>


        </div>

      </div>

    </section>
  );
}