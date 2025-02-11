import React, { useState, createRef, useEffect, useRef } from "react";
import { FaPaperPlane, FaPaperclip } from "react-icons/fa";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { useUserInfoContext } from "../context/UserProvider";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Swal from "sweetalert2";

function SingleChat({ chat, setIsLoading, isLoading }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const fileInput = createRef();
  const { currentUser } = useUserInfoContext();
  const containerRef = useRef(null);

  useEffect(() => {
    if (chat.id) {
      const q = query(
        collection(db, `chats/${chat.id}/messages`),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      });
      return () => unsubscribe();
    }
  }, [chat.id]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire("Error", "Failed to upload image", "error");
    }
  };
  function handleEnterMessage(event) {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

  const handleSendMessage = async () => {
    let messageData = {
      senderId: currentUser._id,
      timestamp: serverTimestamp(),
      isRead: false,
      read: false,
    };

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      if (imageUrl) {
        messageData.imageUrl = imageUrl;
        setImageFile(null);
        setImagePreview(null);
      }
    }

    if (newMessage) {
      messageData.content = newMessage;
      setNewMessage("");
    }

    if (messageData.content || messageData.imageUrl) {
      await addDoc(collection(db, `chats/${chat.id}/messages`), messageData);

      const chatRef = doc(db, `chats/${chat.id}`);
      await updateDoc(chatRef, {
        lastMessage: {
          text: messageData.content || "Image Sent 📸",
          timestamp: messageData.timestamp,
          sender: messageData.senderId,
          isRead: false,
        },
        timestamp: messageData.timestamp,
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-gray-400 rounded-3xl relative">
      {/* Header */}
      <div className="flex justify-start items-center border-b border-gray-600 min-h-[60px] px-6">
        <div className="flex">
          <img
            src={chat.sellerPhoto}
            alt="sellerPhoto"
            className="max-w-[40px] mr-2 rounded-full"
          />
          <span className="text-xl text-gray-200 py-2">{chat.sellerName}</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="chat-container overflow-auto h-[600px]"
        ref={containerRef}
      >
        <ul className="messages-list mb-5">
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={` ${
                  message.senderId === currentUser._id
                    ? "senderMessageStyle"
                    : "receiverMessageStyle"
                } flex justify-end mr-4`}
              >
                <li
                  className={`${
                    message.senderId !== currentUser._id ? "received " : "sent"
                  } py-2 px-3 my-2 mx-2 w-1/2 text-white rounded-md`}
                >
                  {message.content && <p>{message.content}</p>}
                  {message.imageUrl && (
                    <div className="flex justify-center">
                      <img
                        src={message.imageUrl}
                        alt="photo"
                        className="w-1/2 mt-2"
                      />
                    </div>
                  )}
                  <div
                    className={`${
                      message.senderId !== currentUser._id
                        ? "justify-end "
                        : "justify-start"
                    } flex  text-sm text-[#d6d5d5c9]`}
                  >
                    <span>
                      {
                        message.timestamp
                          ?.toDate()
                          .toLocaleString()
                          .split(",")[1]
                      }
                    </span>
                  </div>
                </li>
              </div>
            ))
          ) : (
            <p className="flex justify-center items-center h-[400px] text-white">
              There is No Messages Yet
            </p>
          )}
        </ul>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full p-4 flex items-center space-x-4 bg-[#1a1a1a]">
        <FaPaperclip
          className="text-xl text-[#C96B14] hover:text-[#c96c14c9] cursor-pointer transition-colors duration-300"
          onClick={() => setToggle(!toggle)}
        />
        <input
          type="text"
          className="flex-grow p-2 bg-[#292929] border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C26510]"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={handleEnterMessage}
        />
        <button
          disabled={!newMessage && !imageFile} // Enable button if there's a message or image
          className="p-2 hover:text-[#C26510] transition-colors duration-300"
          type="button"
          onClick={handleSendMessage}
        >
          <FaPaperPlane className="text-xl text-[#99c794] cursor-pointer" />
        </button>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="image-preview p-4">
          <img src={imagePreview} alt="Preview" className="max-w-full h-auto" />
        </div>
      )}

      {/* File Upload Menu */}
      {toggle && (
        <div className="absolute bottom-16 left-6 w-48 bg-[#333] text-gray-300 shadow-lg rounded-lg p-4">
          <form>
            <label
              htmlFor="photo"
              className="flex items-center py-2 px-3 gap-3 hover:bg-[#444] rounded-lg cursor-pointer transition-colors duration-300"
            >
              <div className="text-gray-200">
                <p>Add Image</p>
              </div>
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              ref={fileInput}
              className="hidden"
              onChange={handleImageUpload}
            />
          </form>
        </div>
      )}
    </div>
  );
}

export default SingleChat;
