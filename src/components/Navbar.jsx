import styles from "./Navbar.module.css";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../Redux/languageSlice";

function Navbar() {
  const [showCurrency, setShowCurrency] = useState(false);

  const dispatch = useDispatch();
  const switchToEnglish = () => {
    dispatch(setLanguage("en"));
  };
  const switchToArabic = () => {
    dispatch(setLanguage("ar"));
  };
  const translate = useSelector((state) => state.language.translation);
  const lang = useSelector((lang) => lang.language.myLang);

  const currencyRef = useRef(null);
  const handleClickOutside = (event) => {
    if (
      showCurrency &&
      currencyRef.current &&
      !currencyRef.current.contains(event.target)
    ) {
      setShowCurrency(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCurrency]);

  return (
    <div
      ref={currencyRef}
      className="bg-black min-h-[50px] flex justify-center items-center"
    >
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
            <span>{translate.p1}</span>
            <span>{translate.p2}</span>
            <span>{translate.p3}</span>
          </p>
        </div>
        <div
          className="relative currency text-white flex justify-center items-center cursor-pointer h-ful "
          onClick={() => {
            setShowCurrency((prev) => !prev);
          }}
        >
          {lang === "en" ? translate.English : translate.Arabic}
          {showCurrency ? (
            <IoMdArrowDropup className="mx-2" />
          ) : (
            <IoMdArrowDropdown className="mx-2" />
          )}
          {showCurrency && (
            <ul className="absolute top-8 text-center flex flex-col gap-1 p-1 w-full rounded-md bg-[#101010] z-[200]">
              <li
                onClick={switchToArabic}
                className={`text-white ${
                  lang === "ar" && "bg-[#DD7210]"
                } hover:bg-[#DD7210] pb-1 rounded-md`}
              >
                {translate.Arabic}
                {/* <LuIndianRupee className="text-sm" /> */}
              </li>
              <li
                onClick={switchToEnglish}
                className={`text-white ${
                  lang === "en" && "bg-[#DD7210]"
                } hover:bg-[#DD7210] pb-1 rounded-md`}
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
