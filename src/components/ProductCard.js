import { useEffect, useState } from "react";
import { FaHeart, FaArrowsAltH, FaExpand } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css modules/productCard.css";
import axiosInstance from "../apis/axiosConfig";
import { useSelector } from "react-redux";

const ProductCard = ({
  product,
  onProductClick,
  onFavoriteClick,
  isFavorite,
  isSingleColumn, 
}) => {
  const translate = useSelector((state) => state.language.translation);
  const { myLang } = useSelector((state) => state.language);
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const newIsFavorite = !isFavoriteState;
    setIsFavoriteState(newIsFavorite);
    onFavoriteClick(product.id, newIsFavorite); 
  };

  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const fetchWishlist = async () => {
      const isLogin = !!localStorage.getItem("token");

      if (!isLogin) {
        return;
      }

      try {
        const response = await axiosInstance.get("/api/v1/fur/favorites");
        setWishlist(response.data.data.favorites);
        const isFavorite = response.data.data.favorites.some(
          (item) => item.product?.id === product.id
        );
        setIsFavoriteState(isFavorite);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div
      className={`relative group cursor-pointer me-4 ${
        isSingleColumn ? "single-column-card" : ""
      }`} 
      onClick={onProductClick}
    >
      {/* صورة المنتج */}
      <div
        className={`overflow-hidden relative ${
          isSingleColumn ? "h-auto w-40" : "h-80 w-full"
        }`} 
      >
        <img
          src={product.images ? product.images[0] : product.photos[0]}
          alt={product.name}
          className="w-full h-full absolute inset-0 transition-opacity duration-1000 ease-in-out"
        />
        <img
          src={product.images ? product.images[1] : product.photos[1]}
          alt={product.name}
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out"
        />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out z-10">
          <Link to="#" className="text-white text-lg font-semibold p-4">
            {translate.Select_Options}
          </Link>
        </div>
      </div>

      {/* بيانات المنتج يا بروووو*/}
      <div
        className={`mt-3 mb-3 text-center ${
          isSingleColumn ? "text-left pl-4" : ""
        }`} 
      >
        <p className="text-lg text-white font-semibold">
          {myLang === "ar" ? product.nameInArabic : product.name}
        </p>
        <p className="text-sm pb-2 text-white">{product.price} EGP</p>
      </div>

      {/*   الأيقونات عند عمل hover*/}
      <div
        className={`absolute top-4 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out z-20 ${
          isSingleColumn ? "right-auto left-2" : ""
        }`} 
      >
        {/* زر القلب لإضافة المنتج إلى المفضلة */}
        <div
          className={`p-2 bg-white hover:bg-orange-500 rounded-full transition-colors ${
            isFavoriteState ? "bg-red-500" : ""
          }`}
          onClick={handleFavoriteClick}
        >
          <FaHeart
            className={`${isFavoriteState ? "text-red-500" : "text-black"}`}
          />
        </div>
        <div className="p-2 bg-white rounded-full hover:bg-orange-500 transition-colors">
          <FaArrowsAltH className="text-black" />
        </div>
        <div className="p-2 bg-white rounded-full hover:bg-orange-500 transition-colors">
          <FaExpand className="text-black" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
