import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      if (isLogin) {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) throw error;

        onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          onLogin(data.user);
        } else {
          setMessage(
            "Your account has been created. Please verify your email before logging in."
          );
          setMessageType("success");
        }
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setMessageType("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">♥</span>
          <span>SwasthyaDrishti</span>
        </div>

        <div className="auth-heading">
          <p className="auth-eyebrow">
            YOUR PERSONAL HEALTH SPACE
          </p>

          <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>

          <p className="auth-description">
            {isLogin
              ? "Log in to continue exploring your personalized health dashboard."
              : "Create an account to access your personal health dashboard."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>

            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>

            <div className="auth-password-wrap">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  isLogin ? "current-password" : "new-password"
                }
                minLength={8}
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {!isLogin && (
              <span className="auth-hint">
                Use at least 8 characters for your password.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Log in to your account"
                : "Create my account"}
          </button>
        </form>

        {message && (
          <div
            className={`auth-message ${messageType}`}
            role="status"
          >
            {message}
          </div>
        )}

        <div className="auth-switch-area">
          <span>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            className="auth-switch"
            onClick={switchMode}
            disabled={loading}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>

        <div className="auth-security-note">
          <span>🔒</span>
          <p>Your account is secured with Supabase authentication.</p>
        </div>
      </div>
    </div>
  );
}

export default Auth;