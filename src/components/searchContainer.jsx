import { IoIosSearch } from "react-icons/io";
import { useSearchContext } from "../context/SearchContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosConfig";

function SearchContainer({ setShowSearch }) {
  const [isClosed, setIsClosed] = useState(false);
  const { search, setSearch, setProducts } = useSearchContext();
  const navigate = useNavigate();
  const handleSearchQuery = () => {
    axiosInstance
      .get(`/api/v1/fur/products?keyword=${search}`)
      .then((res) => {
        setProducts(res.data.products);
        navigate("/shop");
        setShowSearch(false);
        // setSearch("");
      });
  };
  return (
    <div>
      <div
        className={` ${
          isClosed ? "searchAnimationreverse" : "searchAnimation"
        } bg-[#101010] w-full h-[400px] mx-auto absolute top-[-60px] left-0 z-[200]`}
      >
        <button
          className="bg-[--mainColor] text-white p-2 rounded-full w-10 cursor-pointer hover:opacity-80 transition-all duration-200 absolute top-7 right-7"
          onClick={() => {
            setIsClosed(true);
            setShowSearch(false);
            console.log(isClosed);
          }}
        >
          X
        </button>
        <div className="relative">
          <div className="relative w-[70%] mx-auto mt-[200px]">
            <input
              style={{ border: "1px solid #A5A5A5" }}
              className="w-full px-4 py-3 bg-black text-white text-sm rounded-full focus:!border focus:!border-[--mainColor] focus:outline-none transition-all duration-500"
              id="password"
              name="password"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Enter Keyword"
            />
            <IoIosSearch
              className="cursor-pointer text-xl absolute top-[32%] right-5 text-white hover:text-[--mainColor]"
              onClick={handleSearchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchContainer;
