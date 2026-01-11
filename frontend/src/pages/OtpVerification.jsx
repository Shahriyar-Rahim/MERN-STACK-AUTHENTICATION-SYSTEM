import React, { useContext, useState } from "react";
import "../styles/OtpVerification.css";
import axios from "axios";
import { Navigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Context } from "../main";

const OtpVerification = () => {
  const { isAuthenticated, setIsAuthenticated,setUser} = useContext(Context);
  const { email, phone} = useParams();
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const handleChange = (value, index) => {
    if(!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if(value && index < otp.length - 1){
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if(e.key === "Backspace" && otp[index] === "" && index > 0){
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleOtpVerification = async(e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    const data = {
      email, otp: enteredOtp, phone
    };

    try {
      const res = await axios.post("http://localhost:5000/api/v1/user/verify-otp", data, {
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
  };

  if(isAuthenticated){
    return <Navigate to="/" />
  }

  return (
    <>
    <div className="otp-verification-page">
      <div className="otp-container">
        <h1>OTP Verification</h1>
        <p>Please enter the 5-digit OTP sent to your email or phone number.</p>
        <form onSubmit={handleOtpVerification} className="otp-form">
          <div className="otp-input-container">
            {
              otp.map((digit, index) => {
                return (
                  <input type="text" maxLength={1}
                  key={index}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)
                  }
                  className="otp-input"
                  id={`otp-input-${index}`}
                  />
                )
              })
            }
          </div>

          <button className="verify-button" type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default OtpVerification;
