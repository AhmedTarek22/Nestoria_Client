import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEyeSlash } from "react-icons/fa";

import { useSelector } from "react-redux";
import axiosInstance from "../apis/axiosConfig";
function ResetPassword() {
  const translate = useSelector((state) => state.language.translation);
  const [user, setUser] = useState({
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [serverErr, setServerErr] = useState("");
  //  const token =useParams().token
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%*]).{8,30}$/;

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (!passwordRegex.test(value)) {
          error =
            "Password must include upper, lower, digit, and special character from @ # % $";
        }

        break;
      default:
        break;
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields on submit
    const newErrors = {};
    Object.keys(user).forEach((key) => {
      const error = validateField(key, user[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    console.log("Form submitted:", user, newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        let token = localStorage.getItem("token");
        const { data: user2 } = await axiosInstance.patch(
          `/api/v1/fur/auth/resetpassword/${token}`,
          user
        );

        navigate("/login");
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          setServerErr(error.response.data.message);
          // toast.error(serverErr);
          console.log(error.response.data);
        } else {
          setServerErr("Something went wrong. Please try again later.");
        }
      }
    } else {
      setServerErr("Please fix the errors in the form.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#171716]">
      <div className="bg-black p-10 rounded-xl shadow-xl w-full max-w-xl mx-auto">
        <h2 className="text-white text-3xl font-200 mb-6 text-center font-['Segoe UI']">
          {translate.Reset_Password}
        </h2>
        <form onSubmit={handleSubmit}>
          <p className="text-red-500 text-md mt-2">{serverErr}</p>
          <label
            className="block text-gray-400 text-sm font-medium mb-2"
            htmlFor="email"
          >
            {translate.Reset_Password}
          </label>
          <div className="h-[40px] mb-[40px] w-full">
            <div className="mb-6">
              <div className="relative">
                <input
                  style={{ border: "1px solid #A5A5A5" }}
                  className={`w-full px-4 py-3 bg-black text-white text-sm rounded-full focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500 border-red-500 "
                      : "focus:ring-orange-500 border-orange-500"
                  }`}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  onBlur={handleBlur}
                  placeholder="Enter your new password*"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center rounded-full border border-solid border-[#EA580C]">
            <button
              className="w-full bg-black  hover:bg-orange-600 hover:text-white text-orange-500 font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              type="submit"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
