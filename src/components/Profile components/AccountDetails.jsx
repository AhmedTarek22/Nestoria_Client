import { useState } from "react";
import { useUserInfoContext } from "../../context/UserProvider";
import { toast } from "react-toastify";
import axiosInstance from "../../apis/axiosConfig";
import { FaRegEyeSlash, FaUserEdit } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { IoMdStar } from "react-icons/io";

export function AccountDetails() {
  const { currentUser } = useUserInfoContext();
  const [isClickIconEdit, setIsClickIconEdit] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [userInfo, setUserInfo] = useState({
    fullName: currentUser.fullName,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({
    fullNameError: "",
    currentPasswordError: "",
    newPasswordError: "",
    confirmNewPasswordError: "",
  });

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\*\@\%\$\#]).{8,30}$/;
  const regexName = /^[a-zA-Z][a-zA-Z ]{2,30}$/;

  const handleInfoUser = (e) => {
    if (e.target.name === "fullName") {
      setUserInfo({
        ...userInfo,
        fullName: e.target.value,
      });
      setErrors({
        ...errors,
        fullNameError:
          e.target.value.length === 0
            ? "Enter full name"
            : !regexName.test(e.target.value) && "Full name is invalid",
      });
    }
    if (e.target.name === "currentPassword") {
      setUserInfo({
        ...userInfo,
        currentPassword: e.target.value,
      });
      setErrors({
        ...errors,
        currentPasswordError: e.target.value === 0 && "Enter current password",
      });
    }
    if (e.target.name === "newPassword") {
      setUserInfo({
        ...userInfo,
        newPassword: e.target.value,
      });
      setErrors({
        ...errors,
        newPasswordError:
          e.target.value.length === 0
            ? "Enter new password"
            : !passwordRegex.test(e.target.value) &&
              "use upper, lower, digit, and special char from @ # % $",
      });
    }
    if (e.target.name === "confirmNewPassword") {
      setUserInfo({
        ...userInfo,
        confirmNewPassword: e.target.value,
      });
      setErrors({
        ...errors,
        confirmNewPasswordError:
          e.target.value.length === 0
            ? "Enter confirm new password"
            : e.target.value !== userInfo.newPassword &&
              "New password confirmation must match the new password",
      });
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (
      (!userInfo.currentPassword || userInfo.currentPassword) &&
      userInfo.fullName === currentUser.fullName &&
      !userInfo.newPassword &&
      !userInfo.confirmNewPassword
    ) {
      return toast.error("No modification");
    } else if (
      userInfo.fullName !== currentUser.fullName &&
      !userInfo.currentPassword &&
      !userInfo.newPassword &&
      !userInfo.confirmNewPassword
    ) {
      setErrors({ ...errors, currentPasswordError: "Enter current password" });
      return toast.error("Enter current password to update full name");
    } else if (
      userInfo.fullName === currentUser.fullName &&
      userInfo.newPassword &&
      !userInfo.currentPassword
    ) {
      setErrors({ ...errors, currentPasswordError: "Enter current password" });
      return toast.error("Enter current password to update password");
    } else if (
      errors.fullNameError ||
      errors.currentPasswordError ||
      errors.newPasswordError ||
      errors.confirmNewPasswordError
    ) {
      toast.error("Enter valid data");
    } else {
      try {
        const res = await axiosInstance.put(
          "/api/v1/fur/account/updateAccount",
          {
            fullName: userInfo.fullName
              ? userInfo.fullName
              : currentUser.fullName,
            currentPassword: userInfo.currentPassword,
            newPassword: userInfo.newPassword,
            confirmNewPassword: userInfo.confirmNewPassword,
          }
        );
        if (
          userInfo.fullName !== currentUser.fullName &&
          userInfo.newPassword
        ) {
          toast.success("Account updated");
        } else if (
          userInfo.fullName !== currentUser.fullName &&
          !userInfo.newPassword
        ) {
          toast.success("Full name updated");
        } else if (
          userInfo.fullName === currentUser.fullName &&
          userInfo.newPassword
        ) {
          toast.success("Password updated");
        }
        setUserInfo({
          ...userInfo,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setShowPassword({
          currentPassword: false,
          newPassword: false,
          confirmNewPassword: false,
        });
        setIsClickIconEdit(false);
      } catch (err) {
        toast.error("Password incorrect");
      }
    }
  };

  const handleEditIcon = () => {
    setIsClickIconEdit(!isClickIconEdit);
    setUserInfo({
      ...userInfo,
      fullName: currentUser.fullName,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setErrors("");
  };

  return (
    <form
      onSubmit={(e) => handleUpdateUser(e)}
      className={`relative flex flex-col gap-6 border border-[#929292] ${
        isClickIconEdit && "border-[#C26510]"
      } rounded-2xl py-3 px-5 `}
    >
      <div onClick={() => handleEditIcon()}>
        <FaUserEdit
          className={`absolute ${
            isClickIconEdit ? "text-[#C26510]" : "text-[#929292]"
          } text-3xl -inset-y-5 -right-3 cursor-pointer hover:text-[#C26510]`}
        />
      </div>
      <div className="flex flex-col gap-4 text-[#929292]">
        <label className="flex items-center">
          Full name
          {isClickIconEdit && <IoMdStar className="text-red-700 ms-2" />}
        </label>
        <input
          className="bg-transparent py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
          type="text"
          name="fullName"
          onChange={(e) => handleInfoUser(e)}
          value={userInfo.fullName}
          readOnly={!isClickIconEdit ? true : undefined}
        />
        <span className="text-red-500 text-sm font-semibold">
          {errors.fullNameError}
        </span>
      </div>
      <div className="flex flex-col gap-4 text-[#929292]">
        <label>Email address</label>
        <input
          className="bg-transparent py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
          type="email"
          name=""
          readOnly
          placeholder={currentUser.email}
        />
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl text-white">Password change</h3>
        <div className=" relative flex flex-col gap-4 text-[#929292]">
          <div className="flex items-center">
            <label>Current password (leave blank to leave unchanged)</label>
            {isClickIconEdit && <IoMdStar className="text-red-700 ms-2" />}
          </div>
          <input
            className="bg-transparent py-4 px-8 rounded-full border border-[#929292] focus:border-[#C26510] focus:outline-none duration-500"
            type={showPassword.currentPassword ? "text" : "password"}
            name="currentPassword"
            onChange={(e) => handleInfoUser(e)}
            value={userInfo.currentPassword}
            readOnly={!isClickIconEdit ? true : undefined}
          />
          <button
            type="button"
            className="absolute top-[60px] right-4 flex items-center text-gray-500 hover:text-white"
            onClick={() =>
              setShowPassword({
                ...showPassword,
                currentPassword: !showPassword.currentPassword,
              })
            }
          >
            {!showPassword.currentPassword ? <FaRegEyeSlash /> : <IoEye />}
          </button>
          <span className="text-red-500 text-sm font-semibold">
            {errors.currentPasswordError}
          </span>
        </div>
        <div className="relative flex flex-col gap-4 text-[#929292]">
          <label>New password (leave blank to leave unchanged)</label>
          <input
            className={`bg-transparent py-4 px-8 rounded-full border border-[#929292] ${
              !errors.newPasswordError && "focus:border-[#C26510]"
            } ${
              errors.newPasswordError && "border-red-500"
            } focus:outline-none duration-500`}
            type={showPassword.newPassword ? "text" : "password"}
            name="newPassword"
            onChange={(e) => handleInfoUser(e)}
            value={userInfo.newPassword}
            readOnly={!isClickIconEdit ? true : undefined}
          />
          <button
            type="button"
            className="absolute top-[60px] right-4 flex items-center text-gray-500 hover:text-white"
            onClick={() =>
              setShowPassword({
                ...showPassword,
                newPassword: !showPassword.newPassword,
              })
            }
          >
            {!showPassword.newPassword ? <FaRegEyeSlash /> : <IoEye />}
          </button>
          <span className="text-red-500 text-sm font-semibold">
            {errors.newPasswordError}
          </span>
        </div>
        <div className="relative flex flex-col gap-4 text-[#929292]">
          <label>Confirm new password</label>
          <input
            className={`bg-transparent py-4 px-8 rounded-full border border-[#929292] ${
              !errors.confirmNewPasswordError && "focus:border-[#C26510]"
            } ${
              errors.confirmNewPasswordError && "border-red-500"
            } focus:outline-none duration-500`}
            type={showPassword.confirmNewPassword ? "text" : "password"}
            name="confirmNewPassword"
            onChange={(e) => handleInfoUser(e)}
            value={userInfo.confirmNewPassword}
            readOnly={!isClickIconEdit ? true : undefined}
          />
          <button
            type="button"
            className="absolute top-[60px] right-4 flex items-center text-gray-500 hover:text-white"
            onClick={() =>
              setShowPassword({
                ...showPassword,
                confirmNewPassword: !showPassword.confirmNewPassword,
              })
            }
          >
            {!showPassword.confirmNewPassword ? <FaRegEyeSlash /> : <IoEye />}
          </button>
          <span className="text-red-500 text-sm font-semibold">
            {errors.confirmNewPasswordError}
          </span>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="bg-transparent text-[#C26510] text-[17px] py-3 px-8 border border-[#C26510] rounded-3xl hover:bg-[#C26510] hover:text-white duration-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
