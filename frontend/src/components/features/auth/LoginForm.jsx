import React, { useState } from "react";
import { login } from "../../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../state/auth/useAuth";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await login(email, password);
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
      <div className="mb-8 -translate-y-8 text-center">
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
            <h2 className="text-3xl font-bold">Welcome Back</h2>

            <p className="mt-3 text-gray-600">
              Sign in to continue creating beautiful cross-stitch patterns.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-[#F2F2F7] px-4 py-3 focus:border-gray-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 text-lg text-white transition hover:opacity-90"
            >
              Login
            </button>
          </form>

          <p className="mt-8 text-center">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Create Account
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

export default LoginForm;
