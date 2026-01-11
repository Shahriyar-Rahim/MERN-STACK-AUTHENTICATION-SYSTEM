import React, { useContext, useEffect } from "react";
import Hero from "../components/Hero";
import Instructor from "../components/Instructor";
import Technologies from "../components/Technologies";
import "../styles/Home.css";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router";
import Footer from "../layout/Footer";

const Home = () => {
  const {isAuthenticated, setIsAuthenticated, setUser} = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate])
  const logout = async () => {
    try {
      const res = await axios.get("https://mern-stack-authentication-system-eta.vercel.app/api/v1/user/logout", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      toast.success(res.data.message);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  if(!isAuthenticated) return null;
  return (
    <>
    <section className="home">
      <Hero />
      <Technologies />
      <Instructor />
      <Footer />
      <button onClick={logout}>Logout</button>
      </section>
      </>
  );
};

export default Home;
