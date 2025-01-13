import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.js";
import Pagination from "../components/Pagination.js";
import axiosInstance from "../apis/axiosConfig.js";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";
import { useSearchContext } from "../context/SearchContext.jsx";
import { FaTh, FaThLarge, FaThList, FaBars } from "react-icons/fa";

const Shop = () => {
  // const [products, setProducts] = useState([]);
  const { search, products, setProducts } = useSearchContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([
    "All",
    "Sofa",
    "Outdoor Sofa",
    "Dining Table",
    "Coffee Table",
    "Bookshelf",
    "Bed Frame",
    "Desk",
    "Wardrobe",
    "Couch",
    "Bed",
    "Recliners",
    "Home Decoration",
    "Office Decoration",
    "Indoor Decoration",
    "Outdoor Decoration",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([10, 2499]);
  const [maxPrice, setMaxPrice] = useState(2499);
  const productsPerPage = 10;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceSliding, setIsPriceSliding] = useState(false);
  const [favorites, setFavorites] = useState([]);
  // إضافة حالة جديدة للتحكم بعدد الأعمدة
  const [activeGrid, setActiveGrid] = useState(3);
  // القيمة الافتراضية هي 3 أعمدة

  // جلب المنتجات المفضلة
  useEffect(() => {
    axiosInstance
      .get("/api/v1/fur/favorites")
      .then((res) => {
        setFavorites(res.data.data.favorites); // افترض أن البيانات هي قائمة بالمنتجات المفضلة
      })
      .catch((err) => {
        toast("Failed to fetch favorites:", err);
      });
  }, []);

  // جلب المنتجات من السيرفر مع التصفية

  const fetchProducts = (page = 1, category = "All", maxPrice = 2499) => {
    // if (!search) {
    setIsLoading(true);
    axiosInstance
      .get(
        `/api/v1/fur/products?page=${page}&limit=${productsPerPage}&category=${
          category !== "All" ? category : ""
        }&maxPrice=${maxPrice}`
      )

      .then((res) => {
        console.log("fav", res.data.products[3].isFavourite);
        const productsWithFavorites = res.data.products.map((product) => ({
          ...product,
          isFavorite: favorites.some((fav) => fav.id === product.id),
        }));
        setProducts(productsWithFavorites);
        setTotalPages(res.data.pages || 1);
        setMaxPrice(Math.max(...res.data.products.map((p) => p.price)));
      })
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // }
  };

  // تحديث المنتجات عند تغيير الصفحة أو الفئة أو رفع الضغط عن الفلتر
  useEffect(() => {
    if (!isPriceSliding) {
      fetchProducts(currentPage, selectedCategory, priceRange[1]);
    }
  }, [currentPage, selectedCategory, priceRange, isPriceSliding]);

  // تغيير الفئة المختارة مع إبقاء باقي الفئات
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // لإعادة تعيين الصفحة عند تغيير الفئة
  };

  // تحديث نطاق السعر فقط أثناء السحب
  const handlePriceChange = (e) => {
    setPriceRange([priceRange[0], parseInt(e.target.value)]);
    setIsPriceSliding(true);
  };

  // تحديث المنتجات فقط عند الانتهاء من السحب
  const handlePriceMouseUp = () => {
    setIsPriceSliding(false);
  };

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleFavoriteClick = (productId, isAdding) => {
    if (isAdding) {
      axiosInstance
        .post(`/api/v1/fur/favorites/${productId}`)
        .then((res) => {
          toast.success("Product added to favorites");
          setFavorites([...favorites, { id: productId }]);
        })
        .catch((err) => {
          toast.error("Failed to add to favorites:", err);
        });
    } else {
      axiosInstance
        .delete(`/api/v1/fur/favorites/${productId}`)
        .then((res) => {
          toast.success("Product removed from favorites");
          setFavorites(favorites.filter((fav) => fav.id !== productId));
        })
        .catch((err) => {
          toast.error("Failed to remove from favorites:", err);
        });
    }
  };
  // دالة لتحديث عدد الأعمدة بناءً على الأيقونة المختارة
  const handleGridChange = (columns) => {
    setActiveGrid(columns);
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {/* قسم الهيدر مع خلفية الصورة */}
      <div
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: "url('/home-hotspot-img-1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-semibold">Shop</h1>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm"></div>
        </div>
      </div>

      <div className="bg-[#030303] p-5">
        {/* إضافة أيقونات التحكم بعدد الأعمدة */}
        <div className="flex justify-end m-4 space-x-2">
          {[1, 2, 3, 4].map((column) => (
            <button
              key={column}
              onClick={() => handleGridChange(column)}
              className={`p-2 bg-white rounded-full transition-colors ${
                activeGrid === column
                  ? "hover:bg-orange-500"
                  : "hover:bg-gray-300"
              }`}
            >
              {/* عرض الأيقونة المناسبة بناءً على عدد الأعمدة */}
              {column === 1 && (
                <FaBars
                  className={`${
                    activeGrid === column ? "text-orange-500" : "text-gray-500"
                  }`}
                />
              )}
              {column === 2 && (
                <FaThList
                  className={`${
                    activeGrid === column ? "text-orange-500" : "text-gray-500"
                  }`}
                />
              )}
              {column === 3 && (
                <FaThLarge
                  className={`${
                    activeGrid === column ? "text-orange-500" : "text-gray-500"
                  }`}
                />
              )}
              {column === 4 && (
                <FaTh
                  className={`${
                    activeGrid === column ? "text-orange-500" : "text-gray-500"
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* قسم الفئات مع الخط الفاصل */}
          <div className="col-span-1 relative ml-4">
            <h2 className="text-white mb-4">Collection</h2>
            <ul className="text-white space-y-2">
              {categories.map((category) => (
                <li
                  key={category}
                  className={`cursor-pointer hover:text-[--mainColor] transition-all duration-200 ${
                    selectedCategory === category
                      ? "text-orange-500 font-bold"
                      : ""
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <div className="absolute top-0 right-0 h-full border-r-4 border-gray-700 lg:block hidden"></div>
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-white mb-4">Filter By Price</h2>
              </div>
              <input
                type="range"
                min="10"
                max="2499"
                value={priceRange[1]}
                onChange={handlePriceChange}
                onMouseUp={handlePriceMouseUp} // الفلترة عند رفع الضغط
                className="w-11/12 appearance-none h-3 bg-gray-700 rounded-full outline-none range-input"
                style={{
                  WebkitAppearance: "none",
                  margin: "10px 0",
                }}
              />
              <style>
                {`
                .range-input::-webkit-slider-runnable-track {
                  height: 7px; /* جعل الخط أعرض */
                  background: linear-gradient(
                    to right,
                    orange 0%,
                    orange ${(priceRange[1] / 2499) * 100}%,
                    #555 ${(priceRange[1] / 2499) * 100}%,
                    #555 100%
                  );
                  border-radius: 8px;
                }

                .range-input::-moz-range-track {
                  height: 8px; /* جعل الخط أعرض */
                  background: linear-gradient(
                    to right,
                    orange 0%,
                    orange ${(priceRange[1] / 2499) * 100}%,
                    #555 ${(priceRange[1] / 2499) * 100}%,
                    #555 100%
                  );
                  border-radius: 8px;
                }

                .range-input::-webkit-slider-thumb {
                  appearance: none;
                  height: 15px;
                  width: 15px;
                  margin-top: -5px; /* لضبط السهم ليكون في منتصف الشريط */
                  border-radius: 50%;
                  background: orange;
                  cursor: pointer;
                  border: 2px solid #030303;
                }

                .range-input::-moz-range-thumb {
                  height: 16px;
                  width: 16px;
                  border-radius: 50%;
                  background: orange;
                  cursor: pointer;
                  border: 2px solid #030303;
                }
              `}
              </style>
              <p className="text-white">
                Price: ₹{priceRange[0]} - ₹{priceRange[1]}
              </p>
            </div>
          </div>

          {/* قسم عرض المنتجات */}
          <div
            className={`lg:col-span-3 grid grid-cols-1 lg:grid-cols-${
              activeGrid === 1
                ? "1"
                : activeGrid === 2
                ? "2"
                : activeGrid === 3
                ? "3"
                : "4"
            } gap-6`}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => handleProductClick(product._id)}
                  onFavoriteClick={handleFavoriteClick}
                />
              ))
            ) : (
              <p className="text-white">No products found</p>
            )}
          </div>
        </div>

        <div className="pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

//export default Shop;














import { useState } from "react";
import { FaHeart, FaArrowsAltH, FaExpand } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({
  product,
  onProductClick,
  onFavoriteClick,
  isFavorite,
}) => {
  // console.log("products", product);
  // console.log("isFavorite", onProductClick);
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const newIsFavorite = !isFavoriteState;
    setIsFavoriteState(newIsFavorite); // تبديل الحالة عند الضغط
    onFavoriteClick(product.id, newIsFavorite); // تمرير حالة المفضلة الجديدة للـ Shop
  };

  return (
    <div
      className="relative group cursor-pointer me-4"
      onClick={onProductClick}
    >
      {/* صورة المنتج */}
      <div className="overflow-hidden relative h-80 w-full">
        {/* زيادة طول الصورة */}
        <img
          src={product.images ? product.images[0] : product.photos[0]}
          alt={product.name}
          className="w-full h-full absolute inset-0 transition-opacity duration-1000 ease-in-out"
        />
        {/* صورة Hover */}
        <img
          src={product.images ? product.images[1] : product.photos[1]}
          alt={product.name}
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out"
        />
        {/* زر Select Options في أسفل الصورة */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out z-10">
          <Link to="#" className="text-white text-lg font-semibold p-4">
            Select Options
          </Link>
        </div>
      </div>

      {/* اسم المنتج والسعر */}
      <div className="mt-3 mb-3 text-center">
        <p className="text-lg text-white font-semibold">{product.name}</p>
        <p className="text-sm pb-2 text-white">{product.price} ₹</p>
      </div>

      {/* الأيقونات */}
      <div className="absolute top-4 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out z-20">
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
          {/* <LiaCartPlusSolid
            onClick={() => handleAddToCart()}
            className="text-black"
          /> */}
        </div>
        <div className="p-2 bg-white rounded-full hover:bg-orange-500 transition-colors">
          <FaExpand className="text-black" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

