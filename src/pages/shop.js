import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.js";
import Pagination from "../components/Pagination.js";
import axiosInstance from "../apis/axiosConfig.js";
import Loader from "../components/Loader.jsx";
import { HeaderPages } from "../components/HeaderPages.jsx";
import { toast } from "react-toastify";
import { FaTh, FaThLarge, FaThList, FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useSearchContext } from "../context/SearchContext.jsx";

const Shop = () => {
  const translate = useSelector((state) => state.language.translation);

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
    // `${translate.All}`,
    // `${translate.Sofa}`,
    // `${translate.Outdoor_Sofa}`,
    // `${translate.Dining_Table}`,
    // `${translate.Coffee_Table}`,
    // `${translate.Bookshelf}`,
    // `${translate.Bed_Frame}`,
    // `${translate.Desk}`,
    // `${translate.Wardrobe}`,
    // `${translate.Couch}`,
    // `${translate.Bed}`,
    // `${translate.Recliners}`,
    // `${translate.Home_Decoration}`,
    // `${translate.Office_Decoration}`,
    // `${translate.Indoor_Decoration}`,
    // `${translate.Outdoor_Decoration}`,
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([10, 2499]);
  const [maxPrice, setMaxPrice] = useState(2499);
  const productsPerPage = 10;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceSliding, setIsPriceSliding] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeGrid, setActiveGrid] = useState(3);

  const { products, setProducts } = useSearchContext();

  // جلب المنتجات المفضلة
  useEffect(() => {
    const isLogin = !!localStorage.getItem("token");

    if (!isLogin) {
      return;
    }
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
    setIsLoading(true);
    axiosInstance
      .get(
        `/api/v1/fur/products?page=${page}&limit=${productsPerPage}&category=${
          category !== "All" ? category : ""
        }&maxPrice=${maxPrice}`
      )

      .then((res) => {
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
    const isLogin = !!localStorage.getItem("token");

    if (!isLogin) {
      navigate("/login");
      toast.error("you should sign in first");
      return;
    }

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
      <HeaderPages namePage={`${translate.shop}`} />

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
            <h2 className="text-white mb-4">{translate.Collection}</h2>
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
                <h2 className="text-white mb-4">{translate.Filter_By_Price}</h2>
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
                {translate.Price}: EGP{priceRange[0]} - EGP{priceRange[1]}
              </p>
            </div>
          </div>

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
                  onProductClick={() => handleProductClick(product._id)}
                  onFavoriteClick={handleFavoriteClick}
                  isSingleColumn={activeGrid === 1}
                />
              ))
            ) : (
              <p className="text-white">{translate.No_products_found}</p>
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

export default Shop;
