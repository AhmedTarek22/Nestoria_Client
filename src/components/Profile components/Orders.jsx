import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../apis/axiosConfig";
import { GoCheckCircle } from "react-icons/go";
import Swal from "sweetalert2";
import { useUserInfoContext } from "../../context/UserProvider";
import AddReviewModal from "../AddReviewModal";
import Loader from "../Loader";

export function Orders() {
  const [orders, setOrders] = useState("");
  const [isDelivered, setIsDelivered] = useState({});
  const { currentUser } = useUserInfoContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userShipping, setUserShipping] = useState([]);
  const [isReview, setIsReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = (
          await axiosInstance.get("/api/v1/fur/orders/getordersproducts")
        ).data;
        if (res) {
          setOrders(res);
          const shippingDetails = res.map((order) => ({
            orderId: order._id,
            company: order.shippingAddress.company || "",
            houseNumber: order.shippingAddress.houseNumber || "",
            apartment: order.shippingAddress.apartment || "",
            city: order.shippingAddress.city || "",
            PINCode: order.shippingAddress.PINCode || "",
            state: order.shippingAddress.state || "",
          }));
          setUserShipping(shippingDetails);
        }
      } catch (err) {
        toast.error(err);
      }
    };
    fetchOrders();
  }, []);

  const handleClickDelivered = async (e, orderId, productId, color) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Did you receive the product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, receive it!",
    });
    if (!confirmed.isConfirmed) {
      return;
    }
    setIsDelivered({
      ...isDelivered,
      [`${orderId}-${productId}-${color}`]: true,
    });
    try {
      const res = await axiosInstance.put(
        "/api/v1/fur/orders/updateStateProduct",
        {
          orderId,
          productId,
          color,
        }
      );
      if (res) {
        toast.success("Product receipt confirmed");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  /// review function
  const handleAddReview = (productId, workshop_id) => {
    console.log("product", productId, "workshop", workshop_id);
    setIsModalOpen(true);
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {orders.length === 0 ? (
        <div className="bg-[#2B2B2B] text-center md:text-start rounded-br-xl rounded-bl-xl relative">
          <span className="absolute bg-[#019ED5] w-full h-[2px] block"></span>
          <div className="p-6 text-[#FBFBFB] flex justify-between">
            <span>No order has been made yet.</span>
            <Link to="/shop" className="underline hover:text-[#C26510]">
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* products */}
          <div className="bg-transparent border border-[#C26510] rounded-lg p-6">
            {orders &&
              orders.map((order, indexOrder) => (
                <div key={`${order.userId} - ${indexOrder}`}>
                  {/* Order Header */}
                  <div className="flex justify-between items-center mb-4 text-white">
                    <div className="text-2xl font-semibold">
                      Order {order._id.slice(-5)}
                    </div>
                    <div className="text-white text-xl font-semibold">
                      Total: {order.total} EGP
                    </div>
                  </div>
                  {order.products?.map((product, index) => {
                    const productKey = `${order?._id}-${product.productId?._id}-${product.color}`;
                    return (
                      <div
                        key={`${order._id}-${product.productId?._id}-${index}`}
                        className="relative bg-white rounded-lg shadow-lg p-6 mb-4"
                      >
                        <div className="grid grid-cols-12 gap-4 mb-2">
                          {/* Order Item Details */}
                          <div className="flex items-center col-span-12 lg:col-span-6 mb-4">
                            <div className="w-1/3 lg:w-1/4">
                              <img
                                className="w-full h-full object-cover"
                                src={product.productId?.images[0]}
                                alt="Product"
                              />
                            </div>
                            <div className="flex-1 mt-0 ml-4">
                              <div className="text-lg font-semibold">
                                {product.productId?.name}
                              </div>
                              <div className="text-gray-500">
                                {product.productId?.price} EGP
                              </div>
                              <div className="text-gray-500">
                                Color: {product?.color}
                              </div>
                              <div className="text-gray-500">
                                Quantity: {product?.quantity}
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="col-span-6 lg:col-span-3">
                            <div className="font-semibold mb-2">
                              Shipping Address
                            </div>
                            <div>{currentUser.address}</div>
                            <div>{userShipping[indexOrder]?.city}</div>
                            <div>
                              {userShipping[indexOrder]?.houseNumber}{" "}
                              {userShipping[indexOrder]?.apartment}
                            </div>
                          </div>

                          {/* Shipping Updates */}
                          <div className="col-span-6 lg:col-span-3">
                            <div className="font-semibold mb-2">
                              Shipping Updates
                            </div>
                            <div>{currentUser.email}</div>
                            <div>{currentUser.phone}</div>
                          </div>
                        </div>

                        {product.deliveryStatus !== "Cancelled" ? (
                          <>
                            {" "}
                            {/* Progress Bar */}
                            <div className="border-t pt-3">
                              <div className="flex justify-between items-center">
                                <div className={`text-gray-600 mb-2`}>
                                  {/* Preparing to ship on September 24, 2024 */}
                                </div>
                                {product.deliveryStatus === "Shipped" && (
                                  <GoCheckCircle
                                    onClick={(e) => {
                                      if (!isDelivered[productKey])
                                        handleClickDelivered(
                                          e,
                                          order?._id,
                                          product.productId?._id,
                                          product?.color
                                        );
                                    }}
                                    className={`text-2xl ${
                                      isDelivered[productKey]
                                        ? "text-white bg-blue-500"
                                        : "text-blue-500 hover:bg-blue-500 hover:text-white"
                                    } cursor-pointer rounded-full`}
                                  />
                                )}
                              </div>
                              <div className="relative w-full bg-gray-200 h-2 rounded-full">
                                <div
                                  className="absolute bg-blue-500 h-2 rounded-full duration-500"
                                  style={{
                                    width: isDelivered[productKey]
                                      ? "100%"
                                      : product.deliveryStatus === "Processing"
                                      ? "35%"
                                      : product.deliveryStatus === "Shipped"
                                      ? "65%"
                                      : product.deliveryStatus ===
                                          "Delivered" && "100%",
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <div className={`font-semibold text-blue-600`}>
                                  Order placed
                                </div>
                                <div
                                  className={`font-semibold ${
                                    [
                                      "Processing",
                                      "Shipped",
                                      "Delivered",
                                    ].includes(product.deliveryStatus) &&
                                    "text-blue-600"
                                  }`}
                                >
                                  Processing
                                </div>
                                <div
                                  className={`font-semibold ${
                                    ["Shipped", "Delivered"].includes(
                                      product.deliveryStatus
                                    ) && "text-blue-600"
                                  }`}
                                >
                                  Shipped
                                </div>
                                <div
                                  className={`font-semibold ${
                                    (["Delivered"].includes(
                                      product.deliveryStatus
                                    ) ||
                                      isDelivered[productKey]) &&
                                    "text-blue-600"
                                  },`}
                                >
                                  Delivered
                                </div>
                              </div>
                            </div>
                            {(["Delivered"].includes(product.deliveryStatus) ||
                              isDelivered[productKey]) && (
                              <button
                                disabled={isReview || product.isRated}
                                onClick={(e) =>
                                  handleAddReview(
                                    product.productId._id,
                                    product.productId.workshop_id
                                  )
                                }
                                className={`mt-2 flex ms-auto text-center left-1/2 px-4 py-2 rounded-3xl  text-white ${
                                  !product.isRated && !isReview
                                    ? "hover:text-[#C26510] border border-[#C26510]  bg-[#C26510] hover:bg-white duration-500"
                                    : "bg-[#c2661091] cursor-not-allowed"
                                }`}
                              >
                                {isReview || product.isRated
                                  ? "Reviewed"
                                  : "Add Review"}
                              </button>
                            )}
                            <AddReviewModal
                              isOpen={isModalOpen}
                              onClose={() => setIsModalOpen(false)}
                              workshop_id={product?.productId?.workshop_id}
                              productId={product?.productId?._id}
                              setIsReview={setIsReview}
                              setIsLoading={setIsLoading}
                              color={product.color}
                              orderId={order._id}
                              isRated={product.isRated}
                            />
                          </>
                        ) : (
                          <div className="absolute border-4 border-red-500 rounded-lg p-1 top-1/2 -translate-y-1/2 start-1/2 -translate-x-1/2 transform -rotate-12 text-red-500 text-5xl">
                            Cancelled
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <span
                    className={`w-full h-[1px] my-5 bg-[#C26510] ${
                      indexOrder !== orders.length - 1 && "block"
                    }`}
                  ></span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
