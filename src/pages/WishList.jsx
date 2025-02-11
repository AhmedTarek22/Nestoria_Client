import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faShoppingCart,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { HeaderPages } from "../components/HeaderPages";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import axiosInstance from "../apis/axiosConfig";
import "react-toastify/dist/ReactToastify.css";
import ColorNamer from "color-namer";
import { useSelector } from "react-redux";

function WishlistPage() {
  const { myLang } = useSelector((state) => state.language);

  const translate = useSelector((state) => state.language.translation);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/fur/favorites");
        setWishlist(response.data.data.favorites);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/api/v1/fur/favorites/${id}`);
          setWishlist(wishlist.filter((item) => item.product._id !== id));
          Swal.fire(
            "Removed!",
            "The item has been removed from your wishlist.",
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an error removing the item from your wishlist.",
            "error"
          );
          console.error(error);
        }
      }
    });
  };

  const addToCart = async (quantity = 1, productId, colors) => {
    const colorNames = colors.map((color) => {
      const colorName = ColorNamer(color);
      return colorName.ntc[0].name;
    });
    console.log("colorName", colorNames[0]);
    console.log("colorNames", colorNames);
    const color = colorNames[0];
    try {
      await axiosInstance.post("/addToCart", {
        quantity,
        productId,
        color,
      });
      Swal.fire({
        title: "Success!",
        text: "Product added to cart!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "There was an issue adding the product to the cart.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <HeaderPages namePage={`${translate.wishlist}`} />
      <section
        style={{
          backgroundImage: "url('/body-bg.png')",
          backgroundPosition: "left top",
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
          backgroundAttachment: "scroll",
          backgroundColor: "#101010",
        }}
        className="py-16 px-4 md:px-10"
      >
        <div className="text-center mb-12">
          <FontAwesomeIcon
            icon={faHeart}
            className="text-5xl text-[--mainColor] border-2 border-[--mainColor] p-4 rounded-full"
          />
          <h2 className="text-xl md:text-2xl lg:text-4xl text-white">
            {translate.Your_Wishlist}
          </h2>
        </div>
        {/* section products empty */}
        {wishlist.length === 0 ? (
          <div>
            <div className="bg-[#2B2B2B] text-center md:text-start rounded-br-xl rounded-bl-xl relative">
              <span className="absolute bg-[#019ED5] w-full h-[3px] block"></span>
              <div className="p-6 text-white font-bold">
                {translate.Your_Wishlist_div}.
              </div>
            </div>
            <Link to="/shop">
              <button className="mt-10 px-6 py-3 text-[#C26510] border border-[#C26510] rounded-3xl hover:text-white hover:bg-[#C26510] duration-500">
                {translate.Return_To_Shop}
              </button>
            </Link>
          </div>
        ) : (
          <div>
            {/* products */}
            <div className="mt-10 mb-5 py-5 border border-[#393938] md:border-[#C26510] rounded-2xl">
              <ul className="px-7 hidden md:grid grid-cols-10 items-center text-white">
                <li className="col-span-4">{translate.Product}</li>
                <li className="col-span-2">{translate.Price}</li>
              </ul>
              <span className="my-6 bg-[#393938] w-full h-[2px] hidden md:block"></span>

              {wishlist.map((item) => (
                <div
                  key={item.product._id}
                  className="p-6 rounded-lg shadow-md cursor-pointer"
                  onClick={() =>
                    navigate(`/product-details/${item.product._id}`)
                  }
                >
                  <ul className="md:relative px-7 grid grid-cols-1 gap-6 md:grid-cols-10 items-center">
                    <li className="col-span-full md:col-span-4 flex flex-col md:flex-row items-center gap-6">
                      <figure className="relative w-full h-[300px] md:h-[100px] md:w-24">
                        <img
                          className="w-full h-full rounded-lg"
                          src={item.product.images[0]}
                          alt={item.product.name}
                        />
                      </figure>
                      <div className="text-center md:text-start">
                        <p className="text-xl md:text-base text-white hover:text-[#C26510] duration-500">
                          {myLang === "ar"
                            ? item.product.nameInArabic
                            : item.product.name}

                        </p>
                      </div>
                    </li>
                    <li className="col-span-full md:col-span-2 text-center md:text-start text-white">
                      EGP {item.product.price}
                    </li>
                    <li className="col-span-full md:col-span-4 text-center md:text-start">
                      <div className="flex flex-col md:flex-row gap-3 justify-center md:justify-start">
                        <button
                          className="px-6 py-3 text-[#C26510] border border-[#C26510] rounded-3xl hover:text-white hover:bg-[#C26510] duration-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.product._id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />{" "}
                          {translate.Remove_fom_wishlist}
                        </button>
                        <button
                          className="px-6 py-3 text-[#C26510] border border-[#C26510] rounded-3xl hover:text-white hover:bg-[#C26510] duration-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(1, item.product._id, item.product.color);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faShoppingCart}
                            className="mr-2"
                          />{" "}
                          {translate.Add_to_Cart}
                        </button>
                      </div>
                    </li>
                  </ul>
                  <span className="my-4 bg-[#5E5E5E] w-full h-[1px] block"></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default WishlistPage;
