import React from "react";
import "../App.css";

const AuthForm = ({
  isRegistering, setIsRegistering,
  username, setUsername,
  password, setPassword,
  handleLogin, handleRegister,
  darkMode
}) => (
  <div className={`auth-app ${darkMode ? "dark-mode" : "light-mode"}`}>
    <div className="auth-container">
      <h1 className="heading">Task Manager</h1>
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <input className="auth-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button className="auth-button" onClick={isRegistering ? handleRegister : handleLogin}>
        {isRegistering ? "Register" : "Login"}
      </button>
      <button className="auth-button" onClick={() => setIsRegistering(prev => !prev)}>
        {isRegistering ? "Have an account? Login" : "New? Register"}
      </button>
    </div>
  </div>
);

export default AuthForm;
