import EmailIcon from "@mui/icons-material/Email";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Pagination, Stack } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { RiRadioButtonLine } from "react-icons/ri";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AdminLoader from "./adminLoader";
import { Box } from "@mui/system";
import Modal from "react-responsive-modal";
import axiosInstance from "../apis/axiosConfig";
function CustomerComplaints() {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState("");
  const [open2, setOpen2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  useEffect(() => {
    const fetchClientAccounts = async () => {
      const req = await axiosInstance(
        `/api/v1/fur/problems/getComplaints?category=${status}&page=${page}`
      );
      console.log(req.data);
      setClients(req.data.complaints);
      setTotal(req.data.complaintsNumbers);
      setTotalPages(req.data.totalPages);
    };
    fetchClientAccounts();
  }, [page, status]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleChange2 = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleOpen = (client) => {
    setSelectedClient(client);
    console.log("client", client);
    setOpen(true);
  };

  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleReply = (email) => {
    window.location.href = `mailto:${email}?subject=Response%20to%20Your%20Complaint&body=Dear%20Customer,%0A%0AThank%20you%20for%20reaching%20out%20to%20us.%20We%20truly%20appreciate%20your%20patience%20and%20understanding%20as%20we%20work%20to%20resolve%20your%20issue.%0A%0APlease%20know%20that%20we%20are%20committed%20to%20providing%20you%20with%20the%20best%20service%20possible.%0A%0AKindly%20provide%20us%20with%20more%20details%20about%20your%20concern%20so%20that%20we%20can%20assist%20you%20more%20effectively.%0A%0ABest%20regards,%0ANestoria
`;
  };
  const makeItDone = async (client) => {
    if (client.problemState === "pending") {
      try {
        setIsLoading(true);
        const req = await axiosInstance.post(
          `/api/v1/fur/problems/change-problem-state?_id=${client._id}`
        );

        const filterProblems = clients.map((p) =>
          p._id === client._id ? { ...p, problemState: "solved" } : p
        );
        setClients(filterProblems);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <AdminLoader />;
  }
  return (
    <section id="client-files" className="mb-8">
      <h2 className="text-3xl font-semibold text-gray-700 mb-4 w-full text-center ">
        Client Complaints
      </h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-xl text-center border-b mb-7 pb-2">
          Number of Complaints: {total}
        </p>

        <div className="flex items-center mt-4">
          {/* select */}
          <div className=" !mb-5">
            <FormControl sx={{ m: 1, minWidth: 140 }}>
              <InputLabel id="demo-controlled-open-select-label">
                Status
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={open2}
                onClose={handleClose2}
                onOpen={handleOpen2}
                value={status}
                label="Status"
                onChange={handleChange2}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"pending"}>Pending</MenuItem>
                <MenuItem value={"solved"}>Solved</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {clients.map((client) => (
          <div
            key={client._id}
            className="flex justify-between items-center mb-4"
          >
            <div>
              <p className="text-gray-800">
                Name: {client.userName}{" "}
                <RiRadioButtonLine
                  className={`inline-block text-sm text-${
                    client.problemState === "solved" ? "green-400" : "black"
                  }`}
                />
              </p>
              <p className="text-gray-600">Email: {client.userEmail}</p>
              <Button
                onClick={() => handleOpen(client)}
                className="text-gray-600"
              >
                Massage
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button
                startIcon={<CheckCircleOutlineIcon />}
                onClick={() => makeItDone(client)}
                className={`rounded-lg ${
                  client.problemState === "pending" ? "hover:bg-blue-600 " : ""
                }`}
                sx={{
                  background:
                    client.problemState === "solved" ? "#2dc301" : "#3b82f6",
                  color: "white",
                  padding: "10px 14px",
                  cursor:
                    client.problemState === "solved"
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                done
              </Button>
              {client.problemState === "pending" && (
                <Button
                  startIcon={<EmailIcon />}
                  onClick={() => handleReply(client.userEmail)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  sx={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "10px 14px",
                  }}
                >
                  Reply via Email
                </Button>
              )}
            </div>
          </div>
        ))}
        <Stack spacing={2}>
          <Pagination
            color="primary"
            count={totalPages}
            page={page}
            onChange={handleChange}
            sx={{ margin: "0 auto", display: "flex", justifyContent: "center" }}
          />
        </Stack>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        styles={{
          modal: { width: "80%", maxWidth: "600px", minHeight: "600px" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedClient ? (
            <>
              <Typography id="modal-modal-title" variant="h5" component="h2">
                Name: {selectedClient.userName}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <span className="font-semibold"> Email:</span>{" "}
                {selectedClient.userEmail}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <span className="font-semibold"> Phone:</span>{" "}
                {selectedClient.userMobile}
              </Typography>

              <Box
                component="div"
                id="modal-modal-description"
                sx={{
                  mt: 2,
                  minHeight: "50%",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <span className="font-semibold"> Massage:</span>
                {selectedClient.userProblem}
              </Box>
            </>
          ) : (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              No client selected.
            </Typography>
          )}
        </Box>
      </Modal>
    </section>
  );
}
export default CustomerComplaints;
