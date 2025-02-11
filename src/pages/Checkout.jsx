import { useEffect, useState } from "react";
import { HeaderPages } from "../components/HeaderPages";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutForm from "../payment/CheckoutForm";
import { ShippingAddress } from "../components/Profile components/ShippingAddress";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

function Checkout() {
  const translate = useSelector((state) => state.language.translation);
  // const isOkAddress = false;
  const location = useLocation();
  const isCheckoutPage = location.pathname === "/checkout";
  const isOkAddress = isCheckoutPage ? true : false;

  const [userAddress, setUserAdderss] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prices, setPrices] = useState({
    subTotal: "",
    total: "",
  });
  const { subTotal, total } = prices;
  useEffect(() => {
    const data = localStorage.getItem("ordersLocal");
    console.log("data", JSON.parse(data));
    if (data) {
      const parsedData = JSON.parse(data);
      setOrderData(parsedData);
      setPrices({
        ...prices,
        subTotal: parsedData.subTotal,
        total: parsedData.total,
      });
    }
  }, []);

  const userShippingAdderss = (data) => {
    setUserAdderss(data);
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <HeaderPages namePage="Checkout" />
      <section
        className="py-16 px-4 md:px-10"
        style={{
          backgroundImage: "url('/body-bg.png')",
          backgroundPosition: "left top",
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
          backgroundAttachment: "scroll",
          backgroundColor: "#101010",
        }}
      >
        {/* DIV 1 */}
        <div className=" container lg:w-[1440px]  mx-auto bg-[#2B2B2B] text-center md:text-start rounded-br-xl rounded-bl-xl relative mb-4">
          <span className="absolute bg-[#019ED5] w-full h-[3px] block"></span>
          <div className="p-6 text-white  flex justify-center md:justify-start items-center gap-2">
            <span>{translate.Got_gift}</span>
            <Link
              to="#"
              className="text-white hover:text-[--mainColor] transition-colors"
              style={{ borderBottom: "2px solid white" }}
              onClick={() =>
                toast.success("this feature is not available yet ❤️")
              }
            >
              {translate.Use_it_here}
            </Link>
          </div>
        </div>

        <div className="container lg:w-[1440px]  mx-auto text-center md:text-start mt-14 mb-14 px-12 py-10 border border-[#5E5E5E] rounded-2xl">
          <ShippingAddress
            check={isOkAddress}
            sendAddressToCheckout={userShippingAdderss}
          ></ShippingAddress>
        </div>

        {/* Your order */}
        <div className="container lg:w-[1440px]  mx-auto text-center md:text-start mt-14 mb-14 px-12 py-10 border border-[#5E5E5E] rounded-2xl">
          <div>
            <h3 className="mb-5 text-2xl text-white">{translate.Your_order}</h3>
            <div className="mb-8">
              <ul className="md:relative px-7 flex md:justify-between justify-center items-center flex-wrap gap-4">
                {/* <ul className="md:relative px-7 grid grid-cols-10 items-center gap-4"> */}
                {orderData &&
                  orderData.products.map((order) => (
                    <li
                      key={order._id}
                      className="md:max-w-[32%]   col-span-full md:col-span-4 flex flex-col md:flex-row items-center gap-0 md:gap-6"
                    >
                      <figure className="relative md:static w-full h-[300px] md:h-[100px] md:w-24">
                        <img
                          className="w-full h-full rounded-lg"
                          src={order.productId.images[0]}
                          // src="images/home/shop-12-01.jpg"
                          alt="img1"
                        />
                      </figure>
                      <div className="mt-5 md:mt-0 text-center md:text-start">
                        <p className="text-xl md:text-base text-white ">
                          {order.productId.name}
                        </p>
                        <p className="text-xl md:text-base text-[#999999] ">
                          x {order.quantity}
                        </p>

                        <span className="mt-1 block text-[#999999]">
                          {translate.Color}: <span>{order.color}</span>
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <span className="my-4 bg-[--mainColor] w-full h-[1px] block"></span>
            <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between">
              <span className="text-white">{translate.Subtotal}</span>
              <span className="text-white">EGP {subTotal}</span>
            </div>
            <span className="my-4 bg-[--mainColor] w-full h-[1px] block"></span>

            <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between">
              <span className="text-white">{translate.Shipping}</span>
              <span className="text-white">{translate.Free_Shipping}</span>
            </div>
            <span className="my-4 bg-[--mainColor] w-full h-[1px] block"></span>

            <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between">
              <span className="text-white">{translate.Total}</span>
              <span className="text-white">EGP {total}</span>
            </div>

            <span className="mb-6 my-4 bg-[#5E5E5E] w-full h-[1px] block"></span>

            <div className="mb-8 bg-[#2B2B2B] text-center md:text-start rounded-br-xl rounded-bl-xl relative">
              <span className="absolute bg-[#019ED5] w-full h-[3px] block"></span>
              <div className="p-8 text-white ">
                {translate.Kindly_verify}
              </div>
            </div>
            <span className="my-4 bg-[#5E5E5E] w-full h-[1px] block"></span>

            {/* تعديل حجم النص */}
            <span className="mt-3 block text-[#999999] text-sm">
              {translate.PhoYour_personalne}
              <Link
                to="#"
                className="text-white hover:text-[--mainColor] transition-colors ms-1"
                style={{ borderBottom: "2px solid white" }}
              >
                {translate.Privacy_Policy}
              </Link>
            </span>
            <CheckoutForm
              sendAdderss={userAddress}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
