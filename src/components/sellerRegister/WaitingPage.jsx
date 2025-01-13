import React from "react";
import { useSelector } from "react-redux";

const ThankYou = () => {
  const translate = useSelector((state) => state.language.translation);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-[#131312] text-white"
      style={{ backgroundImage: "url('/images/home/2.jpg')" }}
    >
      <h1 className="text-3xl font-semibold mb-4">
        {translate.Thank_You_for_Registering}
      </h1>
      <p className="text-lg text-[#929292]">
        {translate.Your_documents_will_be_reviewed}
      </p>
    </div>
  );
};

export default ThankYou;
