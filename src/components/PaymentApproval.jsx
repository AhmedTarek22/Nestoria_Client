import { useEffect, useState } from "react";
import axiosInstance from "../apis/axiosConfig";
import AdminLoader from "./adminLoader";
import Swal from "sweetalert2";

function PaymentApproval() {
  const [adminBalance, setAdminBalance] = useState({
    pendingBalance: 0,
    availableBalance: 0,
  });
  const [payments, setPayments] = useState([]);
  const [mergeRequests, setMergeRequests] = useState([]);
  const [numOfRequests, setNumOfRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAdminBalance = async () => {
      setIsLoading(true);
      try {
        const req = await axiosInstance.get("/api/v1/admin/get-admin-balance");
        setAdminBalance((prev) => ({
          ...prev,
          pendingBalance: req.data.pendingBalance,
          availableBalance: req.data.availableBalance,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAdminBalance();
  }, []);

  useEffect(() => {
    const getMoneyRequests = async () => {
      setIsLoading(true);
      try {
        const req = await axiosInstance.get("/api/v1/admin/money-requests");
        // setAdminBalance(req.data.adminBalance);
        if (!req.data.orders) return;
        setPayments(req.data.orders);
        setMergeRequests((prev) => {
          const mergeRequests = req.data.orders.flatMap((payment) => {
            const orderId = payment._id;
            return payment.products.map((product) => {
              return {
                orderId,
                productId: product._id,
                color: product.color,
                userId: product._id,
                quantity: product.quantity,
              };
            });
          });
          return mergeRequests;
        });

        setNumOfRequests((prev) => {
          const requests = req.data.orders.map((payment) => {
            return payment.products.length;
          });
          const totalRequests = requests.reduce((curr, acc) => {
            return curr + acc;
          }, 0);

          return totalRequests;
        });

        console.log(req.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getMoneyRequests();
  }, []);

  if (isLoading) {
    return <AdminLoader />;
  }

  const approvePayment = async (
    email,
    amount,
    connectedAccountId,
    orderId,
    userId,
    productId,
    color
  ) => {
    console.log(
      "orderId",
      orderId,
      "userId",
      userId,
      "productId",
      productId,
      "color",
      color
    );
    const reqAmount = Number(amount.toString().replaceAll(/,/g, ""));
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to transfer (${
        reqAmount - reqAmount * 0.1
      }) EGP   To:${email}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, transfer it!",
    });
    if (!confirmed.isConfirmed) {
      return;
    }

    try {
      setIsLoading(true);
      console.log(reqAmount);

      await axiosInstance.post(`/api/v1/admin/create-transfer`, {
        amount: reqAmount,
        currency: "usd",
        connectedAccountId: connectedAccountId,
        orderId: orderId,
        userId,
        productId,
        color,
      });

      // setPayments((prev) => {
      //   const filterReq = mergeRequests.filter(
      //     (request) =>
      //       request.orderId !== orderId &&
      //       request.productId !== productId &&
      //       request.color !== color &&
      //       request.userId !== userId
      //   );
      //   return filterReq;
      // });

      setNumOfRequests((prev) => prev - 1);
      // const filterdRequests = [
      //   ...payments.map((payment) => {
      //     return payment.map((product) => {
      //       return product;
      //     });
      //   }),
      // ];
      // console.log("filterdRequests", filterdRequests);
      Swal.fire("Transfered!", "The amount has been transfered.", "success");
      // window.location.reload();
    } catch (error) {
      await Swal.fire(
        "Error!",
        "There was an issue transfering the money.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <AdminLoader />;
  }
  return (
    <>
      <section id="payments">
        <h2 className="text-end text-xl bg-[#4288f8] w-fit mb-3 md:ml-auto md:mx-0 mx-auto p-2 rounded-lg text-white">
          <span className="font-semibold">Available Balance: </span>
          {adminBalance.availableBalance
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          EGP
        </h2>
        <h2 className="text-end text-xl bg-[#dd9d26] w-fit mb-3 md:ml-auto md:mx-0 mx-auto p-2 rounded-lg text-white">
          <span className="font-semibold">Pending Balance: </span>
          {adminBalance.pendingBalance
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          EGP
        </h2>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 w-full text-center ">
          Payment Approvals ({numOfRequests})
        </h2>
        <div className="">
          {payments.map((payment) => {
            return payment.products.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-4 bg-white shadow-md rounded-lg p-6  "
              >
                <div>
                  <p className="text-gray-800">
                    {payment.userId.fullName} -{" "}
                    {product?.price
                      ?.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    EGP
                  </p>
                  <p className="text-gray-600">
                    To: {product?.productId?.workshop_id?.name}, Email:{" "}
                    {product?.productId?.workshop_id?.email}
                  </p>
                  <p className="text-gray-600">
                    Product: {product?.productId?.name}
                  </p>
                  <p className="text-gray-600">
                    Quantity: {payment.products[0].quantity}
                  </p>
                  <p className="text-gray-600">
                    Price/unit:{" "}
                    {product?.productId?.price
                      ?.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    <span className="ml-1">EGP</span>
                  </p>
                  <p className="text-gray-600">Status: Customer Confirmed</p>
                  <p className="text-gray-600">
                    created At: {payment?.updatedAt?.split("T")[0]}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() =>
                      approvePayment(
                        product?.productId?.workshop_id.email,
                        product?.price
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        product?.productId?.workshop_id?.StripeAccountID,
                        payment._id,
                        payment.userId._id,
                        product._id,
                        product.color
                      )
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Approve Payment
                  </button>
                </div>
              </div>
            ));
          })}
        </div>
      </section>
    </>
  );
}

export default PaymentApproval;
