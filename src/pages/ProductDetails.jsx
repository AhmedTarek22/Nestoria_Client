import React, { useEffect, useState } from "react";
import axios from "axios";
import {FaCheck, FaStar, FaShoppingCart} from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import { useParams } from "react-router-dom";
import axiosInstance from "../apis/axiosConfig.js";
import Loader from "../components/Loader.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ColorNamer from "color-namer";
import { useSelector } from "react-redux";
import { LuIndianRupee } from "react-icons/lu";

function ProductDetails() {
  const translate = useSelector((state) => state.language.translation);
  const { myLang, translation } = useSelector((state) => state.language);
  const params = useParams();
  const [product, setproduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [newColors, setNewColors] = useState([]);
  const navigate = useNavigate();
  const collectionName = [
    `${translate.Home_Decoration}`,
    `${translate.Office_Decoration}`,
    `${translate.Indoor_Decoration}`,
    `${translate.Outdoor_Decoration}`,
  ];
  const [categoryName, setCategoryName] = useState(
    `${translate.Home_Decoration}`
  );
  const [collectionList, setCollectionList] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:5000/api/v1/fur/products/${params.id}`)
      .then((res) => {
        setproduct(res.data.data.product);
        const convertColors = res.data.data.product.color.map((colorHex) => {
          const colorNames = ColorNamer(colorHex);
          return { hex: colorHex, colorName: colorNames.ntc[0].name };
        });
        setNewColors(convertColors);
      })
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/fur/products/homeproducts"
        );
        const filteredCollection = response.data[1].homeProducts.filter(
          (collection) => collection.category === categoryName
        );
        setCollectionList(filteredCollection);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCollection();
  }, [categoryName]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-red-500"];

  const [colorSelect, setColorSelect] = useState("");
  const handleColorSelect = (index, colorName) => {
    setSelectedColor(index);
    setColorSelect(colorName);
  };

  const addToCart = async (quantity, productId, color) => {
    try {
      const response = await axiosInstance.post("/addToCart", {
        quantity,
        productId,
        color,
      });
      if (response) {
        return toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const handleAddToCart = () => {
    if (colorSelect === "") {
      return toast.error("Select color");
    }
    addToCart(quantity, product._id, colorSelect);
  };

  const [minMessageShown, setMinMessageShown] = useState(false);
  const [maxMessageShown, setMaxMessageShown] = useState(false);
  const handleIncreaseQuantity = (product) => {
    if (quantity < product.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
      setMaxMessageShown(false);
    } else {
      if (!maxMessageShown) {
        toast.error("This is the maximum.");
        setMaxMessageShown(true);
      }
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
      setMinMessageShown(false);
    } else {
      if (!minMessageShown) {
        toast.error("This is the minimum.");
        setMinMessageShown(true);
      }
    }
  };

  const [activeTab, setActiveTab] = useState("description");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleWorkshop = (id) => {
    navigate(`/workShopProfile/${id}`);
  };
  
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="bg-[#030303] text-white  p-8 mt-[100px]">
      {/*  section 1111111111111 */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الصور الجانبية */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:h-full">
          {product.images && product.images.length > 0 ? (
            <>
              <div className="flex flex-col space-y-4 h-full">
                <img
                  src={`${product.images[0]}`}
                  alt="Table"
                  className="w-full h-[50%] lg:h-[40%] object-cover rounded-lg"
                />
                <img
                  src={`${product.images[1]}`}
                  alt="Table"
                  className="w-full h-[50%] lg:h-[40%] object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col space-y-4 h-full">
                <img
                  src={`${product.images[1]}`}
                  alt="Table"
                  className="w-full h-[50%] lg:h-[40%] object-cover rounded-lg"
                />
                <img
                  src={`${product.images[0]}`}
                  alt="Table"
                  className="w-full h-[50%] lg:h-[40%] object-cover rounded-lg"
                />
              </div>
            </>
          ) : (
            <p>{translate.No_images_available}</p>
          )}
        </div>

        {/* قسم التفاصيل */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            {myLang === "ar" ? product.nameInArabic : product.name}
          </h2>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`${
                  index < (product.averageRating || 0)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2">
              ({product && product.averageRating && product.averageRating}{" "}
              {translate.customer_reviews})
            </span>
          </div>

          <p className="text-gray-400 mb-4">
            {myLang === "ar"
              ? product.descriptionInArabic
              : product.description}
          </p>

          <div className="text-xl font-semibold mb-4">{product.price} EGP</div>

          {product.quantity === 0 ? (
            <>
              <span className="bg-inherit mb-3 rounded-md border border-orange-500 text-white py-3 px-6 flex items-center justify-center flex-grow">
                {translate.Out_Of_Stock}
              </span>
            </>
          ) : (
            <>
              {/* قسم الألوان */}
              <div className="mb-4">
                <span className="mr-2">{translate.Colors}:</span>
                <div className="flex space-x-2 my-4">
                  {newColors &&
                    newColors.map((color, index) => (
                      <div
                        key={index}
                        style={{ backgroundColor: color.hex }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer  ${
                          selectedColor === index
                            ? "ring-2 ring-orange-500"
                            : ""
                        }`}
                        onClick={() => {
                          handleColorSelect(index, color.colorName);
                        }}
                      >
                        {selectedColor === index && (
                          <FaCheck className="text-white" />
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                {/* كمية المنتج */}
                <div className="flex items-center bg-inherit border rounded-md border-orange-500">
                  <button
                    className="px-3 py-2 rounded-l-lg"
                    onClick={handleDecreaseQuantity}
                    disabled={minMessageShown}
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    className="px-3 py-2 rounded-r-lg"
                    onClick={() => handleIncreaseQuantity(product)}
                    disabled={maxMessageShown}
                  >
                    +
                  </button>
                </div>

                {/* زر إضافة إلى السلة */}
                <button
                  onClick={() => handleAddToCart()}
                  className="bg-inherit rounded-md border border-orange-500 hover:bg-orange-600 text-white py-3 px-6 flex items-center justify-center flex-grow"
                >
                  <FaShoppingCart className="mr-2" /> {translate.Add_to_Cart}
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => {
              if (product?.workshop_id) {
                handleWorkshop(product.workshop_id._id);
              }
            }}
            className="w-full bg-yellow-500 rounded-md hover:bg-yellow-600 text-white py-3"
          >
            {translate.See_more_about_workShop}
            <span className="ml-1">{product?.workshop_id?.name}</span>
          </button>

          {/* معلومات إضافية */}
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <FaShoppingCart className="mr-2" />{" "}
              {translate.Free_Delivery_Free_Shipping}
            </li>
            <li className="flex items-center">
              <FaShoppingCart className="mr-2" />{" "}
              {translate.Secure_Online_Payment}
            </li>
          </ul>

          <p className="text-sm text-gray-400 mt-4">
            {translate.Pick_Up_Available_At_Los}
          </p>
        </div>
      </div>

      {/*  END section 1111111111111*/}
      {/*  start section 2222222222*/}
      <div className="p-4">
        <div className="flex space-x-4 items-center">
          <button
            className={`${
              activeTab === "description"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-black text-white border-black"
            } px-6 py-3 rounded-full border hover:bg-orange-500 hover:border-orange-500 transition-colors duration-300`}
            onClick={() => handleTabClick("description")}
          >
            {translate.Description}
          </button>
          <button
            className={`${
              activeTab === "additionalInfo"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-black text-white border-black"
            } px-6 py-3 rounded-full border hover:bg-orange-500 hover:border-orange-500 transition-colors duration-300`}
            onClick={() => handleTabClick("additionalInfo")}
          >
            {translate.Additional_Information}
          </button>
          <button
            className={`${
              activeTab === "reviews"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-black text-white border-black"
            } px-6 py-3 rounded-full border hover:bg-orange-500 hover:border-orange-500 transition-colors duration-300`}
            onClick={() => handleTabClick("reviews")}
          >
            {translate.Reviews} ({product?.ratings?.length})
          </button>
        </div>

        {/* Sections 1 */}
        <div className="mt-6">
          {activeTab === "description" && (
            <div className="p-6 rounded-lg text-white">
              <div className="flex flex-col lg:flex-row items-center bg-black text-white p-6">
                <div className="md:w-full w-full">
                  <p className="mb-4 text-sm md:text-base">
                    {myLang === "ar"
                      ? product.descriptionInArabic
                      : product.description}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                    <li className="flex items-center">
                      <GiCheckMark className="mr-2 text-[--mainColor]" />
                      {translate.Quantity} : {product.quantity}
                    </li>
                    <li className="flex items-center">
                      <GiCheckMark className="mr-2 text-[--mainColor]" />
                      {translate.Euisimod_in_pellentesque_massa}
                    </li>
                    <li className="flex items-center">
                      <GiCheckMark className="mr-2 text-[--mainColor]" />
                      {translate.Suspendisse_in_est_ante_sitra}
                    </li>
                    <li className="flex items-center">
                      <GiCheckMark className="mr-2 text-[--mainColor]" />
                      {translate.Tincidunt_vitae_semper_quis}
                    </li>
                    <li className="flex items-center">
                      <GiCheckMark className="mr-2 text-[--mainColor]" />
                      {translate.Neque_convallis_cras_semper}
                    </li>
                    <li className="flex items-center">
                      <GiCheckMark className="mr-2 text-[--mainColor]" />
                      {translate.Scelerisque_felis_imperdiet_proin}
                    </li>
                  </ul>
                </div>

                <div className="md:w-full w-full mt-4 md:mt-0">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img
                        src={`${product.images[0]}`}
                        alt="Wooden Table"
                        className="rounded-lg shadow-lg w-full"
                      />
                    </>
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sections 2 */}

          {activeTab === "additionalInfo" && (
            <div className=" p-6 rounded-lg text-white">
              <div className="mt-6">
                <table className="w-full text-left border-collapse border border-orange-500">
                  <thead>
                    <tr>
                      <th className="p-4 border border-orange-500 text-white">
                        {translate.Colors}
                      </th>
                      <th className="p-4 border border-orange-500 text-gray-400">
                        {translate.Blue_Orange_Pink_Purple}
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          )}
          {/* Sections 3 */}

          {activeTab === "reviews" && (
            <div className="p-6 rounded-lg text-white">
              <h2 className="text-white text-xl mb-4">Customer Reviews</h2>

              {product && product.ratings && product.ratings.length > 0 ? (
                product.ratings.map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-700 mb-4 pb-4"
                  >
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className={`${
                            starIndex < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-300">
                        {review.user?.fullName || "User"}
                      </span>
                    </div>
                    <p className="text-gray-400">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No reviews yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Collection */}
      <div className="w-full bg-[#2c2c2c]  py-[120px]">
        <div className="container lg:w-[1440px] mx-auto flex flex-col justify-center items-center my-10">
          <p className="text-[--mainColor]">{translate.EXPLORE_OUR}</p>
          <h2 className="text-2xl md:text-4xl lg:text-6xl text-white">
            {translate.Luxurious_Haven}
          </h2>
          <div className="collectionsName my-8 flex justify-center items-center px-3">
            <ul className="flex justify-center items-center gap-4 text-white">
              {collectionName.map((collection) => {
                return (
                  <li
                    className={`cursor-pointer  ${
                      collection === categoryName ? "border-b-[1px]" : ""
                    }`}
                    key={collection}
                    onClick={() => {
                      setCategoryName(collection);
                    }}
                  >
                    {collection}
                  </li>
                );
              })}
            </ul>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            // <h2>loader</h2>
            <div className="boxs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto px-3">
              {collectionList.map((product) => {
                return (
                  <div className="box" key={product.id}>
                    <div className="imgContainer relative hover:cursor-pointer hover:scale-105 transition-all duration-200">
                      <Link to={`/product-details/${product.id}`}>
                        <div className="relative group">
                          <img
                            src={product.images[0]}
                            alt="collectionImg"
                            className="rounded-lg"
                          />
                          <img
                            src={product.images[1]}
                            alt="Product Hover"
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        </div>
                      </Link>
                      <span className="absolute top-3 right-2 text-white bg-[--mainColor] p-1 text-xs rounded">
                        {translate.ON_SALE}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-[#e2e1e1d0] my-2">
                        {product.category}
                      </p>
                      <h2 className="text-white text-md md:text-xl lg:text-2xl font-semibold">
                        {myLang === "ar" ? product.nameInArabic : product.name}
                      </h2>
                      <p className="flex justify-center items-center text-white my-2">
                        <LuIndianRupee />
                        {product.price} - <LuIndianRupee /> {product.price + 50}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Collection */}
    </div>
  );
}

export default ProductDetails;
