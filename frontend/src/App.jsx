import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import OtpVerification from "./pages/OtpVerification";

const App = () => {
  const {setIsAuthenticated, setUser} = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/user/me", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        toast.error(error.response.data.message);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    fetchUser();
  }, [])
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/verify-otp/:email/:phone"
              element={<OtpVerification />}
            />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
          </Routes>
          <ToastContainer theme="colored" />
      </BrowserRouter>
    </>
  );
};

export default App;
