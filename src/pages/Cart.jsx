import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosConfig.js";
import { HeaderPages } from "../components/HeaderPages.jsx";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useUserInfoContext } from "../context/UserProvider.jsx";
import { useSelector } from "react-redux";

function Cart() {
  const translate = useSelector((state) => state.language.translation);
  let [subTotal, setSubTotal] = useState(0);
  let [coupon, setCoupon] = useState();
  let [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [isUsedCupon, setIsUsedCoupon] = useState(false);
  const [totalAfterCoupon, setAfterCoupon] = useState(0);
  const navigate = useNavigate();

  const { currentUser } = useUserInfoContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/getCartPrducts");
        const productsWithSubTotal = response.data.map((product) => ({
          ...product,
          subTotal: (product.quantity * product.productId.price).toFixed(2),
        }));
        console.log(productsWithSubTotal);
        setProducts(productsWithSubTotal);
      } catch (error) {
        if (currentUser) {
          toast.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let subTotal = products
      .reduce(
        (acc, product) => acc + product.quantity * product.productId.price,
        0
      )
      .toFixed(2);
    setSubTotal(subTotal);
    setTotal(subTotal);
    setAfterCoupon(subTotal);
  }, [products]);

  const updateCart = async (quantity, productId, color) => {
    try {
      const response = await axiosInstance.put("/updateCart", {
        quantity,
        productId,
        color,
      });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleToUpdateQuantity = (newQuantity, productId, color) => {
    if (newQuantity && productId && color) {
      updateCart(newQuantity, productId, color);
    } else {
      toast.error("Invalid data");
    }
  };

  const [minMessageShown, setMinMessageShown] = useState(false);
  const [maxMessageShown, setMaxMessageShown] = useState(false);
  const handleQuantityChange = (action, product) => {
    let newQuantity = product.quantity;

    if (action === "increase") {
      if (newQuantity < product.productId.quantity) {
        newQuantity += 1;
        setMaxMessageShown(false);
      } else {
        if (!maxMessageShown) {
          toast.error("This is the maximum.");
          setMaxMessageShown(true);
        }
      }
    } else if (action === "decrease") {
      if (newQuantity > 1) {
        newQuantity -= 1;
        setMinMessageShown(false);
      } else {
        if (!minMessageShown) {
          toast.error("This is the minimum.");
          setMinMessageShown(true);
        }
      }
    }

    if (newQuantity !== product.quantity) {
      handleToUpdateQuantity(newQuantity, product.productId._id, product.color);
      const updatedProduct = {
        ...product,
        quantity: newQuantity,
        subTotal: newQuantity * product.productId.price,
      };
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.productId._id === product.productId._id && p.color === product.color
            ? updatedProduct
            : p
        )
      );
    }
  };

  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/v1/fur/coupons/getAllCoupons"
        );
        if (res) {
          setCoupons(res.data.coupons);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchCoupons();
  }, []);
  const handleCoupon = (e) => {
    setCoupon(e.target.value);
  };
  const handleSubmitCoupon = (e) => {
    e.preventDefault();
    if (isUsedCupon) {
      return toast.error("Not allowed because coupon used");
    }

    const foundCoupon = coupons.find((c) => c.code === coupon);
    if (foundCoupon) {
      if (!foundCoupon.status) {
        return toast.error("Coupon has expired");
      }
      setAfterCoupon(total - total * (foundCoupon.discount / 100));
      setIsUsedCoupon(true);
      toast.success("Coupon applied successfully");
    } else {
      setAfterCoupon(total);
      toast.error("Invalid Coupon");
    }
  };

  const handleRemoveProduct = async (productCartId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    });
    if (!confirmed.isConfirmed) {
      return;
    }
    try {
      const removeProduct = await axiosInstance.delete(
        `/removeFromCart/${productCartId}`
      );
      if (removeProduct) {
        setProducts(
          products.filter((product) => product._id !== productCartId)
        );
        toast.success("Product removed");
      } else {
        toast.error("Failed to remove the product");
      }
    } catch (err) {
      toast.error("An error occurred while removing the product");
    }
  };

  const handleCheckoutBtn = async () => {
    const dataToLocal = {
      products: products,
      subTotal: Number(Number(subTotal).toFixed(2)),
      total: Number(Number(totalAfterCoupon).toFixed(2)),
    };
    localStorage.setItem("ordersLocal", JSON.stringify(dataToLocal));
    navigate("/checkout");
  };

  return (
    <div>
      {/* section header */}
      <HeaderPages namePage="Cart"></HeaderPages>
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
        {/* section products empty */}
        {!products.length ? (
          <div>
            <div className="bg-[#2B2B2B] text-center md:text-start rounded-br-xl rounded-bl-xl relative">
              <span className="absolute bg-[#019ED5] w-full h-[3px] block"></span>
              <div className="p-6 text-white font-bold">
                {translate.Your_cart_div}
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
            {/* section products cart */}
            <div className="bg-[#2B2B2B] text-center md:text-start rounded-br-xl rounded-bl-xl relative">
              <span className="absolute bg-[#019ED5] w-full h-[3px] block"></span>
              <div className="p-6 text-white font-bold">
                {translate.Got_div}{" "}
                <Link
                  to={""}
                  className="hover:text-[#C26510] duration-500 underline"
                >
                  Use it here!
                </Link>
              </div>
            </div>

            {/* products */}
            <div className="mt-10 mb-5 py-5 border border-[#393938] md:border-[#C26510] rounded-2xl">
              <ul className="px-7 hidden md:grid grid-cols-10 items-center text-white">
                <li className="col-span-4">{translate.Product}</li>
                <li className="col-span-2">{translate.Price}</li>
                <li className="col-span-2">{translate.Quantity}</li>
                <li className="col-span-2">{translate.SubTotal}</li>
              </ul>
              <span className="my-6 bg-[#393938] w-full h-[2px] hidden md:block"></span>
              {products &&
                products.map((product, index) => (
                  <div key={`${product.productId._id} - ${index}`}>
                    <ul className="md:relative px-7 grid grid-cols-10 items-center">
                      <li className="col-span-full md:col-span-4 flex flex-col md:flex-row items-center gap-0 md:gap-6">
                        <figure className="relative md:static w-full h-[300px] md:h-[100px] md:w-24">
                          <img
                            className="w-full h-full rounded-lg"
                            src={`${product.productId.images[0]}`}
                            alt=""
                          />
                          <li
                            onClick={() => handleRemoveProduct(product._id)}
                            className="absolute z-50 text-center w-[26px] h-[26px] rounded-[50%] bg-[#C26510] hover:bg-[#9F2124] hover:cursor-pointer duration-500 top-5 right-5 md:top-1/2 md:-translate-y-1/2 md:right-12 text-white"
                          >
                            <FontAwesomeIcon icon={faX} />{" "}
                          </li>
                        </figure>
                        <div className="mt-5 md:mt-0 text-center md:text-start">
                          <p className="text-xl md:text-base text-white hover:text-[#C26510] duration-500">
                            {product.productId.name}
                          </p>
                          <span className="mt-3 block text-[#999999]">
                            {translate.Color}: <span>{product.color}</span>
                          </span>
                        </div>
                      </li>
                      <li className="col-span-5 md:col-span-2 text-center md:text-start text-white">
                        EGP {product.productId.price}
                      </li>
                      <li className="col-span-5 md:col-span-2 text-center md:text-start ml-auto mr-auto mt-6 md:m-0">
                        <div className="p-3 w-fit flex gap-5 rounded-3xl border border-[#C26510]">
                          <button
                            id="decrease"
                            onClick={() =>
                              handleQuantityChange("decrease", product)
                            }
                            disabled={minMessageShown}
                            className="text-[#C26510]"
                          >
                            -
                          </button>
                          <span className="text-white">{product.quantity}</span>
                          <button
                            id="increase"
                            onClick={() =>
                              handleQuantityChange("increase", product)
                            }
                            disabled={maxMessageShown}
                            className="text-[#C26510]"
                          >
                            +
                          </button>
                        </div>
                      </li>
                      <li className="col-span-full my-5 block md:hidden h-[1px] bg-[#C26510]"></li>
                      <li className="col-span-5 md:col-span-2 text-center md:text-start top-1/2 md:top-0 translate-x-1/2 md:translate-x-0 text-white">
                        EGP {product.subTotal}
                      </li>
                    </ul>
                    <span
                      className={`w-full h-[1px] my-5 bg-[#C26510] ${
                        index !== products.length - 1 && "block"
                      }`}
                    ></span>
                  </div>
                ))}
            </div>

            {/* coupon */}
            <div className="mt-14 p-12 border border-[#5E5E5E] rounded-2xl">
              <div className="text-center md:text-start text-white text-2xl font-bold mb-4">
                {translate.Coupon}:
              </div>
              <form
                onSubmit={(e) => handleSubmitCoupon(e)}
                className="flex flex-col md:flex-row"
              >
                <input
                  type="text"
                  name="coupon"
                  value={coupon}
                  onChange={(e) => handleCoupon(e)}
                  placeholder="Coupon code"
                  className="text-center md:text-start w-full md:w-3/4 text-[#5E5E5E] mr-3 py-3 px-6 bg-transparent border border-[#5E5E5E] focus:outline-none focus:border-[#C26510] duration-500 rounded-3xl"
                />
                <button className="mt-5 w-full md:mt-0 md:w-fit px-6 py-3 text-[#C26510] border border-[#C26510] rounded-3xl hover:text-white hover:bg-[#C26510] duration-500">
                  {translate.Apply_Coupon}
                </button>
              </form>
            </div>

            {/* cart totals */}
            <div className="text-center md:text-start mt-14 mb-14 px-12 py-10 border border-[#5E5E5E] rounded-2xl">
              <div>
                <h3 className="mb-5 text-2xl text-white">
                  {translate.Cart_Totals}
                </h3>
                <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between">
                  <span className="text-white">{translate.Subtotal}</span>
                  <span className="text-white">EGP {subTotal}</span>
                </div>
                <span className="my-4 bg-[#5E5E5E] w-full h-[1px] block"></span>
                <div>
                  <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between">
                    <span className="text-white">{translate.Shipping}</span>
                    <span className="text-white">
                      {translate.Free_Shipping}
                    </span>
                  </div>
                  <div className="md:text-end">
                    <div className="flex flex-col my-3">
                      <span className="text-white mb-1">
                        {translate.Shipping_to}
                      </span>
                      <span className="text-white font-bold">
                        {currentUser.address && currentUser.address}
                      </span>
                    </div>
                    <div>
                      <Link
                        to="/billingAddress"
                        className="text-white underline cursor-pointer hover:text-[#C26510] duration-500"
                      >
                        {translate.Change_Address}
                      </Link>
                    </div>
                  </div>
                </div>
                <span className="my-4 bg-[#5E5E5E] w-full h-[1px] block"></span>
                <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between text-white">
                  <span>{translate.Total}</span>
                  <span
                    className={`${isUsedCupon && "line-through duration-500"}`}
                  >
                    EGP {total}
                  </span>
                </div>
                {isUsedCupon && (
                  <span className="text-white flex justify-center md:justify-end mt-2 duration-500">
                    EGP {Number(totalAfterCoupon).toFixed(2)}
                  </span>
                )}
                <span className="my-4 bg-[#5E5E5E] w-full h-[1px] block"></span>
                <button
                  onClick={() => handleCheckoutBtn()}
                  className="w-full md:w-fit mt-5 px-6 py-3 text-[#C26510] border border-[#C26510] rounded-3xl hover:text-white hover:bg-[#C26510] duration-500"
                >
                  {translate.Proceed_To_Checkout}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Cart;
