import React, { useState, useEffect } from "react";
import { register } from "../../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../state/auth/useAuth";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleBtn from "./GoogleBtn";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [reCaptchaToken, setReCaptchaToken] = useState(null);

  const {
    dispatch,
    state: { error },
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch({
      type: "CLEAR_ERROR",
    });
  }, [dispatch]);
  async function handleSubmit(e) {
    e.preventDefault();

    dispatch({
      type: "CLEAR_ERROR",
    });

    if (password !== confirmPassword) {
      dispatch({
        type: "SET_ERROR",
        payload: "Passwords do not match",
      });
      return;
    }
    if (!reCaptchaToken) {
      dispatch({
        type: "SET_ERROR",
        payload: "Complete the reCAPTCHA",
      });
      return;
    }

    try {
      const response = await register(
        username,
        email,
        password,
        reCaptchaToken,
      );
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.user,
      });
      navigate("/generate");
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message,
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="mb-8 -translate-y-4 text-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          <img
            src="images/logo.png"
            alt="X-Stitch Logo"
            className="h-5 w-auto"
          />
        </Link>
      </div>

      <div className="flex min-h-[600px] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex w-[50%] flex-col justify-center px-16 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Create Account</h2>

            <p className="mt-3 text-gray-600">
              Sign up to start creating beautiful cross-stitch patterns.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="mb-2 block font-medium">
                Username
              </label>

              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  dispatch({ type: "CLEAR_ERROR" });
                }}
                required
                className="w-full rounded-lg border border-gray-300 bg-[#F2F2F7] px-4 py-3 focus:border-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  dispatch({ type: "CLEAR_ERROR" });
                }}
                required
                className="w-full rounded-lg border border-gray-300 bg-[#F2F2F7] px-4 py-3 focus:border-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="font-medium">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <>
                      <EyeOff size={16} />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      Show
                    </>
                  )}
                </button>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  dispatch({ type: "CLEAR_ERROR" });
                }}
                required
                className="w-full rounded-lg border border-gray-300 bg-[#F2F2F7] px-4 py-3 focus:border-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="confirmPassword" className="font-medium">
                  Confirm Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <>
                      <EyeOff size={16} />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      Show
                    </>
                  )}
                </button>
              </div>

              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  dispatch({ type: "CLEAR_ERROR" });
                }}
                required
                className="w-full rounded-lg border border-gray-300 bg-[#F2F2F7] px-4 py-3 focus:border-gray-400 focus:outline-none"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setReCaptchaToken(token)}
              onExpired={() => setReCaptchaToken(null)}
              size="normal"
              hl="en"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 text-lg text-white transition hover:opacity-90"
            >
              Create Account
            </button>
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500">OR</span>
            </div>
            <GoogleBtn />
          </form>

          <p className="mt-8 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        <div className="w-[50%]">
          <img
            src="/images/login-image.png"
            alt="Cross Stitch Pattern"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
