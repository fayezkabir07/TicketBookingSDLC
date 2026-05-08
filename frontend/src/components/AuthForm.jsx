import { useState } from "react";

function AuthForm({ mode, onSubmit, isSubmitting, onToggleMode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const isSignup = mode === "signup";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <aside className="auth-hero">
        <div className="auth-hero-brand">
          <div className="auth-logo">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
              <path d="M10 28V12l10 8 10-8v16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="auth-brand-name">CinePass</h1>
        </div>

        <div className="auth-hero-content">
          <h2>Your ticket to unforgettable cinema experiences.</h2>
          <p>
            Browse the latest movies, pick your seats, and book in seconds — all from one beautifully simple app.
          </p>
        </div>

        <div className="auth-hero-stats">
          <div className="auth-stat">
            <span className="auth-stat-number">500+</span>
            <span className="auth-stat-label">Movies</span>
          </div>
          <div className="auth-stat-divider" />
          <div className="auth-stat">
            <span className="auth-stat-number">50k+</span>
            <span className="auth-stat-label">Users</span>
          </div>
          <div className="auth-stat-divider" />
          <div className="auth-stat">
            <span className="auth-stat-number">4.9</span>
            <span className="auth-stat-label">Rating</span>
          </div>
        </div>

        <div className="auth-hero-decor">
          <div className="auth-decor-ring ring-1" />
          <div className="auth-decor-ring ring-2" />
          <div className="auth-decor-ring ring-3" />
          <div className="auth-decor-orb orb-1" />
          <div className="auth-decor-orb orb-2" />
        </div>
      </aside>

      {/* Right form panel */}
      <main className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-mode-badge">
              <span className={`auth-mode-dot ${isSignup ? "signup" : "login"}`} />
              {isSignup ? "New here" : "Welcome back"}
            </div>
            <h2 className="auth-title">
              {isSignup ? "Create your account" : "Sign in to CinePass"}
            </h2>
            <p className="auth-subtitle">
              {isSignup
                ? "Join thousands of movie lovers and start booking today."
                : "Good to have you back! Sign in to continue."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <div className={`auth-field ${focusedField === "name" ? "focused" : ""} ${formData.name ? "has-value" : ""}`}>
                <label className="auth-label" htmlFor="name">
                  <svg viewBox="0 0 20 20" fill="none" className="auth-label-icon" aria-hidden="true">
                    <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3.5 17c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Jane Doe"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className={`auth-field ${focusedField === "email" ? "focused" : ""} ${formData.email ? "has-value" : ""}`}>
              <label className="auth-label" htmlFor="email">
                <svg viewBox="0 0 20 20" fill="none" className="auth-label-icon" aria-hidden="true">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="jane@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={`auth-field ${focusedField === "password" ? "focused" : ""} ${formData.password ? "has-value" : ""}`}>
              <label className="auth-label" htmlFor="password">
                <svg viewBox="0 0 20 20" fill="none" className="auth-label-icon" aria-hidden="true">
                  <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="13.5" r="1" fill="currentColor" />
                </svg>
                Password
              </label>
              <div className="auth-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder={isSignup ? "At least 6 characters" : "Enter your password"}
                  minLength={6}
                  required
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="auth-forgot">
                <button type="button" className="auth-forgot-link">
                  Forgot password?
                </button>
              </div>
            )}

            <button className="auth-submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="auth-spinner">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="40 10" strokeLinecap="round" />
                  </svg>
                  Please wait...
                </span>
              ) : isSignup ? (
                <>
                  Create Account
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              ) : (
                <>
                  Sign In
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="auth-social-btns">
            <button type="button" className="auth-social-btn">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M18.171 10.327c0-.66-.058-1.296-.168-1.91H10v3.616h4.72a4.02 4.02 0 0 1-1.745 2.64v2.19h2.82c1.65-1.52 2.605-3.76 2.605-6.536z" fill="#4285F4" />
                <path d="M10 18.8c2.303 0 4.236-.763 5.648-2.068l-2.82-2.19c-.762.512-1.74.813-2.828.813-2.173 0-4.016-1.465-4.674-3.437H2.18v2.264A8.963 8.963 0 0 0 10 18.8z" fill="#34A853" />
                <path d="M5.326 12.118a5.05 5.05 0 0 1 0-3.196V6.658H2.18a8.963 8.963 0 0 0 0 8.044l3.146-2.584z" fill="#FBBC05" />
                <path d="M10 4.78c1.294 0 2.452.443 3.365 1.314l2.526-2.526C14.235 1.863 12.302 1.2 10 1.2A8.963 8.963 0 0 0 2.18 5.7l3.147 2.584c.657-1.972 2.5-3.504 4.673-3.504z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button type="button" className="auth-social-btn">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M17 3H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 8.5l5-3v9l-5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Apple
            </button>
          </div>

          <p className="auth-toggle-text">
            {isSignup ? "Already have an account?" : "New to CinePass?"}{" "}
            <button type="button" className="auth-toggle-link" onClick={onToggleMode}>
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuthForm;