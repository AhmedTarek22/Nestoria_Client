import {
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchContainer from "./searchContainer";
import { CgProfile } from "react-icons/cg";
import { LiaCartPlusSolid } from "react-icons/lia";
import { IoMdLogOut } from "react-icons/io";
import { IoIosMan } from "react-icons/io";
import styles from "../css modules/nab2.module.css";
import { useUserInfoContext } from "../context/UserProvider";
import axiosInstance from "../apis/axiosConfig";

import { FiMessageCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
function Navbar2() {
  const translate = useSelector((state) => state.language.translation);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const divRef = useRef(null);
  const { currentUser, isLogin, setIsLogin } = useUserInfoContext();
  const [loginStatus, setLoginStatus] = useState(isLogin);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setLoginStatus(isLogin);
  }, [isLogin]);

  //handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    axiosInstance("/api/v1/fur/profile/logout")
      .then((res) => {
        setIsLogin(false);

        console.log("Logged out:", res);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      })
      .catch((err) => console.log(err));

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="bg-transparent absolute top-[48px] left-0 w-full z-50">
      <div className="container mx-auto px-2 flex justify-between items-center w-full lg:w-[1440px]">
        <div className="text-white text-xl sm:text-2xl lg:text-3xl hover:text-[--mainColor] transition-all duration-150 font-serif">
          <Link to="/">Nestoria</Link>
        </div>

        {/* الروابط للقائمة في الشاشات الكبيرة */}
        <ul className="hidden lg:flex justify-between gap-4 lg:gap-12">
          <li className="text-white hover:text-[--mainColor] transition-all duration-150">
            <Link to="/">{translate.home}</Link>
          </li>

          <li className="text-white hover:text-[--mainColor] transition-all duration-150">
            <Link to="/shop">{translate.shop}</Link>
          </li>
          <li className="text-white hover:text-[--mainColor] transition-all duration-150">
            <Link to="/wishlist">{translate.wishlist}</Link>
          </li>

          <li className="text-white hover:text-[--mainColor] transition-all duration-150">
            <Link to="/aboutus">{translate.about_us}</Link>
          </li>
          <li className="text-white hover:text-[--mainColor] transition-all duration-150">
            <Link to="/contactus">{translate.contact_us}</Link>
          </li>
        </ul>
        <div className="flex gap-2 sm:gap-4 lg:gap-5 justify-center items-center">
          <FontAwesomeIcon
            onClick={() => {
              setShowSearch(true);
            }}
            className="cursor-pointer text-lg  lg:text-xl text-[#ecececec]  hover:text-[--mainColor] transition-all duration-200"
            icon={faMagnifyingGlass}
          />

          <div className="flex items-center">
            <div className="relative">
              <button className="p-0">
                {/* <GoBell fontSize="3xl" className="ml-2 text-white" /> */}
                <span className="text-red-500  text-xs absolute top-[-5px] right-[-5px] "></span>
                <FiMessageCircle
                  size={22}
                  className=" text-white mt-[5px]  hover:text-[--mainColor] transition-all duration-200"
                  onClick={() => {
                    navigate("/chat");
                  }}
                />
              </button>
            </div>
          </div>
          <Link to="/cart">
            <LiaCartPlusSolid className="cursor-pointer text-lg  lg:text-3xl text-[#ecececec]  hover:text-[--mainColor] transition-all duration-200" />
          </Link>
          {/* FIXME: */}

          {isLogin && currentUser ? (
            <div
              ref={divRef}
              className="relative z-50"
              onClick={() => {
                setShowProfile((prev) => !prev);
              }}
            >
              <div className="flex text-white gap-2">
                <CgProfile className="cursor-pointer text-lg  lg:text-2xl text-[#ecececec] hover:text-[--mainColor] transition-all duration-200" />
                <>{currentUser ? currentUser.fullName : "Guest"}</>
              </div>

              {showProfile && (
                <div
                  className={`${styles.profile} bg-black p-1 rounded-lg absolute bottom-[-100px] left-[-41px] z-10`}
                >
                  <p
                    className="flex items-center gap-2 justify-center  cursor-pointer text-white hover:bg-[--mainColor] py-2 px-4 text-center rounded-lg"
                    value="profile"
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    <span>{translate.Profile}</span>
                    <IoIosMan />
                  </p>
                  <p
                    className="flex items-center gap-2 justify-center cursor-pointer text-white hover:bg-[--mainColor] py-2 px-2 text-center rounded-lg"
                    value="logout"
                    onClick={() => handleLogout()}
                  >
                    <span> {translate.logout}</span>
                    <IoMdLogOut className="inline-block" />
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              className="text-white cursor-pointer hover:text-[--mainColor] transition-all duration-200"
              onClick={() => {
                navigate("/login");
              }}
            >
              {translate.login}
            </div>
          )}

          {showSearch && <SearchContainer setShowSearch={setShowSearch} />}
        </div>

        <div className="lg:hidden">
          <button onClick={() => setShowMenu(!showMenu)}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* القائمة المنسدلة للشاشات الصغيرة */}
      {showMenu && (
        <div className="lg:hidden flex flex-col gap-2 mt-4 bg-black p-4 rounded-lg">
          <Link
            to="/"
            className="text-white hover:bg-[--mainColor] py-2 px-4 rounded-lg"
            onClick={() => setShowMenu(false)}
          >
            {translate.home}
          </Link>
          <Link
            to="/shop"
            className="text-white hover:bg-[--mainColor] py-2 px-4 rounded-lg"
            onClick={() => setShowMenu(false)}
          >
            {translate.shop}
          </Link>
          <Link
            to="/wishlist"
            className="text-white hover:bg-[--mainColor] py-2 px-4 rounded-lg"
            onClick={() => setShowMenu(false)}
          >
            {translate.wishlist}
          </Link>
          <Link
            to="/aboutus"
            className="text-white hover:bg-[--mainColor] py-2 px-4 rounded-lg"
            onClick={() => setShowMenu(false)}
          >
            {translate.about_us}
          </Link>
          <Link
            to="/contactus"
            className="text-white hover:bg-[--mainColor] py-2 px-4 rounded-lg"
            onClick={() => setShowMenu(false)}
          >
            {translate.contact_us}
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar2;
