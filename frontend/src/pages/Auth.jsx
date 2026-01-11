import React, { useContext, useEffect, useState } from "react"; // Added useEffect
import { useNavigate } from "react-router";
import "../styles/Auth.css";
import Login from "../components/Login";
import Register from "../components/Register";
import { Context } from "../main";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(Context);
  const [isLogin, setIsLogin] = useState(true);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  if (isAuthenticated) return null;

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-toggle">
          <button 
            className={`toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default Auth;