import React from "react";

const Header = ({ title, onLogout, darkMode, setDarkMode, username }) => {
  return (
    <div className="header">
      <h1 className="heading">{title}</h1>
      <p>Welcome, {username}</p>
      <button onClick={onLogout} className="logout-button">Logout</button>
      <button
        className="toggle-theme-button"
        onClick={() => {
          const newMode = !darkMode;
          setDarkMode(newMode);
          localStorage.setItem("darkMode", newMode);
        }}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default Header;
