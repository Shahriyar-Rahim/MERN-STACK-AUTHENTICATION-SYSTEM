import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../main";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const {isAuthenticated} = useContext(Context);
  const navigate = useNavigate();
  const {register, handleSubmit, formState: {errors}} = useForm();

  const handleRegister = async (data) => {
    data.phone = `+88${data.phone}`;
    try {
      const res = await axios.post("http://localhost:5000/api/v1/user/register", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      navigate(`/verify-otp/${data.email}/${data.phone}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <>
    <div>
      <form className="auth-form"
      onSubmit={handleSubmit((data) => handleRegister(data))}
      >
        <h2>Register</h2>
        <input type="text" placeholder="Name" required {...register("name")}/>
        <div>
          <span>+88</span>
          <input type="number" required {...register("phone")} />
        </div>
        <input type="email" placeholder="Email" required {...register("email")}/>
        <input type="password" placeholder="Password" required {...register("password")}/>

        <div className="verification-method">
          <p>Select Verification Method
            <div className="wrapper">
              <label>
                <input type="radio" name="verificationMethod" value={"email"} {...register("verificationMethod")} required/>
                Email
              </label>                            
              <label>
                <input type="radio" name="verificationMethod" value={"phone"} {...register("verificationMethod")} required/>
                Phone
              </label> 
            </div>
          </p>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
    </>
  );
};

export default Register;
