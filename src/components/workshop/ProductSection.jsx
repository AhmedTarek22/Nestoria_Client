import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStar as faStarOutline,
} from "@fortawesome/free-solid-svg-icons";
import "../../css modules/productSection.module.css";
import axiosInstance from "../../apis/axiosConfig";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ workshopId }) => {
  console.log("workshopId", workshopId);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/fur/users/${workshopId}`
      );
      setProducts(response.data.targetProducts);
      console.log("my products :", response.data.targetProducts);
      setTotalPages(Math.ceil(response.data.targetProducts.length / 8)); // Set total pages based on totalProducts and limit
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />
        ))}
        {halfStar && (
          <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStarOutline}
            className="text-gray-300"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative cardBack rounded-lg shadow-lg overflow-hidden group transition-transform transform hover:scale-105"
          >
            {/* "On Sale" Tag */}
            {product.availability && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded group-hover:opacity-100">
                {product.workshop_id.name}
              </div>
            )}

            {/* Product Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                {product.name}
              </h3>
              <h4 className="text-md text-gray-500 mb-2">{product.category}</h4>
              <h4 className=" text-gray-500 mb-2">
                {product.workshop_id.name}
              </h4>
              <p className="text-xl font-bold text-orange-500">
                ₹ {product.price}
              </p>
              <div className="mt-2  flex justify-center">
                {renderStars(product.averageRating ?? 0)}
              </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
              <button
                onClick={() => {
                  navigate(`/product-details/${product._id}`);
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        {/* Previous Button */}
        <button
          className={`flex items-center justify-center px-4 py-2 mx-1 rounded-full shadow-md transition-colors duration-300 ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        {[...Array(totalProducts)].map((_, page) => (
          <button
            key={page + 1}
            className={`px-4 py-2 mx-1 rounded-full shadow-md transition-colors duration-300 ${
              currentPage === page + 1
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          className={`flex items-center justify-center px-4 py-2 mx-1 rounded-full shadow-md transition-colors duration-300 ${
            currentPage === totalProducts
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalProducts))
          }
          disabled={currentPage === totalProducts}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
