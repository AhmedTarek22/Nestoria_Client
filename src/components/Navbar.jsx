import styles from "./Navbar.module.css";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { LuIndianRupee } from "react-icons/lu";
import { FaDollarSign } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";

import { useState } from "react";
import { BiArrowFromBottom } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../Redux/languageSlice";

function Navbar() {
  const [showCurrency, setShowCurrency] = useState(false);
  const [currency, setCurrency] = useState(
    "INR",
    <LuIndianRupee className="text-white" />
  );

  const dispatch = useDispatch();
  const switchToEnglish = () => {
    dispatch(setLanguage("en"));
  };
  const switchToArabic = () => {
    dispatch(setLanguage("ar"));
  };
  const translate = useSelector((state) => state.language.translation);
  const lang = useSelector((lang) => lang.language.myLang);

  return (
    <div className="bg-black overflow-hidden min-h-[50px] flex justify-center items-center">
      <div className="container flex justify-between items-center w-[1440px] mx-auto">
        <div className="social flex justify-center items-center gap-4 px-2 ">
          <FaFacebookF className="text-white text-xl hover:text-[--mainColor] transition-all duration-150 cursor-pointer" />
          <FaInstagram className="text-white text-xl hover:text-[--mainColor] transition-all duration-150 cursor-pointer" />
          <FaWhatsapp className="text-white text-xl hover:text-[--mainColor] transition-all duration-150 cursor-pointer" />
        </div>
        <div
          className={`${styles.mianContainer} w-1/2  overflow-hidden mx-auto flex justify-center items-center h-10 relative `}
        >
          <p
            className={`${styles.headeranimation} z-30 text-white flex items-center gap-10 py-3 `}
          >
            <span>{translate.p1}</span>
            <span>{translate.p2}</span>
            <span>{translate.p3}</span>
          </p>
          <p
            className={`${styles.headeranimation2} z-30 text-white flex items-center gap-10 py-3`}
          >
            <span>Join Our Schema And Earn Rewards!</span>
            <span>Invite Friends And Earn Rewards!</span>
            <span>Free Shipping On Order Over $100!</span>
          </p>
        </div>
        <div
          className="relative uppercase currency text-white flex justify-center items-center cursor-pointer h-ful "
          onClick={() => {
            setShowCurrency((prev) => !prev);
          }}
        >
          {lang}
          {showCurrency ? (
            <IoMdArrowDropup className="ml-1" />
          ) : (
            <IoMdArrowDropdown className="ml-1" />
          )}
          {showCurrency && (
            <ul className="absolute -top-3 right-8 text-center flex flex-col gap-1 p-1 w-full rounded-md bg-[#101010] z-[200]">
              <li
                onClick={switchToArabic}
                className="text-white hover:bg-[#DD7210] rounded-md"
              >
                {translate.Arabic}
                {/* <LuIndianRupee className="text-sm" /> */}
              </li>
              <li
                onClick={switchToEnglish}
                className="text-white hover:bg-[#DD7210] rounded-md"
              >
                {translate.English}
                {/* <FaDollarSign className="text-sm" /> */}
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
