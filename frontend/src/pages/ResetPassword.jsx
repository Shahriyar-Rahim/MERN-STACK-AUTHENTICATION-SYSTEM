import React, { useContext, useState } from "react";
import "../styles/ResetPassword.css";
import axios from "axios";
import { Navigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Context } from "../main";

const ResetPassword = () => {
  const {isAuthenticated, setIsAuthenticated, setUser} = useContext(Context);
  const {token} = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPass = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`http://localhost:5000/api/v1/user/password/reset/${token}`, { password, confirmPassword}, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      setIsAuthenticated(true);
      setUser(res.data.user);
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
      setUser(null);
    }
  }

  if(isAuthenticated) return <Navigate to="/" />
  return (
    <>
      <div className="reset-password-page">
        <div className="reset-password-container">
          <h2>Reset Password</h2>
          <p>Enter your new password below</p>
          <form className="reset-password-form" onSubmit={handleResetPass}>
            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className="reset-input" />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="reset-input" />

            <button type="submit" className="reset-btn">Reset Password</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
