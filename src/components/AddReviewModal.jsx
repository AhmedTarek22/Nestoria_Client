// Modal.js
import { useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import axiosInstance from "../apis/axiosConfig";
import { toast } from "react-toastify";
const AddReviewModal = ({
  isOpen,
  onClose,
  workshop_id,
  productId,
  setIsReview,
  setIsLoading,
  orderId,
  color,
  isRated,
}) => {
  const [workshopRating, setWorkshopRating] = useState(0);
  const [productRating, setProductRating] = useState(0);
  const [workshopComment, setWorkshopComment] = useState("");
  const [productComment, setProductComment] = useState("");
  const [err, setErr] = useState("");

  if (!isOpen) return null;

  console.log({
    workshop_id,
    productId,
    workshopRating,
    productRating,
    workshopComment,
    productComment,
    orderId,
    color,
    isRated,
  });
  async function handleSubmit() {
    if (
      workshopComment === "" ||
      productComment === "" ||
      workshopRating === 0 ||
      productRating === 0
    ) {
      setErr("All Fields Are Require");
      return;
    }
    console.log({
      workshop_id,
      productId,
      workshopRating,
      productRating,
      workshopComment,
      productComment,
      orderId,
      color,
    });
    try {
      setIsLoading(true);
      const req = await axiosInstance.put("/api/v1/fur/profile/addreview", {
        workshop_id: workshop_id,
        productId: productId,
        workshopRating: workshopRating,
        productRating: productRating,
        productComment: productComment,
        workshopComment: workshopComment,
        orderId,
        color,
      });
    } catch (error) {
      toast.success("there was an error, please tyr again later");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
    onClose();
    setIsReview(true);
  }

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="text-xl font-bold mb-4 text-center">Leave a Review</h2>

        {/* Workshop Rating Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Rate the Workshop</h3>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                filled={index < workshopRating}
                onClick={() => setWorkshopRating(index + 1)}
              />
            ))}
          </div>
        </div>

        {/* Product Rating Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Rate the Product</h3>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                filled={index < productRating}
                onClick={() => setProductRating(index + 1)}
              />
            ))}
          </div>
        </div>

        {/* productComment Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Your Comment about product
          </h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
            rows="4"
            value={productComment}
            onChange={(e) => setProductComment(e.target.value)}
            placeholder="Leave your comment here..."
          />
        </div>
        {/* Comment Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Your Comment about workshop
          </h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
            rows="4"
            value={workshopComment}
            onChange={(e) => setWorkshopComment(e.target.value)}
            placeholder="Leave your comment here..."
          />
        </div>
        <span
          className={`${
            err ? "inline-block" : "hidden"
          } text-red-500 text-center bg-gray-200 w-full mb-2 py-2 relative`}
        >
          {err}
          <span>
            <WarningIcon className="!text-red-600 absolute top-[-15px] right-[-8px]" />
          </span>
        </span>
        {/* Submit Button */}
        <button
          className=" w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

const Star = ({ filled, onClick }) => (
  <span
    onClick={onClick}
    className={`cursor-pointer text-2xl ${
      filled ? "text-yellow-500" : "text-gray-300"
    }`}
  >
    ★
  </span>
);

export default AddReviewModal;
