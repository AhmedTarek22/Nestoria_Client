import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../apis/axiosConfig";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";

export function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [clickEdit, setClickEdit] = useState(false);
  const [couponEdit, setCouponEdit] = useState("");
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/v1/fur/coupons/getAllCoupons"
        );
        if (res) {
          setCoupons(res.data.coupons);
          const initialActiveState = res.data.coupons.reduce((acc, coupon) => {
            acc[coupon._id] = coupon.status;
            return acc;
          }, {});
          setIsActive(initialActiveState);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchCoupons();
  }, []);

  const [isActive, setIsActive] = useState({});
  const handleStatus = async (couponId) => {
    try {
      const updateStatus = await axiosInstance.put(
        "/api/v1/fur/coupons/updateStatusCoupon",
        {
          couponId,
        }
      );
      if (updateStatus) {
        setIsActive({
          ...isActive,
          [couponId]: !isActive[couponId],
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const [isAddCoupon, setIsAddCoupon] = useState(false);
  const handleClickAddCoupon = () => {
    setIsAddCoupon(true);
    setClickEdit(false);
    setCouponDetails({
      couponCode: "",
      couponDiscount: "",
      couponStartDate: "",
      couponEndDate: "",
    });
  };

  const handleCancelCoupon = () => {
    setIsAddCoupon(false);
    setClickEdit(false);
  };

  const [couponDetails, setCouponDetails] = useState({
    couponCode: "",
    couponDiscount: "",
    couponStartDate: "",
    couponEndDate: "",
  });

  const handleCouponDetails = (e) => {
    if (e.target.name === "couponCode") {
      setCouponDetails({
        ...couponDetails,
        couponCode: e.target.value,
      });
    }
    if (e.target.name === "couponDiscount") {
      setCouponDetails({
        ...couponDetails,
        couponDiscount: e.target.value,
      });
    }
    if (e.target.name === "couponStartDate") {
      setCouponDetails({
        ...couponDetails,
        couponStartDate: e.target.value,
      });
    }
    if (e.target.name === "couponEndDate") {
      setCouponDetails({
        ...couponDetails,
        couponEndDate: e.target.value,
      });
    }
  };

  // const handleCouponDetails = (e) => {
  //   setCouponDetails({
  //     ...couponDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleAddOrUpdateCoupon = async () => {
    if (clickEdit) {
      await handleUpdateCoupon();
    } else {
      try {
        const addCoupon = await axiosInstance.post(
          "/api/v1/fur/coupons/addCoupon",
          {
            couponDetails,
          }
        );
        if (addCoupon) {
          toast.success("Coupon added");
          try {
            const res = await axiosInstance.get(
              "/api/v1/fur/coupons/getAllCoupons"
            );
            if (res) {
              setCoupons(res.data.coupons);
              const initialActiveState = res.data.coupons.reduce(
                (acc, coupon) => {
                  acc[coupon._id] = coupon.status;
                  return acc;
                },
                {}
              );
              setIsActive(initialActiveState);
            }
          } catch (error) {
            toast.error(error);
          }
          // setCoupons([...coupons, addCoupon.data.Coupon]);
          setIsAddCoupon(false);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add coupon");
      }
    }
  };

  const handleUpdateCoupon = async () => {
    try {
      const updateCoupon = await axiosInstance.put(
        "/api/v1/fur/coupons/updateCoupon",
        { couponDetails, couponEdit }
      );
      if (updateCoupon) {
        toast.success("Coupon updated");
        // const updatedCoupons = coupons.map((coupon) =>
        //   coupon._id === couponEdit._id ? updateCoupon.data.coupon : coupon
        // );
        // setCoupons(updatedCoupons);
        try {
          const res = await axiosInstance.get(
            "/api/v1/fur/coupons/getAllCoupons"
          );
          if (res) {
            setCoupons(res.data.coupons);
            const initialActiveState = res.data.coupons.reduce(
              (acc, coupon) => {
                acc[coupon._id] = coupon.status;
                return acc;
              },
              {}
            );
            setIsActive(initialActiveState);
          }
        } catch (error) {
          toast.error(error.response?.data?.message);
        }
        setClickEdit(false);
        setIsAddCoupon(false);
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to update coupon");
      toast.error(error.response?.data?.message);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this coupon?",
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
      const deleteCoupon = await axiosInstance.delete(
        "/api/v1/fur/coupons/deleteCoupon",
        {
          data: { couponId: couponId },
        }
      );
      if (deleteCoupon) {
        setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
        toast.success("Coupon deleted");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleClickEditCoupon = (couponId) => {
    const coupon = couponEditFn(couponId);
    if (coupon) {
      setCouponEdit(coupon);
      setCouponDetails({
        couponCode: coupon.code,
        couponDiscount: coupon.discount,
        couponStartDate: coupon.startDate,
        couponEndDate: coupon.endDate,
      });
      setClickEdit(true);
    }
  };
  const couponEditFn = (couponId) => {
    return coupons.find((coupon) => coupon._id === couponId);
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="relative duration-500">
      {(isAddCoupon || clickEdit) && (
        <div className="absolute mt-[80px] duration-500 top-1/2 -translate-y-1/2 py-3 px-6 w-full z-20 opacity-100">
          <ul className="top-0 left-0 rounded-lg w-1/2 m-auto opacity-100 py-3 px-6 bg-white font-bold grid grid-cols-8 gap-4">
            <span className="text-3xl my-3 text-center font-bold text-black col-span-8">
              {isAddCoupon ? "Add Coupon" : clickEdit && "Update Coupon"}
            </span>
            <li className="col-span-8 text-xl flex items-center gap-6">
              Coupon Code
              <input
                name="couponCode"
                placeholder="Enter Code"
                value={couponDetails.couponCode}
                onChange={(e) => handleCouponDetails(e)}
                type="text"
                className="outline-none text-lg text-black border border-orange-500 py-2 px-3 rounded-lg"
              />
            </li>
            <li className="col-span-8 text-xl flex items-center gap-6">
              Discount
              <input
                onInput={(e) => {
                  if (e.target.value > 100) {
                    e.target.value = 100;
                  }
                }}
                name="couponDiscount"
                min="1"
                max="100"
                value={couponDetails.couponDiscount}
                placeholder="Enter Discount"
                onChange={(e) => handleCouponDetails(e)}
                type="number"
                className="outline-none md:w-[200px] text-lg text-black border border-orange-500 py-2 px-3 rounded-lg"
              />
              %
            </li>
            <li className="col-span-8 text-xl flex items-center gap-6">
              Start Date
              <input
                name="couponStartDate"
                min={today}
                value={couponDetails.couponStartDate}
                onChange={(e) => handleCouponDetails(e)}
                type="date"
                className="outline-none text-lg text-black border border-orange-500 py-2 px-3 rounded-lg"
              />
            </li>
            <li className="col-span-8 text-xl flex items-center gap-6">
              End Date
              <input
                name="couponEndDate"
                value={couponDetails.couponEndDate}
                min={couponDetails.couponStartDate}
                onChange={(e) => handleCouponDetails(e)}
                type="date"
                className="outline-none text-lg text-black border border-orange-500 py-2 px-3 rounded-lg"
              />
            </li>
            <button
              onClick={() => handleAddOrUpdateCoupon()}
              className="mt-4 p-3 text-xl col-span-8 rounded-full bg-orange-500 hover:bg-transparent border hover:border-orange-500 text-white hover:text-orange-500 duration-500"
            >
              {isAddCoupon ? "Add Coupon" : clickEdit && "Update Coupon"}
            </button>
            <button
              onClick={() => handleCancelCoupon()}
              className="my-4 p-3 text-xl col-span-8 rounded-full hover:bg-orange-500 bg-transparent border border-orange-500 hover:text-white text-orange-500 duration-500"
            >
              Cancel
            </button>
          </ul>
        </div>
      )}
      <div className={`px-16 duration-500 ${isAddCoupon && "opacity-10"}`}>
        <h3 className="text-4xl text-[#374151] font-bold text-center my-6">
          Coupons
        </h3>
        <div className="my-3">
          <div className="flex justify-between items-center py-3 px-6 bg-[#F8FCFF]">
            <span className="text-2xl font-bold">Stored Coupons</span>
            <button
              onClick={() => handleClickAddCoupon()}
              className="text-white hover:text-orange-500 bg-orange-500 hover:bg-transparent border border-orange-500 duration-500 rounded-full py-2 px-4"
            >
              Add a coupon
            </button>
          </div>
          <div>
            <ul className="text-[#acc8df] bg-white font-bold py-3 px-6 grid grid-cols-12">
              <li className="col-span-2">Coupon Code</li>
              <li className="col-span-2">Discount</li>
              <li className="col-span-2">Start Date</li>
              <li className="col-span-2">End Date</li>
              <li className="col-span-2">Status</li>
              <li className="col-span-2">Actions</li>
            </ul>
            {coupons?.map((coupon) => (
              <ul
                key={coupon._id}
                className="text-[#B2B2B2] font-bold py-3 px-6 bg-[#FCFCFC] grid grid-cols-12"
              >
                <li className="col-span-2">{coupon.code}</li>
                <li className="col-span-2">{coupon.discount}%</li>
                <li className="col-span-2">{coupon.startDate}</li>
                <li className="col-span-2">{coupon.endDate}</li>
                <li className="col-span-2">
                  <div
                    className={`relative w-14 h-7 ${
                      isActive[coupon._id] ? "bg-blue-500" : "bg-gray-300"
                    } rounded-full flex ${
                      isActive[coupon._id] ? "justify-end" : "justify-start"
                    } duration-500`}
                  >
                    <span
                      onClick={() => handleStatus(coupon._id)}
                      className={`absolute cursor-pointer w-6 h-6 bg-white rounded-full ${
                        isActive[coupon._id] ? "end-[2px]" : "start-[2px]"
                      } duration-500 top-1/2 -translate-y-1/2`}
                    ></span>
                  </div>
                </li>
                <li className="col-span-2 flex items-center text-xl gap-5">
                  <MdDelete
                    onClick={() => handleDeleteCoupon(coupon._id)}
                    className="cursor-pointer hover:text-orange-500 duration-500"
                  />{" "}
                  <MdEdit
                    onClick={() => handleClickEditCoupon(coupon._id)}
                    className="cursor-pointer hover:text-orange-500 duration-500"
                  />
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
