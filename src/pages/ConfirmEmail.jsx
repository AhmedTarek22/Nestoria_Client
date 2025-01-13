import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import userloginApi from "../apis/userloginApi";
import { useSelector } from "react-redux";
import axiosInstance from "../apis/axiosConfig";

function ConfirmEmail() {
  const navigate = useNavigate();
  const translate = useSelector((state) => state.language.translation);
  const [serverErr, setServerErr] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.get(
        `/api/v1/fur/users/verify/${paramValue}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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

        console.log(error.response.data.message);
      } else {
        setServerErr("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="bg-black p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-white text-3xl font-200 mb-6 text-center font-['Segoe UI']">
          {translate.Confirm_Email}
        </h2>
        <form onSubmit={handleSubmit}>
          <p className="text-red-500 text-md mt-2">{serverErr}</p>
          <div className="mb-4">
            <p className="inline-block align-baseline font-bold text-sm text-gray-100 ">
              {" "}
              {translate.when_you_enter}{" "}
            </p>
          </div>

          <div className="flex items-center justify-center rounded-full border border-solid border-[#EA580C]">
            <button
              className="w-full bg-black  hover:bg-orange-600 hover:text-white text-orange-500 font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              type="submit"
            >
              {translate.Confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmEmail;
