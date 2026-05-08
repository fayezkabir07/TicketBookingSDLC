import { useState } from "react";

function AuthForm({ mode, onSubmit, isSubmitting, onToggleMode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

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
    <section className="panel auth-panel">
      <h2>{isSignup ? "Create Account" : "Login"}</h2>
      <p>
        {isSignup
          ? "Sign up to book movie tickets."
          : "Login to select movie, slot and seat count."}
      </p>

      <form className="booking-form" onSubmit={handleSubmit}>
        {isSignup ? (
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        ) : null}

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>

        <div className="form-actions">
          <button className="primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
          <button type="button" className="secondary-btn" onClick={onToggleMode}>
            {isSignup ? "Have an account? Login" : "New user? Sign Up"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
