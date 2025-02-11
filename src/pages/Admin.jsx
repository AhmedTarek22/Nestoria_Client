import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkshopRequests from "../components/WorkshopRequests";
import PaymentApproval from "../components/PaymentApproval";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PeopleIcon from "@mui/icons-material/People";
import PaidIcon from "@mui/icons-material/Paid";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AllClients from "../components/AllClients";
import AllWorkshops from "../components/AllWorkshops";
import CustomerComplaints from "../components/CustomerComplaints";
import axiosInstance from "../apis/axiosConfig";
import { toast } from "react-toastify";
import { RiCoupon2Fill } from "react-icons/ri";
import { Coupon } from "./Coupon";
function Admin() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("workshop Requests");
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyRole() {
      try {
        const req = await axiosInstance.get("/api/v1/fur/auth/verifyrole");
        // console.log(req.data);
        // console.log("status", req.data.response.status);
      } catch (error) {
        const errMsg = error.response.data.message;
        console.log("error", errMsg);
        if (
          errMsg.includes(
            "error You are not logged in! Please log in to get access"
          )
        ) {
          navigate("/unauthorized");
          toast.error("You don't have any authorization to access this page!");
        } else {
          navigate("/unauthorized");
          toast.error("You don't have any authorization to access this page!");
        }
      }
    }
    verifyRole();
  }, [navigate]);

  const renderComponents = () => {
    switch (activeSection) {
      case "Workshop Requests": {
        return <WorkshopRequests />;
      }
      case "Payments": {
        return <PaymentApproval />;
      }
      case "All Clients": {
        return <AllClients />;
      }
      case "All Workshops": {
        return <AllWorkshops />;
      }
      case "Coupons": {
        return <Coupon />;
      }
      case "customer complaints": {
        return <CustomerComplaints />;
      }
      default: {
        return <WorkshopRequests />;
      }
    }
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Box
        sx={{
          textAlign: "center",
          fontSize: "18px",
          padding: "20px 0",
          background: "#f3f4f9",
          boxShadow: "1px 4px 15px -8px #000000",
        }}
      >
        Main Sections
      </Box>
      <List>
        {[
          {
            text: "Workshop Requests",
            icon: <PsychologyAltIcon className="!text-[#464545d0]" />,
          },
          {
            text: "Payments",
            icon: <PaidIcon className="!text-[#464545d0]" />,
          },
          {
            text: "All Clients",
            icon: <PeopleIcon className="!text-[#464545d0]" />,
          },
          {
            text: "All Workshops",
            icon: <EngineeringIcon className="!text-[#464545d0]" />,
          },
          {
            text: "Coupons",
            icon: <RiCoupon2Fill className="!text-[#464545d0]" />,
          },
        ].map((text, index) => (
          <ListItem key={text.text} disablePadding>
            <ListItemButton
              onClick={() => {
                setActiveSection(text.text);
              }}
            >
              <ListItemIcon sx={{ marginRight: "10px", minWidth: "20px" }}>
                {text.icon}
              </ListItemIcon>
              <ListItemText primary={text.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[
          {
            text: "Customer complaints",
            icon: <AttachEmailIcon className="!text-[#464545d0]" />,
          },
        ].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => setActiveSection("customer complaints")}
            >
              <ListItemIcon sx={{ marginRight: "10px", minWidth: "20px" }}>
                {text.icon}
              </ListItemIcon>
              <ListItemText primary={text.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center z-100">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <ul className="flex space-x-6">
            <li
              onClick={() => setActiveSection("workshop Requests")}
              className={`${
                activeSection === "workshop Requests" ? "bg-green-400 " : ""
              } text-gray-600 hover:text-gray-800 cursor-pointer p-3 rounded-lg transition-all duration-200`}
            >
              Requests
            </li>
            <li
              onClick={() => setActiveSection("Payments")}
              className={`${
                activeSection === "Payments" ? "bg-green-400 " : ""
              } text-gray-600 hover:text-gray-800 cursor-pointer p-3 rounded-lg transition-all duration-200`}
            >
              Payments
            </li>
          </ul>
        </div>
      </nav>
      {/* drawer */}
      <div>
        <Button
          onClick={toggleDrawer(true)}
          sx={{
            background: "#3b82f6",
            ":hover": { opacity: "0.8", transition: "all 0.3s" },
          }}
        >
          <MenuOpenIcon />
        </Button>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>
      <div className="container mx-auto py-8">{renderComponents()}</div>
    </div>
  );
}

export default Admin;
