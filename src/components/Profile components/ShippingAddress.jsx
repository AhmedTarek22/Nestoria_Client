import { useEffect, useState } from "react";
import axiosInstance from "../../apis/axiosConfig";
import { useUserInfoContext } from "../../context/UserProvider";
import { toast } from "react-toastify";
import { IoMdStar } from "react-icons/io";

export function ShippingAddress(props) {
  const { currentUser } = useUserInfoContext();
  const [isOkAddress, setIsOkAddress] = useState(props.check);
  const countries = ["Egypt", "Palestine", "Yemen", "Sudan", "Syria"];
  const [selectedCountry, setSelectedCountry] = useState(currentUser?.address);
  const [userShipping, setUserShipping] = useState({
    company: "",
    houseNumber: "",
    apartment: "",
    city: "",
    state: "",
    PINCode: "",
  });
  const [currentUserShipping, setCurrentUserShipping] = useState({
    company: "",
    houseNumber: "",
    apartment: "",
    city: "",
    state: "",
    PINCode: "",
  });
  const [errors, setErrors] = useState({
    companyError: "",
    houseNumberError: "",
    apartmentError: "",
    cityError: "",
    stateError: "",
    PINCodeError: "",
  });

  const [isFoundedAddress, setIsFoundedAddress] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);

  const regexPINCode = /^\d{5}$/;

  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/v1/fur/shippingAddress/getShippingAddress"
        );
        if (res.data) {
          setIsFoundedAddress(true);
          setUserShipping({
            company: res.data.company,
            houseNumber: res.data.streetAddress.houseNumber,
            apartment: res.data.streetAddress.apartment,
            city: res.data.city,
            state: res.data.state,
            PINCode: res.data.PINCode,
          });
          setCurrentUserShipping({
            company: res.data.company,
            houseNumber: res.data.streetAddress.houseNumber,
            apartment: res.data.streetAddress.apartment,
            city: res.data.city,
            state: res.data.state,
            PINCode: res.data.PINCode,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchShippingAddress();
  }, []);

  const handleChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleChangeAddress = (e) => {
    if (e.target.name === "company") {
      setUserShipping({
        ...userShipping,
        company: e.target.value,
      });
    }

    if (e.target.name === "houseNumber") {
      setUserShipping({
        ...userShipping,
        houseNumber: e.target.value,
      });
    }

    if (e.target.name === "apartment") {
      setUserShipping({
        ...userShipping,
        apartment: e.target.value,
      });
    }
    if (e.target.name === "city") {
      setUserShipping({
        ...userShipping,
        city: e.target.value,
      });
    }
    if (e.target.name === "state") {
      setUserShipping({
        ...userShipping,
        state: e.target.value,
      });
    }
    if (e.target.name === "PINCode") {
      setUserShipping({
        ...userShipping,
        PINCode: e.target.value,
      });
      setErrors({
        ...errors,
        PINCodeError:
          e.target.value.length === 0
            ? "Enter PIN Code"
            : !regexPINCode.test(e.target.value) &&
              "Enter valid PIN code 5 numbers",
      });
    }
  };

  const handleShippingAddress = async (e) => {
    e.preventDefault();
    if (
      !userShipping.houseNumber ||
      !userShipping.apartment ||
      !userShipping.city ||
      !userShipping.PINCode
    ) {
      return toast.error("Enter data");
    } else if (errors.PINCodeError) {
      return toast.error("Fixed errors");
    } else {
      try {
        const res = await axiosInstance.post(
          "/api/v1/fur/shippingAddress/addShippingAddress",
          {
            company: userShipping.company,
            streetAddress: {
              houseNumber: userShipping.houseNumber,
              apartment: userShipping.apartment,
            },
            city: userShipping.city,
            state: userShipping.state,
            PINCode: userShipping.PINCode,
          }
        );
        if (res) {
          toast.success("address added");
          setIsFoundedAddress(true);
          if (!isOkAddress && isOkAddress !== undefined) {
            confirmAddress();
          }
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleEditAddress = (e) => {
    e.preventDefault();
    setIsEditAddress(true);
  };

  const handleUpdateShippingAddress = async (e) => {
    e.preventDefault();
    if (
      userShipping.company === currentUserShipping.company &&
      userShipping.city === currentUserShipping.city &&
      userShipping.apartment === currentUserShipping.apartment &&
      userShipping.houseNumber === currentUserShipping.houseNumber &&
      userShipping.PINCode === currentUserShipping.PINCode &&
      userShipping.state === currentUserShipping.state
    ) {
      return toast.error("No modification");
    } else if (errors.PINCodeError) {
      return toast.error("Fixed errors");
    } else {
      if (isOkAddress) {
        return confirmAddress();
      } else {
        try {
          const res = await axiosInstance.put(
            "/api/v1/fur/shippingAddress/updateShippingAddress",
            {
              company: userShipping.company,
              streetAddress: {
                houseNumber: userShipping.houseNumber,
                apartment: userShipping.apartment,
              },
              city: userShipping.city,
              state: userShipping.state,
              PINCode: userShipping.PINCode,
            }
          );
          if (res) {
            toast.success("address updated");
            setIsEditAddress(false);
            if (props.sendAddressToCheckout) {
              props.sendAddressToCheckout(userShipping);
            }
          }
        } catch (error) {
          toast.error(error);
        }
      }
    }
  };

  const handleCancelAddress = (e) => {
    e.preventDefault();
    setUserShipping(currentUserShipping);
    setErrors("");
    setIsEditAddress(false);
  };

  const confirmAddress = (e) => {
    if (e) {
      e.preventDefault();
    }
    setIsOkAddress(true);
    setIsEditAddress(false);
    toast.success("Shipping address confirmed");
    if (props.sendAddressToCheckout) {
      props.sendAddressToCheckout(userShipping);
    }
  };

  const isUserShippingEmpty = () => {
    return Object.values(currentUserShipping).every((value) => value === "");
  };

  return (
    <form className="flex flex-col gap-6">
      <h3 className="text-white text-2xl">Shipping Address</h3>
      <div className="flex flex-col gap-4">
        <label className="text-[#929292]">Full name</label>
        <input
          className="bg-transparent py-4 px-8 text-[#929292] rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
          type="text"
          name=""
          value={currentUser?.fullName}
          readOnly
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-4 text-[#929292]">
          <label>Company name (optional)</label>
          <input
            className="bg-transparent py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
            type="text"
            name="company"
            onChange={(e) => handleChangeAddress(e)}
            value={userShipping.company}
            readOnly={!isEditAddress && !isUserShippingEmpty()}
          />
        </div>
        <div className="flex flex-col gap-4 text-[#929292]">
          <label>Country/Region</label>
          <div className="relative flex items-center">
            <select
              value={selectedCountry}
              onChange={handleChange}
              className="block appearance-none bg-transparent cursor-pointer w-full py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
            >
              {countries.map((country) => (
                <option
                  key={country}
                  value={country}
                  className="bg-[#101010] px-3 font-bold text-[#929292] cursor-pointer hover:text-white hover:bg-slate-100"
                >
                  {country}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-5 text-white">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M0 0l10 10 10-10H0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-[#929292]">
        <label>Street address</label>
        <label className="flex items-center">
          House number and street name{" "}
          {(isEditAddress || !isFoundedAddress) && (
            <IoMdStar className="text-red-700 ms-2" />
          )}
        </label>
        <input
          className="bg-transparent py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
          type="text"
          name="houseNumber"
          placeholder="House number and street name"
          onChange={(e) => handleChangeAddress(e)}
          value={userShipping.houseNumber}
          readOnly={!isEditAddress && !isUserShippingEmpty()}
        />
        <label className="flex items-center">
          Apartment, suite, unit, etc{" "}
          {(isEditAddress || !isFoundedAddress) && (
            <IoMdStar className="text-red-700 ms-2" />
          )}
        </label>
        <input
          className="bg-transparent py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
          type="text"
          name="apartment"
          placeholder="Apartment, suite, unit, etc"
          onChange={(e) => handleChangeAddress(e)}
          value={userShipping.apartment}
          readOnly={!isEditAddress && !isUserShippingEmpty()}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="flex flex-col gap-4 text-[#929292]">
          <label className="flex items-center">
            Town/city
            {(isEditAddress || !isFoundedAddress) && (
              <IoMdStar className="text-red-700 ms-2" />
            )}
          </label>
          <input
            className="bg-transparent py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
            type="text"
            name="city"
            onChange={(e) => handleChangeAddress(e)}
            value={userShipping.city}
            readOnly={!isEditAddress && !isUserShippingEmpty()}
          />
        </div>
        <div className="flex flex-col gap-4 text-[#929292]">
          <label className="flex items-center">State</label>
          <input
            className="bg-transparent py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
            type="text"
            name="state"
            onChange={(e) => handleChangeAddress(e)}
            value={userShipping.state}
            readOnly={!isEditAddress && !isUserShippingEmpty()}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 text-[#929292]">
        <label className="flex items-center">
          PIN Code{" "}
          {(isEditAddress || !isFoundedAddress) && (
            <IoMdStar className="text-red-700 ms-2" />
          )}
        </label>
        <input
          className={`bg-transparent py-4 px-8 rounded-full border border-[#929292] ${
            !errors.PINCodeError && "focus:border-[#C26510]"
          } ${
            errors.PINCodeError && "border-red-500"
          } focus:outline-none duration-500`}
          type="text"
          name="PINCode"
          onChange={(e) => handleChangeAddress(e)}
          value={userShipping.PINCode}
          readOnly={!isEditAddress && !isUserShippingEmpty()}
        />
        <span className="text-red-500 text-sm font-semibold">
          {errors.PINCodeError}
        </span>
      </div>
      <div>
        {!isFoundedAddress && (
          <button
            onClick={(e) => handleShippingAddress(e)}
            className="bg-transparent text-[#C26510] text-[17px] py-3 px-8 border border-[#C26510] rounded-3xl hover:bg-[#C26510] hover:text-white duration-500"
          >
            Save Address
          </button>
        )}
        {isFoundedAddress && !isEditAddress && (
          <div className="flex justify-between">
            {isOkAddress && (
              <button
                onClick={(e) => confirmAddress(e)}
                className="bg-transparent text-[#C26510] text-[17px] py-3 px-8 border border-[#C26510] rounded-3xl hover:bg-[#C26510] hover:text-white duration-500"
              >
                Confirm Address
              </button>
            )}
            <button
              onClick={(e) => handleEditAddress(e)}
              className="bg-[#C26510] text-[17px] text-white py-3 px-8 border border-[#C26510] rounded-3xl hover:bg-transparent hover:text-[#C26510] duration-500"
            >
              Edit Address
            </button>
          </div>
        )}
        {isEditAddress && (
          <div className="flex justify-between">
            <button
              onClick={(e) => handleUpdateShippingAddress(e)}
              className="bg-transparent text-[#C26510] text-[17px] py-3 px-8 border border-[#C26510] rounded-3xl hover:bg-[#C26510] hover:text-white duration-500"
            >
              Update Address
            </button>
            <button
              onClick={(e) => handleCancelAddress(e)}
              className="bg-[#C26510] text-[17px] text-white py-3 px-8 border border-[#C26510] rounded-3xl hover:bg-transparent hover:text-[#C26510] duration-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
