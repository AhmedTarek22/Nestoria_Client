import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userloginApi from "../apis/userloginApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEyeSlash } from "react-icons/fa";
import InputField from "../components/Input";
import IntroSection from "../components/IntroSection";
import { IoIosWarning } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { useUserInfoContext } from "../context/UserProvider";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
function Login() {
  const translate = useSelector((state) => state.language.translation);
  const { setIsLogin, setCurrentUser } = useUserInfoContext();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [serverErr, setServerErr] = useState("");
  const [success, setSuccess] = useState("");
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\*\@\%\$\#]).{8,30}$/;
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

        const { data: user2 } = await userloginApi.createUser(user);
        const token = user2?.token;
        console.log("user2", user2);

        if (user2.data.user.role === "client") {
          localStorage.setItem("token", token);
          localStorage.setItem("role", user2?.data?.user?.role);
          // localStorage.setItem("user", JSON.stringify(user2?.data?.user));
          setCurrentUser(user2.data.user);
          setIsLogin(true);
          navigate("/");
        } else if (
          (user2.data.user.role === "workshop" &&
            user2.data.user.registerStatus === "notCompleted") ||
          user2.data.user.registerStatus === "modify" ||
          user2.data.user.registerStatus === "pending"
        ) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", user2?.data?.user?.role);
          // navigate("/seller ");
      //    window.location.href = "http://localhost:3000/seller";
      window.location.href = "https://nestoria-user-front.vercel.app/seller";
          toast.info("please complete your registration");
        } else if (user2.data.user.registerStatus === "completed") {
         // window.location.href = `http://localhost:4200/dashboard?token=${token}`;
         window.location.href =`https://nestoria-workshop-front.vercel.app/dashboard?token=${token}`;
        } else {
          localStorage.setItem("token", token);
          localStorage.setItem("role", user2?.data?.user?.role);
          // window.location.href = "http://localhost:3000/admin";
          window.location.href = "https://nestoria-user-front.vercel.app/admin";

        }
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          if (error.response.status === 401) {
            setSuccess("Check your email to verify your account.");
            // toast.error("Check your email to verify your account.");
          }
          setServerErr(error.response.data.message);
          toast.error(error.response.data.message);
        } else {
          setServerErr("Something went wrong. Please try again later.");
          console.log("Something went wrong. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setServerErr("Please fix the errors in the form.");
      toast.error("Please fix the errors in the form.");
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <IntroSection
        pageName={`${translate.Login2}`}
        pageTitle={`${translate.Login2}`}
      />
      <div
        className="flex justify-center items-center min-h-[60vh] "
        style={{
          backgroundImage: "url('/body-bg.png')",
          backgroundPosition: "left top",
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
          backgroundAttachment: "scroll",
          backgroundColor: "#101010",
        }}
      >
        <div className="bg-black p-10 rounded-xl shadow-xl w-full max-w-xl mx-auto">
          <h2 className="text-white text-3xl font-200 mb-6 text-center font-['Segoe UI']">
            {translate.Login2}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="h-[40px] mb-[40px] w-full">
              <InputField
                id="email"
                name="email"
                type="email"
                value={user.email}
                placeholder={`${translate.email_login}`}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                onBlur={handleBlur}
                error={errors.email}
              />
            </div>
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
                    placeholder={`${translate.password_login}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 ml-3">
                    {errors.password}{" "}
                    <IoIosWarning className="text-yellow-500 inline" />
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center rounded-full border border-solid border-[#EA580C]">
              <button
                className="w-full bg-black  hover:bg-orange-600 hover:text-white text-orange-500 font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                type="submit"
              >
                {translate.Login2}
              </button>
            </div>
            <div className="text-center mt-6">
              <Link
                className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-600"
                to="/forgotpassword"
              >
                {translate.Forgot_password}
              </Link>
            </div>
            <div className="text-center mt-6 flex justify-center items-center gap-2">
              <span className="inline-block align-baseline font-bold text-sm text-gray-100 ">
                {translate.Donot_have}
              </span>
              <Link
                className="inline-block align-baseline font-bold text-md text-orange-500 hover:text-orange-700 "
                to="/register"
              >
                {translate.Signup}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
