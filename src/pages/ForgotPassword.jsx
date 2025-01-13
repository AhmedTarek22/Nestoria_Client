import React, { useState } from "react";
import InputField from "../components/Input";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import axiosInstance from "../apis/axiosConfig";
function ForgotPassword() {
  const translate = useSelector((state) => state.language.translation);
  const [user, setUser] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!emailRegex.test(value)) {
          error = "Email is invalid";
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

    const newErrors = {};
    Object.keys(user).forEach((key) => {
      const error = validateField(key, user[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true);
        const { data: user2 } = await axiosInstance.post(
          "/api/v1/fur/auth/forgotpassword",
          user,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        localStorage.setItem("token", user2.token);
        setSuccess("Check your email to change your password.");
        toast.success("Check your email to change your password.");
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please fix the errors in the form.");
    }
  };
  // if (isLoading) {
  //   return <Loader />;
  // }
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#171716]">
      <div className="bg-black p-10 rounded-xl shadow-xl w-full max-w-xl mx-auto">
        <h2 className="text-white text-3xl font-200 mb-6 text-center font-['Segoe UI']">
          {translate.Forgot_Password}
        </h2>
        {isLoading && <Loader />}
        <form onSubmit={handleSubmit}>
          <p className="text-green-500 text-md mt-2 text-center">{success}</p>
          <p className="text-gray-400 text-md mt-2 text-center max-w-[70%] mx-auto my-4">
            {translate.Enter_your_email}
          </p>
          <div className="h-[40px] mb-[40px] w-full">
            <InputField
              id="email"
              name="email"
              type="email"
              value={user.email}
              placeholder="Please Enter your Email*"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              onBlur={handleBlur}
              error={errors.email}
            />
          </div>

          <div className="flex items-center justify-center rounded-full border border-solid border-[#EA580C]">
            <button
              className="w-full bg-black  hover:bg-orange-600 hover:text-white text-orange-500 font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              type="submit"
            >
              {translate.Send_Email}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
