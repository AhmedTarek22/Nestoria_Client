import React, { useState, useEffect } from "react";
import "../../css modules/heroSection.module.css";
import ProductCarousel from "./ProductSection";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader";
import axiosInstance from "../../apis/axiosConfig";
import { FaStar } from "react-icons/fa";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useUserInfoContext } from "../../context/UserProvider";

const HeroSection = () => {
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { workshopId } = useParams();
  console.log("workshopId ", workshopId);
  const { currentUser } = useUserInfoContext();
  const userId = currentUser?._id;

  // Moved useNavigate to the top, before any early return
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/fur/users/${workshopId}`
        );
        console.log("workshoppp ", response.data.user);
        const workShopDetails = response.data.user;
        setWorkshop(workShopDetails);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className=" text-center flex justify-center items-center h-screen bg-black font-serif">
        <Loader />
      </div>
    );
  }

  // Error state
  if (error) {
    return <div className="text-white text-center">Error: {error}</div>;
  }

  const createChat = async (
    buyerId,
    buyerName,
    sellerId,
    sellerPhoto,
    sellerName
  ) => {
    try {
      // البحث عن محادثة قائمة بين المشتري والبائع
      const chatQuery = query(
        collection(db, "chats"),
        where("buyerId", "==", buyerId),
        where("sellerId", "==", sellerId)
      );

      const existingChats = await getDocs(chatQuery);

      // إذا كانت المحادثة موجودة، لا نقوم بإنشاء محادثة جديدة
      if (!existingChats.empty) {
        console.log("Chat already exists");
        return existingChats.docs[0].id; // إرجاع معرف المحادثة الحالية
      }

      // إنشاء محادثة جديدة
      const newChat = await addDoc(collection(db, "chats"), {
        buyerId: buyerId,
        buyerName: buyerName,
        sellerId: sellerId,
        sellerPhoto: sellerPhoto,
        sellerName: sellerName,
        lastMessage: "", // سيتم تحديثه بعد إرسال الرسالة الأولى
        typing: false, // حالة الكتابة
        read: false, // حالة القراءة
        timestamp: serverTimestamp(), // توقيت المحادثة
      });

      console.log("New chat created with ID:", newChat.id);
      return newChat.id; // إرجاع معرف المحادثة الجديدة
    } catch (error) {
      console.error("Error creating chat: ", error);
    }
  };

  const handleMessageMeClick = async (workshop) => {
    console.log(workshop);
    setLoading(true);
    // إنشاء المحادثة عند النقر على الزر
    const chatId = await createChat(
      userId,
      currentUser?.fullName,
      workshop._id,
      workshop.registrationDocuments.personalPhoto,
      workshop.name
    );
    if (chatId) {
      // توجيه المستخدم إلى صفحة المحادثة
      console.log("Redirecting to chat:", chatId);
      navigate("/chat");
      // هنا يمكن إضافة منطق للتوجيه إلى صفحة الشات
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white font-serif pb-16">
      {/* Main Content */}
      <div className="flex justify-center items-center h-80 bg-black relative text-center text-white overflow-hidden hero_section">
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative text-center">
          <img
            src="/images/about/home-hotspot-img-1.jpg"
            alt="Background"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="m-auto w-full max-w-4xl text-center text-white">
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {workshop.name}
              </h3>
              <div className="text-center my-4">
                <Link to="/">
                  <span className="text-white hover:text-orange-500 duration-500 text-base sm:text-lg md:text-xl lg:text-2xl">
                    Home
                  </span>
                </Link>
                <span className="text-[#A5A5A5] mx-2"> / </span>
                <span className="text-[#A5A5A5] text-base sm:text-lg md:text-xl lg:text-2xl">
                  {workshop.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work-Shop Details */}
      <section className="py-16 px-8 md:px-16 lg:px-32">
        <div className="flex justify-center items-start space-x-8">
          <div className="w-1/2 pr-8">
            <h2 className="text-3xl font-semibold mb-4">{workshop.name}</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Owner: {workshop.fullName}
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Location: {workshop.address}
            </p>
            <p className="text-gray-400 mb-4">{workshop.description}</p>
          </div>

          <div className="border-l border-gray-600 h-auto"></div>

          <div className="w-1/2 pl-8">
            <h2 className="text-3xl font-semibold mb-4">Message Title</h2>
            <p className="text-gray-400 mb-6">
              Share your thoughts or reach out to us for more information!
            </p>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Rating: {workshop.averageRating.toFixed(1)}
              </p>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`${
                      index < (workshop.averageRating || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2">
                  ({workshop && workshop.ratings && workshop.ratings.length}
                  {"  "}
                  customer reviews)
                </span>
              </div>
            </div>

            <button
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-full"
              onClick={() => handleMessageMeClick(workshop)}
            >
              Message me!
            </button>
          </div>
        </div>
      </section>

      <ProductCarousel workshopId={workshop._id} />
      <div className="flex justify-start mt-5 ml-5">
        <div className="w-fit bg-orange-500 text-white border-orange-500 px-6 py-3 rounded-full border hover:bg-orange-500 hover:border-orange-500 transition-colors duration-300">
          Reviews ({workshop?.ratings?.length})
        </div>
      </div>
      <div className="p-6 rounded-lg text-white">
        {workshop && workshop.ratings && workshop.ratings.length > 0 ? (
          workshop.ratings.map((review, index) => (
            <div key={index} className="border-b border-gray-700 mb-4 pb-4">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    className={`${
                      starIndex < review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-300">
                  {review.user?.fullName || "user"}
                </span>
              </div>
              <p className="text-gray-400">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default HeroSection;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../../css modules/heroSection.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
// import ProductCarousel from "./ProductSection";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Loader from "../Loader";

// const HeroSection = () => {
//   const [workshop, setWorkshop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Use useParams to retrieve the workshop_id from the URL
//   const { workshop_id } = useParams(); // Get the workshop ID from the URL
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWorkshop = async () => {
//       try {
//         // Use the workshop_id to fetch the specific workshop details
//         const response = await axios.get(
//           `http://localhost:5000/api/v1/fur/workshops/${workshop_id}?page=2`
//         );
//         const workShopDetails = response.data;
//         setWorkshop(workShopDetails); // Set the retrieved workshop details
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchWorkshop();
//   }, [workshop_id]); // The effect will run when workshop_id changes

//   // Loading state
//   if (loading) {
//     return <Loader />;
//   }

//   // Error state
//   if (error) {
//     return <div className="text-white text-center">Error: {error}</div>;
//   }

//   const handleChatSelect = () => {
//     navigate("/chat");
//   };

//   return (
//     <div className="min-h-screen text-white font-serif pb-16">
//       {/* Main Content */}
//       <div className="flex justify-center items-center h-80 bg-black relative text-center text-white overflow-hidden hero_section">
//         <div className="absolute inset-0 bg-black opacity-60" />
//         <div className="relative text-center">
//           <img
//             src="/images/about/home-hotspot-img-1.jpg"
//             alt="Background"
//             className="w-full h-auto object-cover rounded-lg shadow-lg"
//           />
//           <div className="absolute inset-0 bg-black opacity-60"></div>
//           <div className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24">
//             <div className="m-auto w-full max-w-4xl text-center text-white">
//               <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
//                 {workshop.name}
//               </h3>
//               <div className="text-center my-4">
//                 <Link to="/">
//                   <span className="text-white hover:text-orange-500 duration-500 text-base sm:text-lg md:text-xl lg:text-2xl">
//                     Home
//                   </span>
//                 </Link>
//                 <span className="text-[#A5A5A5] mx-2"> / </span>
//                 <span className="text-[#A5A5A5] text-base sm:text-lg md:text-xl lg:text-2xl">
//                   {workshop.name}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Work-Shop Details */}
//       <section className="py-16 px-8 md:px-16 lg:px-32">
//         <div className="flex justify-center items-start space-x-8">
//           <div className="w-1/2 pr-8">
//             <h2 className="text-3xl font-semibold mb-4">{workshop.name}</h2>
//             <p className="text-gray-300 text-lg leading-relaxed mb-4">
//               Location: {workshop.location}
//             </p>
//             <p className="text-gray-400 mb-4">{workshop.description}</p>
//           </div>

//           <div className="border-l border-gray-600 h-auto"></div>

//           <div className="w-1/2 pl-8">
//             <h2 className="text-3xl font-semibold mb-4">Message Title</h2>
//             <p className="text-gray-400 mb-6">
//               Share your thoughts or reach out to us for more information!
//             </p>

//             <div className="mb-6">
//               <p className="text-gray-300 mb-2">Rating:</p>
//               <div className="flex space-x-2">
//                 <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
//                 <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
//                 <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
//                 <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
//                 <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-400" />
//               </div>
//             </div>

//             <button
//               className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded w-full"
//               onClick={handleChatSelect}
//             >
//               Message me!
//             </button>
//           </div>
//         </div>
//       </section>

//       <ProductCarousel />
//     </div>
//   );
// };

// export default HeroSection;
