// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { FaCloudUploadAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // Define the function to upload files to Cloudinary
// const uploadToCloudinary = async (file) => {
//   const cloudName = 'yussef'; // Replace with your Cloudinary cloud name
//   const uploadPreset = 'ml_default'; // Replace with your whitelisted unsigned upload preset

//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', uploadPreset);

//   try {
//     const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
//     return response.data.secure_url; // Return the secure URL from Cloudinary
//   } catch (error) {
//     console.error('Error uploading file to Cloudinary:', error);
//     throw error;
//   }
// };

// const SellerPage = () => {
//   const [formData, setFormData] = useState({
//     workshopName: '',
//     address: '',
//     phoneNumber: '',
//     bankStatement: null,
//     taxFile: null,
//     frontID: null,
//     backID: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [previewBankStatement, setPreviewBankStatement] = useState(null);
//   const [previewTaxFile, setPreviewTaxFile] = useState(null);
//   const [previewFrontID, setPreviewFrontID] = useState(null);
//   const [previewBackID, setPreviewBackID] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const navigate = useNavigate();

//   const handleDrop = (acceptedFiles, name) => {
//     const file = acceptedFiles[0];

//     if (name === 'backID' && formData.frontID && file.name === formData.frontID.name) {
//       setErrors((prev) => ({ ...prev, [name]: 'Back ID cannot be the same as Front ID' }));
//       return;
//     }
//     if (name === 'frontID' && formData.backID && file.name === formData.backID.name) {
//       setErrors((prev) => ({ ...prev, [name]: 'Front ID cannot be the same as Back ID' }));
//       return;
//     }

//     if (file && file.size <= 2 * 1024 * 1024) {
//       setFormData((prev) => ({ ...prev, [name]: file }));
//       const preview = URL.createObjectURL(file);
//       if (name === 'bankStatement') setPreviewBankStatement(preview);
//       if (name === 'taxFile') setPreviewTaxFile(preview);
//       if (name === 'frontID') setPreviewFrontID(preview);
//       if (name === 'backID') setPreviewBackID(preview);
//       setErrors((prev) => ({ ...prev, [name]: null }));
//     } else {
//       setErrors((prev) => ({ ...prev, [name]: 'File size must be less than 2MB' }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     validateField(name, value);
//   };

//   const validateField = (name, value) => {
//     const newErrors = { ...errors };
//     const phoneRegex = /^\+20\d{10}$/;
//     const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,8}$/;

//     switch (name) {
//       case 'workshopName':
//         newErrors.workshopName = value.length >= 8 ? null : 'Workshop Name must be at least 8 characters long';
//         break;
//       case 'address':
//         newErrors.address = addressRegex.test(value) ? null : 'Address is required and should be at least 3 characters long';
//         break;
//       case 'phoneNumber':
//         newErrors.phoneNumber = phoneRegex.test(value) ? null : 'Phone Number must start with +20 and be 12 digits';
//         break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setUploading(true);
//       try {
//         // Upload files to Cloudinary
//         const uploadPromises = [
//           formData.bankStatement && uploadToCloudinary(formData.bankStatement),
//           formData.taxFile && uploadToCloudinary(formData.taxFile),
//           formData.frontID && uploadToCloudinary(formData.frontID),
//           formData.backID && uploadToCloudinary(formData.backID),
//         ].filter(Boolean);

//         const uploadResults = await Promise.all(uploadPromises);

//         // Update formData with the URLs from Cloudinary
//         const updatedFormData = {
//           ...formData,
//           bankStatement: uploadResults[0],
//           taxFile: uploadResults[1],
//           frontID: uploadResults[2],
//           backID: uploadResults[3],
//         };

//         // Now you can send `updatedFormData` to your backend
//         console.log(updatedFormData);

//         setUploading(false);
//         navigate('/thanks');
//       } catch (error) {
//         setUploading(false);
//         console.error('Upload failed:', error);
//       }
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const phoneRegex = /^\+20\d{10}$/;
//     const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;

//     if (!formData.workshopName || formData.workshopName.length < 8) newErrors.workshopName = 'Workshop Name is required';
//     if (!formData.address || !addressRegex.test(formData.address)) newErrors.address = 'Address is required and should be at least 3 characters long';
//     if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber))
//       newErrors.phoneNumber = 'Phone Number must start with +20 and be 12 digits';
//     if (!formData.bankStatement) newErrors.bankStatement = 'Bank Statement is required';
//     if (!formData.taxFile) newErrors.taxFile = 'Tax File is required';
//     if (!formData.frontID) newErrors.frontID = 'Front ID image is required';
//     if (!formData.backID) newErrors.backID = 'Back ID image is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const { getRootProps: getRootPropsBank, getInputProps: getInputPropsBank } = useDropzone({
//     accept: 'image/*',
//     onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'bankStatement'),
//   });

//   const { getRootProps: getRootPropsTax, getInputProps: getInputPropsTax } = useDropzone({
//     accept: 'application/pdf, image/*',
//     onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'taxFile'),
//   });

//   const { getRootProps: getRootPropsFront, getInputProps: getInputPropsFront } = useDropzone({
//     accept: 'image/*',
//     onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'frontID'),
//   });

//   const { getRootProps: getRootPropsBack, getInputProps: getInputPropsBack } = useDropzone({
//     accept: 'image/*',
//     onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'backID'),
//   });

//   return (
//     <div className=" mx-auto p-4 py-16 px-4 md:px-10 text-white"
//     style={{
//       backgroundImage: "url('/body-bg.png')",
//       backgroundPosition: "left top",
//       backgroundSize: "auto",
//       backgroundRepeat: "repeat",
//       backgroundAttachment: "scroll",
//       backgroundColor: "#101010",
//     }}
 
    
//     >
//       <div className="bg-[#000] p-8 rounded-3xl shadow-md">
//         <h2 className="text-3xl text-[#C26510] mb-6 text-center py-10">Seller Registration</h2>
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-white w-full">
//           {/* Workshop Name */}
//           <div className="flex flex-col">
//             <label htmlFor="workshopName" className="mb-2 ">Workshop Name</label>
//             <input
//               id="workshopName"
//               name="workshopName"
//               type="text"
//               value={formData.workshopName}
//               onChange={handleChange}
//               className="p-4 rounded-3xl border border-[#A5A5A5] text-white bg-[#000] focus:border-[#C26510] focus:outline-none transition duration-500"
//             />
//             {errors.workshopName && <p className="text-red-500 text-sm mt-1">{errors.workshopName}</p>}
//           </div>

//           {/* Address */}
//           <div className="flex flex-col">
//             <label htmlFor="address" className=" mb-2 ">Address</label>
//             <input
//               id="address"
//               name="address"
//               type="text"
//               value={formData.address}
//               onChange={handleChange}
//               className="p-4 rounded-3xl border border-[#A5A5A5] text-white bg-[#000] focus:border-[#C26510] focus:outline-none transition duration-500"
//             />
//             {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//           </div>

//           {/* Phone Number */}
//           <div className="flex flex-col">
//             <label htmlFor="phoneNumber" className=" mb-2">Phone Number</label>
//             <input
//               id="phoneNumber"
//               name="phoneNumber"
//               type="text"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               className="p-4 rounded-3xl border border-[#A5A5A5] text-white bg-[#000] focus:border-[#C26510] focus:outline-none transition duration-500"
//             />
//             {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
//           </div>

//           {/* Bank Statement */}
//           <div {...getRootPropsBank()} className="border-2 border-dashed border-[#929292] p-6 rounded-3xl cursor-pointer">
//             <input {...getInputPropsBank()} />
//             <div className="text-center">
//               <FaCloudUploadAlt className="text-4xl mb-2" />
//               <p className="text-sm text-[#A5A5A5]">Upload Bank Statement</p>
//               {previewBankStatement && <img src={previewBankStatement} alt="Bank Statement Preview" className="mt-2 max-w-full h-auto" />}
//               {errors.bankStatement && <p className="text-red-500 text-sm mt-1">{errors.bankStatement}</p>}
//             </div>
//           </div>

//           {/* Tax File */}
//           <div {...getRootPropsTax()} className="border-2 border-dashed border-[#929292] p-6 rounded-3xl cursor-pointer">
//             <input {...getInputPropsTax()} />
//             <div className="text-center">
//               <FaCloudUploadAlt className="text-4xl mb-2" />
//               <p className="text-sm text-[#A5A5A5]">Upload Tax File</p>
//               {previewTaxFile && <img src={previewTaxFile} alt="Tax File Preview" className="mt-2 max-w-full h-auto" />}
//               {errors.taxFile && <p className="text-red-500 text-sm mt-1">{errors.taxFile}</p>}
//             </div>
//           </div>

//           {/* Front ID */}
//           <div {...getRootPropsFront()} className="border-2 border-dashed border-[#929292] p-6 rounded-3xl cursor-pointer">
//             <input {...getInputPropsFront()} />
//             <div className="text-center">
//               <FaCloudUploadAlt className="text-4xl mb-2" />
//               <p className="text-sm text-[#929292]">Upload Front ID</p>
//               {previewFrontID && <img src={previewFrontID} alt="Front ID Preview" className="mt-2 max-w-full h-auto" />}
//               {errors.frontID && <p className="text-red-500 text-sm mt-1">{errors.frontID}</p>}
//             </div>
//           </div>

//           {/* Back ID */}
//           <div {...getRootPropsBack()} className="border-2 border-dashed border-[#929292] p-6 rounded-3xl cursor-pointer">
//             <input {...getInputPropsBack()}  />
//             <div className="text-center">
//               <FaCloudUploadAlt className="text-4xl mb-2" />
//               <p className="text-sm text-[#929292]">Upload Back ID</p>
//               {previewBackID && <img src={previewBackID} alt="Back ID Preview" className="mt-2 max-w-full h-auto" />}
//               {errors.backID && <p className="text-red-500 text-sm mt-1">{errors.backID}</p>}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="col-span-full mt-6 flex justify-center">
//             <button
//               type="submit"
//               className={`w-1/2 p-4 rounded-3xl text-white bg-[#C26510] hover:bg-[#A0522D] transition duration-500  ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               disabled={uploading}
//             >
//               {uploading ? 'Submitting...' : 'Submit'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default SellerPage;

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cloudName = 'yussef'; // Replace with your Cloudinary cloud name
const uploadPreset = 'ml_default'; // Replace with your whitelisted unsigned upload preset

// Regex constants
const ADDRESS_REGEX = /^[\u0621-\u064A\u0660-\u0669a-zA-Z0-9\s,.-]{3,100}$/;

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

const SellerPage = () => {
  const [formData, setFormData] = useState({
    workshopName: '',
    address: '',
    bankStatement: null,
    taxFile: null,
    frontID: null,
    backID: null,
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState({});

  const navigate = useNavigate();

  const handleDrop = (acceptedFiles, name) => {
    const file = acceptedFiles[0];
    const preview = URL.createObjectURL(file);

    if (file && file.size <= 2 * 1024 * 1024) {
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: preview }));
      setErrors((prev) => ({ ...prev, [name]: null }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: 'File size must be less than 2MB' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === 'workshopName') {
      newErrors.workshopName = value.length >= 8 ? null : 'Workshop Name must be at least 8 characters long';
    } else if (name === 'address') {
      newErrors.address = ADDRESS_REGEX.test(value) ? null : 'Address must be at least 10 characters long';
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.workshopName || formData.workshopName.length < 8) {
      newErrors.workshopName = 'Workshop Name is required and must be at least 8 characters';
    }
    if (!ADDRESS_REGEX.test(formData.address)) {
      newErrors.address = 'Address is required and should be at least 10 characters long';
    }
    if (!formData.bankStatement) newErrors.bankStatement = 'Bank Statement is required';
    if (!formData.taxFile) newErrors.taxFile = 'Tax File is required';
    if (!formData.frontID) newErrors.frontID = 'Front ID image is required';
    if (!formData.backID) newErrors.backID = 'Back ID image is required';
    if (!formData.avatar) newErrors.avatar = 'Profile Picture is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setUploading(true);
      try {
        const uploadResults = await Promise.all([
          formData.avatar && uploadToCloudinary(formData.avatar),
          formData.bankStatement && uploadToCloudinary(formData.bankStatement),
          formData.taxFile && uploadToCloudinary(formData.taxFile),
          formData.frontID && uploadToCloudinary(formData.frontID),
          formData.backID && uploadToCloudinary(formData.backID),
        ]);

        const updatedFormData = {
          ...formData,
          avatar: uploadResults[0],
          bankStatement: uploadResults[1],
          taxFile: uploadResults[2],
          frontID: uploadResults[3],
          backID: uploadResults[4],
        };

        console.log(updatedFormData);
        setUploading(false);
        toast.success('Submission Successful!');
        navigate('/thanks');
      } catch (error) {
        setUploading(false);
        console.error('Upload failed:', error);
        toast.error('Upload failed. Please try again.');
      }
    } else {
      toast.error('Please fill all required fields.');
    }
  };

  const { getRootProps: getRootPropsAvatar, getInputProps: getInputPropsAvatar } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'avatar'),
  });

  const { getRootProps: getRootPropsBank, getInputProps: getInputPropsBank } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'bankStatement'),
  });

  const { getRootProps: getRootPropsTax, getInputProps: getInputPropsTax } = useDropzone({
    accept: 'application/pdf, image/*',
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'taxFile'),
  });

  const { getRootProps: getRootPropsFront, getInputProps: getInputPropsFront } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'frontID'),
  });

  const { getRootProps: getRootPropsBack, getInputProps: getInputPropsBack } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'backID'),
  });

  return (
    <div className="mx-auto p-4 py-16 px-4 md:px-10 text-white"
      style={{
        backgroundImage: "url('/body-bg.png')",
        backgroundPosition: "left top",
        backgroundSize: "auto",
        backgroundRepeat: "repeat",
        backgroundColor: "#101010",
      }}>
      <ToastContainer />
      <div className="bg-[#000] p-8 rounded-3xl shadow-md">
        <h2 className="text-3xl text-[#C26510] mb-6 text-center py-10">Seller Registration</h2>
        {/* Avatar Upload */}
        <div className="flex justify-center mb-8">
          <div {...getRootPropsAvatar()} className="relative border-4 border-dashed border-[#C26510] p-4 rounded-full cursor-pointer overflow-hidden w-40 h-40">
            <input {...getInputPropsAvatar()} />
            {previews.avatar ? (
              <img src={previews.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FaCloudUploadAlt className="text-4xl text-[#C26510]" />
                <p className="text-sm text-[#A5A5A5]">Upload Avatar</p>
              </div>
            )}
          </div>
          {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-white w-full">
          {/* Workshop Name */}
          <div className="flex flex-col">
            <label htmlFor="workshopName" className="mb-2 ">Workshop Name</label>
            <input
              id="workshopName"
              name="workshopName"
              type="text"
              value={formData.workshopName}
              onChange={handleChange}
              className="p-4 rounded-3xl border border-[#A5A5A5] text-white bg-[#000] focus:border-[#C26510] focus:outline-none transition duration-500"
            />
            {errors.workshopName && <p className="text-red-500 text-sm mt-1">{errors.workshopName}</p>}
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className=" mb-2 ">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="p-4 rounded-3xl border border-[#A5A5A5] text-white bg-[#000] focus:border-[#C26510] focus:outline-none transition duration-500"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Bank Statement */}
          <div {...getRootPropsBank()} className="border-2 border-dashed border-[#929292] p-6 rounded-3xl cursor-pointer">
            <input {...getInputPropsBank()} />
            <div className="text-center">
              <FaCloudUploadAlt className="text-4xl mb-2" />
              <p className="text-sm text-[#A5A5A5]">Upload Bank Statement</p>
              {previews.bankStatement && <img src={previews.bankStatement} alt="Bank Statement Preview" className="mt-2 max-w-full h-auto" />}
              {errors.bankStatement && <p className="text-red-500 text-sm mt-1">{errors.bankStatement}</p>}
            </div>
          </div>

          {/* Tax File */}
          <div {...getRootPropsTax()} className="border-2 border-dashed border-[#929292] p-6 rounded-3xl cursor-pointer">
            <input {...getInputPropsTax()} />
            <div className="text-center">
              <FaCloudUploadAlt className="text-4xl mb-2" />
              <p className="text-sm text-[#A5A5A5]">Upload Tax File</p>
              {previews.taxFile && <img src={previews.taxFile} alt="Tax File Preview" className="mt-2 max-w-full h-auto" />}
              {errors.taxFile && <p className="text-red-500 text-sm mt-1">{errors.taxFile}</p>}
            </div>
          </div>

          {/* Front ID */}
          <div {...getRootPropsFront()} className="border-2 border-dashed border-[#929292] p-6 rounded-3xl cursor-pointer">
            <input {...getInputPropsFront()} />
            <div className="text-center">
              <FaCloudUploadAlt className="text-4xl mb-2" />
              <p className="text-sm text-[#929292]">Upload Front ID</p>
              {previews.frontID && <img src={previews.frontID} alt="Front ID Preview" className="mt-2 max-w-full h-auto" />}
              {errors.frontID && <p className="text-red-500 text-sm mt-1">{errors.frontID}</p>}
            </div>
          </div>

          {/* Back ID */}
          <div {...getRootPropsBack()} className="border-2 border-dashed border-[#929292] p-6 rounded-3xl cursor-pointer">
            <input {...getInputPropsBack()} />
            <div className="text-center">
              <FaCloudUploadAlt className="text-4xl mb-2" />
              <p className="text-sm text-[#929292]">Upload Back ID</p>
              {previews.backID && <img src={previews.backID} alt="Back ID Preview" className="mt-2 max-w-full h-auto" />}
              {errors.backID && <p className="text-red-500 text-sm mt-1">{errors.backID}</p>}
            </div>
          </div>

          <div className="col-span-full mt-6 flex justify-center">
            <button
              type="submit"
              className={`w-1/2 p-4 rounded-3xl text-white bg-[#C26510] hover:bg-[#A0522D] transition duration-500  ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={uploading}
            >
              {uploading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerPage;


