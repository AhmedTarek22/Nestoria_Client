import { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import ModalImage from "react-modal-image";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axiosInstance from "../apis/axiosConfig";

function WorkshopRequests() {
  const translate = useSelector((state) => state.language.translation);
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchRquests() {
      const req = await axiosInstance.get(
        "/api/v1/admin/workshoprequests"
      );
      console.log(req.data);
      setRequests(req.data.workshopReq);
      setTotal(req.data.numberOfReq);
    }
    fetchRquests();
  }, []);

  async function handleReject(name, email) {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to reject this account?\n${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reject it!",
    });
    if (!confirmed.isConfirmed) {
      return;
    }
    try {
      await axiosInstance.put(
        `/api/v1/admin/acceptanceState/${encodeURIComponent(
          email
        )}`,
        { state: "reject" }
      );

      const filteredClients = requests.filter(
        (client) => client.email !== email
      );
      setRequests(filteredClients);
      setTotal((prev) => prev - 1);
      Swal.fire("Rejected!", "The account has been rejected.", "success");
    } catch (error) {
      await Swal.fire(
        "Error!",
        "There was an issue removing the client account.",
        "error"
      );
    }
  }

  async function handleAcceptance(name, email) {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to accept this account?\n${name}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    });
    if (!confirmed.isConfirmed) {
      return;
    }
    try {
      await axiosInstance.put(
        `/api/v1/admin/acceptanceState/${encodeURIComponent(
          email
        )}`,
        { state: "accept" }
      );

      const filteredClients = requests.filter(
        (client) => client.email !== email
      );
      setRequests(filteredClients);
      setTotal((prev) => prev - 1);
      Swal.fire("Accepted!", "The account has been accepted.", "success");
    } catch (error) {
      await Swal.fire(
        "Error!",
        "There was an issue removing the client account.",
        "error"
      );
    }
  }

  // لعرض الـ modal مع تفاصيل الورشة
  function showDetails(workshop) {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  }

  // لغلق الـ modal
  function closeModal() {
    setIsModalOpen(false);
    setSelectedWorkshop(null);
  }

  return (
    <>
      <section id="requests" className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 w-full text-center">
          {translate.Workshop_Requests} <span>{total}</span>
        </h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <p className="text-gray-800">
                  <span className="font-bold">{translate.Workshop_Name}: </span>
                  {request.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">{translate.Email}:</span> {request.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">{translate.Join_At}:</span>{" "}
                  {request.updatedAt.split("T")[0]}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => showDetails(request)}
                >
                  {translate.Show_Details}
                </button>
                <button
                  onClick={() => handleAcceptance(request.name, request.email)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  {translate.Approve}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleReject(request.name, request.email)}
                >
                  {translate.Reject}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={closeModal} center>
          <h3 className="text-xl font-bold mb-4 text-center">
            {translate.Workshop_Profile_Details}
          </h3>
          {selectedWorkshop && (
            <div>
              <p className="flex justify-center">
                <ModalImage
                  className="w-[120px] rounded-full"
                  small={selectedWorkshop.registrationDocuments.personalPhoto}
                  large={selectedWorkshop.registrationDocuments.personalPhoto}
                  alt="Profile"
                />
              </p>
              <div className="flex justify-around gap-2 mt-5">
                <p className="text-xl">
                  <strong>{translate.Workshop_Name}:</strong> {selectedWorkshop.name}
                </p>
                <p className="text-xl">
                  <strong>{translate.Address}:</strong> {selectedWorkshop.address}
                </p>
              </div>

              <div className="flex justify-between gap-6 mt-5">
                <div className="w-1/2 flex-1">
                  <strong>{translate.Front_ID}:</strong>
                  <ModalImage
                    small={
                      selectedWorkshop.registrationDocuments.nationalIDFront
                    }
                    large={
                      selectedWorkshop.registrationDocuments.nationalIDFront
                    }
                    alt="Front ID"
                  />
                </div>
                <div className="w-1/2 flex-1">
                  <strong>{translate.Back_ID}:</strong>
                  <ModalImage
                    small={
                      selectedWorkshop.registrationDocuments.nationalIDBack
                    }
                    large={
                      selectedWorkshop.registrationDocuments.nationalIDBack
                    }
                    alt="Back ID"
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <p className="mt-6 w-1/2 ">
                  <strong>{translate.Bank_Statement}:</strong>{" "}
                  <ModalImage
                    small={selectedWorkshop.registrationDocuments.bankStatement}
                    large={selectedWorkshop.registrationDocuments.bankStatement}
                    alt="Bank Statement"
                  />
                </p>
                <p className="mt-6 w-1/2 ">
                  <strong>{translate.Tax_Registration}:</strong>{" "}
                  <ModalImage
                    small={
                      selectedWorkshop.registrationDocuments.commercialRecord
                    }
                    large={
                      selectedWorkshop.registrationDocuments.commercialRecord
                    }
                    alt="Bank Statement"
                  />
                </p>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default WorkshopRequests;
