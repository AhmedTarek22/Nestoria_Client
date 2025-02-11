import styles from "../css modules/home.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/scrollbar";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaArrowsToDot } from "react-icons/fa6";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import { useInView } from "framer-motion";
import { GiCheckMark } from "react-icons/gi";
import { GiSofa } from "react-icons/gi";
import { GiBedLamp } from "react-icons/gi";
import { BiCabinet } from "react-icons/bi";
import { MdShelves } from "react-icons/md";
import { MdTableChart } from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdDinnerDining } from "react-icons/md";
import { useEffect, useState } from "react";
import { GiKitchenScale } from "react-icons/gi";
import { LuIndianRupee } from "react-icons/lu";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";
import Loader from "../components/Loader";
import LazyLoadedItem from "../components/LazyLoadedItem";
import { useSearchContext } from "../context/SearchContext";
import { useSelector } from "react-redux";
import axiosInstance from "../apis/axiosConfig";

function Home() {
    const { myLang, translation } = useSelector((state) => state.language);
  const translate = useSelector((state) => state.language.translation);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState(
    `${translate.Home_Decoration}`
  );
  const [collectionList, setCollectionList] = useState([]);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(
    "/images/home/Sofa-Home-1-Section-3-01.jpg"
  );
  const homeImgUrls = [
    "/images/home/3.jpg",
    "/images/home/2.jpg",
    "/images/home/1.jpg",
  ];
  const collectionName = [
    `${translate.Home_Decoration}`,
    `${translate.Office_Decoration}`,
    `${translate.Indoor_Decoration}`,
    `${translate.Outdoor_Decoration}`,
  ];

  const customerReviews = [
    {
      name: `${translate.name1}`,
      country: `${translate.country1}`,
      review: `${translate.review1}`,
      image: "/images/home/man1.jpg",
    },
    {
      name: `${translate.name2}`,
      country: `${translate.country2}`,
      review: `${translate.review2}`,
      image: "/images/home/man2.jpg",
    },
    {
      name: `${translate.name3}`,
      country: `${translate.country3}`,
      review: `${translate.review3}`,
      image: "/images/home/man3.jpg",
    },
    {
      name: `${translate.name4}`,
      country: `${translate.country4}`,
      review: `${translate.review4}`,
      image: "/images/home/man4.jpg",
    },
    {
      name: `${translate.name5}`,
      country: `${translate.country5}`,
      review: `${translate.review5}`,
      image: "/images/home/man5.jpg",
    },
  ];

  const sections = [
    {
      name: `${translate.Sofa}`,
      icon: <GiSofa />,
      img: "/images/home/Sofa-Home-1-Section-3-01.jpg",
    },
    {
      name: `${translate.Cabinet}`,
      icon: <BiCabinet />,
      img: "/images/home/Cabinet-Home-1-Section-3-02.jpg",
    },
    {
      name: `${translate.Shelving_Units}`,
      icon: <MdShelves />,
      img: "/images/home/Shelving Units.jpg",
    },
    {
      name: `${translate.Tea_Table}`,
      icon: <MdTableChart />,
      img: "/images/home/tea table.jpg",
    },
    {
      name: `${translate.Decors}`,
      icon: <GiBedLamp />,
      img: "/images/home/decors.jpg",
    },
    {
      name: `${translate.Office_Table}`,
      icon: <HiBuildingOffice2 />,
      img: "/images/home/office table.jpg",
    },
    {
      name: `${translate.Kitchen_Furniture}`,
      icon: <GiKitchenScale />,
      img: "/images/home/kitchenfurniture.jpg",
    },
    {
      name: `${translate.Storage_Furniture}`,
      icon: <MdDinnerDining />,
      img: "/images/home/storage furniture.jpg",
    },
  ];

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          "/api/v1/fur/products/homeproducts"
        );

        const filteredCollection = response.data[1].homeProducts.filter(
          (collection) => collection.category === categoryName
        );
        setCollectionList(filteredCollection);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [categoryName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
    } else if (!isChecked) {
      setError("You must agree to the privacy policy.");
    } else {
      setError("");
      // Handle form submission logic here
    }
  };
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
        effect="fade"
        slidesPerView={1}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
      >
        {homeImgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="sectionOne relative">
                <div
                  className={`${styles.text} flex flex-col gap-1 justify-center items-center absolute top-[30%] left-1/2 z-30`}
                >
                  <p className="text-[--mainColor] hidden md:block">
                    {translate.SMART_SOLUTION}
                  </p>
                  <h1 className="text-center text-lg md:text-3xl  lg:text-4xl xl:text-5xl 2xl:text-6xl my-2 md:my-3 lg:my-1 text-[#ffffffdc] ">
                    {translate.Enjoy_With_Style}
                  </h1>
                  <p className="text-[#dddadaf5]   text-center my-1 md:my-2 line-clamp-1 md:line-clamp-2 lg:line-clamp-3">
                    {translate.The_price_product_section1}
                  </p>
                  <button
                    onClick={() => {
                      navigate("/shop");
                    }}
                    className={`${styles.shopNowBtn} relative bg-[--mainColor] text-[white] py-1 lg:py-2 px-7 rounded-3xl text-sm md:text-lg lg:text-xl mt-2`}
                  >
                    <span className="pr-8">{translate.Shop_Now}</span>
                    <span className=" absolute top-1/2 translate-y-[-50%] right-1 bg-white p-[1px] lg:p-[7px] rounded-full flex justify-center items-center  text-black">
                      <IoIosArrowRoundForward className="text-2xl arrow" />
                    </span>
                  </button>
                </div>
                <img src={url} alt="homeImg" className="w-full h-full" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* section two */}
      <div className="w-full bg-[#101010]  py-[120px]">
        <div className="homeHub flex flex-col md:flex-row  container lg:w-[1440px] mx-auto gap-4 py-20 my-[40px] px-[15px]">
          <div className="first flex-1">
            <p className="text-[--mainColor]">{translate.Home_Decor_Hub}</p>
            <h2 className="text-xl md:text-2xl lg:text-4xl text-white">
              {translate.Exceptional_Furniture}
            </h2>
            <p className="my-4 line-clamp-4 text-[#dfddddd2] ">
              {translate.eleifend_p}
            </p>
            <LazyLoadedItem x="-100">
              <img alt="example" src="/images/home/first.jpg" />
            </LazyLoadedItem>
          </div>
          <div className="second flex-1">
            <LazyLoadedItem x="100">
              <img alt="example" src="/images/home/second.jpg" />
            </LazyLoadedItem>

            <h2 className="text-xl md:text-2xl lg:text-4xl text-white mt-4">
              {translate.Discover_Endless_Designs}
            </h2>
            <div className="my-6 line-clamp-4 text-[#dfddddd2] ">
              {translate.Crafting_h2}
              <div className="tip flex justify-start mt-2 items-center gap-2">
                <GiCheckMark className="text-[--mainColor]" />
                <span>{translate.But_span}</span>
              </div>
              <div className="tip flex justify-start mt-2 items-center gap-2">
                <GiCheckMark className="text-[--mainColor]" />
                <span>{translate.Ginteger_span}</span>
              </div>
              <div className="tip flex justify-start mt-2 items-center gap-2">
                <GiCheckMark className="text-[--mainColor]" />
                <span>{translate.IsConfirm_span}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* section two */}
      {/* section three */}
      <div className={`${styles.sectionThree} bg-black relative`}>
        <div className="relative">
          <img
            src={currentImg}
            alt="currentImg"
            className="w-full h-auto transition-opacity duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black opacity-40 z-10" />
          <div className="sectionsWithIcons absolute inset-0 flex items-center justify-center transition-all duration-200 z-20">
            <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6 transition-all duration-200 px-3">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="link text-center flex items-center cursor-pointer justify-center transition-all duration-200 hover:scale-105"
                  onMouseEnter={() => setCurrentImg(section.img)}
                  onMouseLeave={() => setCurrentImg(currentImg)}
                >
                  <span className="text-white opacity-[0.7] text-xs md:text-xl lg:text-2xl 2xl:text-5xl hover:opacity-[1] font-bold transition-colors z-30">
                    {section.name}
                  </span>
                  <span className="ml-2 text-[--mainColor] text-xl md:text-3xl transition-colors z-30">
                    {section.icon}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* section three */}
      {/* Collection */}
      <div className="w-full bg-[#2c2c2c]  py-[120px]">
        <div className="container lg:w-[1440px] mx-auto flex flex-col justify-center items-center my-10">
          <p className="text-[--mainColor]">{translate.EXPLORE_OUR}</p>
          <h2 className="text-2xl md:text-4xl lg:text-6xl text-white">
            {translate.Luxurious_Haven}
          </h2>
          <div className="collectionsName my-8 flex justify-center items-center px-3">
            <ul className="flex justify-center items-center gap-4 text-white">
              {collectionName.map((collection) => {
                return (
                  <li
                    className={`cursor-pointer  ${
                      collection === categoryName ? "border-b-[1px]" : ""
                    }`}
                    key={collection}
                    onClick={() => {
                      setCategoryName(collection);
                    }}
                  >
                    {collection}
                  </li>
                );
              })}
            </ul>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            // <h2>loader</h2>
            <div className="boxs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto px-3">
              {collectionList.map((product) => {
                return (
                  <div className="box" key={product.id}>
                    <div className="imgContainer relative hover:cursor-pointer hover:scale-105 transition-all duration-200">
                      <Link to={`/product-details/${product.id}`}>
                        <div className="relative group">
                          <img
                            src={product.images[0]}
                            alt="collectionImg"
                            className="rounded-lg"
                          />
                          <img
                            src={product.images[1]}
                            alt="Product Hover"
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        </div>
                      </Link>
                      <span className="absolute top-3 right-2 text-white bg-[--mainColor] p-1 text-xs rounded">
                        {translate.ON_SALE}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-[#e2e1e1d0] my-2">
                        {product.category}
                      </p>
                      <h2 className="text-white text-md md:text-xl lg:text-2xl font-semibold">
                        {myLang === "ar" ? product.nameInArabic : product.name}
                      </h2>
                      <p className="flex justify-center items-center text-white my-2">
                        <LuIndianRupee />
                        {product.price} - <LuIndianRupee /> {product.price + 50}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Collection */}
      {/* Slider */}
      <div
        className={`${styles.mianContainer} w-full  overflow-hidden mx-auto flex justify-center items-center h-[60px] relative bg-[--mainColor] `}
      >
        <p
          className={`${styles.headeranimation} z-30 text-white flex items-center gap-10 py-3 text-xl`}
        >
          <span>
            {translate.Tailored_Furniture}
            <span>
              <FaArrowsToDot className="inline" />
            </span>
          </span>
          <span>{translate.Ensure_Durability}</span>
          <span>
            <FaArrowsToDot className="inline" />
          </span>
          <span>{translate.Diverse_Range}.</span>
          <span>
            <FaArrowsToDot className="inline" />
          </span>
        </p>
        <p
          className={`${styles.headeranimation2} z-30 text-white flex items-center gap-10 py-3 text-xl`}
        >
          {" "}
          <span>{translate.Comfort_And_High}.</span>
          <span>
            <FaArrowsToDot className="inline" />
          </span>
          <span>{translate.Tailored_Furniture}.</span>
          <span>
            <FaArrowsToDot className="inline" />
          </span>
          <span>{translate.Ensure_Durability}.</span>
          <span>
            <FaArrowsToDot className="inline" />
          </span>
        </p>
      </div>
      {/* Slider */}
      {/* accordian */}
      <div className="w-full bg-[#2c2c2c]  py-[120px] min-h-[875px]">
        <div className="container lg:w-[1440px] flex justify-center items-center mx-auto gap-4 flex-col lg:flex-row ">
          <div className="flex-1 px-3 max-h-[625px] overflow-hidden">
            <p className="text-[--mainColor]">
              {translate.Product_related_queries}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-6xl text-white my-5">
              {translate.Products_Service}
            </h2>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
              className="border-b-[1px] border-[#5a5a5a] mb-5"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="text-red-500" />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ background: "#2c2c2c" }}
              >
                <Typography
                  sx={{ color: "white" }}
                  className="hover:text-[--mainColor]"
                >
                  {translate.For_furniture_purchases}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#2c2c2c" }}>
                <Typography className="text-[#dddcdccc] max-w-[80%]">
                  {translate.Pain_should}.{" "}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
              className="border-b-[1px] border-[#5a5a5a] mb-5"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ background: "#2c2c2c" }}
              >
                <Typography
                  sx={{ color: "white" }}
                  className="hover:text-[--mainColor]"
                >
                  {translate.have_eco_friendly}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#2c2c2c" }}>
                <Typography className="text-[#dddcdccc] max-w-[80%]">
                  {translate.I_need_the_wisdom}.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
              className="border-b-[1px] border-[#5a5a5a] mb-5"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ background: "#2c2c2c" }}
              >
                <Typography
                  sx={{ color: "white" }}
                  className="hover:text-[--mainColor]"
                >
                  {translate.Is_it_possible}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#2c2c2c" }}>
                <Typography className="text-[#dddcdccc] max-w-[80%]">
                  {translate.The_yeast_of_the_god}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
              className="border-b-[1px] border-[#5a5a5a] mb-5"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ background: "#2c2c2c" }}
              >
                <Typography
                  sx={{ color: "white" }}
                  className="hover:text-[--mainColor]"
                >
                  {translate.BalDo_you_offer}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#2c2c2c" }}>
                <Typography className="text-[#dddcdccc] max-w-[80%]">
                  {translate.For_the_pure_does}.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel5"}
              onChange={handleChange("panel5")}
              className="border-b-[1px] border-[#5a5a5a] mb-5"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ background: "#2c2c2c" }}
              >
                <Typography
                  sx={{ color: "white" }}
                  className="hover:text-[--mainColor]"
                >
                  {translate.Are_custom_orders}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ background: "#2c2c2c" }}>
                <Typography className="text-[#dddcdccc] max-w-[80%]">
                  {translate.It_is_said_that}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="imgContainer flex-1 px-3">
            <LazyLoadedItem x="100">
              <img
                src="/images/home/Home-1-Section-5-3.jpg"
                alt=""
                className="rounded-lg"
              />
            </LazyLoadedItem>
          </div>
        </div>
      </div>
      {/* accordian */}

      {/* Furniture's */}

      <div className="w-full bg-[#131313]  py-[120px] ">
        <div className="container lg:w-[1440px] mx-auto my-10 px-3">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-[--mainColor]">{translate.Sleek_And_Stylish}</p>
              <h2 className="text-2xl md:text-3xl lg:text-6xl text-white my-5">
                {translate.Innovative_Furniture}
              </h2>
            </div>
            <div className="info text-[#d6d5d5d8] w-[40%] line-clamp-3">
              {translate.The_class}.
            </div>
          </div>
          <div className="imgContainer !mt-[20px] md:!mt-[55px] relative">
            <img src="/images/home/home-hotspot-img-1.jpg" alt="" />
            <DetailsBtn
              top="top-[50%]"
              left="left-[20%]"
              img="/images/home/chair.jpg"
              title="Steel Chair"
              price="$20.00"
            />
            <DetailsBtn
              top="top-[40%]"
              left="left-[62%]"
              img="/images/home/planet.jpg"
              title="Wooden Vase"
              price="$18.00"
            />
            <DetailsBtn
              top="top-[74%]"
              left="left-[65%]"
              img="/images/home/bigChair.jpg"
              title="Soft Cushion Chair"
              price="$40.00"
            />
          </div>
        </div>
      </div>

      {/* Furniture's */}

      {/* our customer */}
      <div className="w-full bg-[#313030]  py-[120px]">
        <div className="container lg-w-[1440px] mx-auto">
          <div className="text text-center ">
            <p className="text-[--mainColor]">{translate.Testimonial_Time}</p>
            <h2 className="text-2xl md:text-3xl lg:text-6xl text-white my-5">
              {translate.Our_Customers_Speak}
            </h2>
            <div className="rating flex justify-center items-center mt-8 gap-2">
              <FaStar className="text-[--mainColor]" />
              <FaStar className="text-[--mainColor]" />
              <FaStar className="text-[--mainColor]" />
              <FaStar className="text-[--mainColor]" />
              <FaStar className="opacity-70 text-[--mainColor]" />
            </div>
          </div>
          <Swiper
            modules={[Navigation, Pagination, EffectFade, Autoplay]}
            effect="fade"
            slidesPerView={1}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
          >
            {customerReviews.map((person, index) => {
              return (
                <SwiperSlide
                  key={index}
                  className="relative z-10 swiper-slide-custom"
                >
                  <div className="customer text-center">
                    <h2 className="text-white max-w-[800px] mx-auto leading-relaxed my-[60px]">
                      {person.review}
                    </h2>
                    <div className="personContainer">
                      <div className="imgContainer w-[90px] h-[90px] mx-auto mt-[80px] mb-3">
                        <img
                          src={person.image}
                          alt="personImg"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <p className="text-[#e6e3e3] text-lg md:text-2xl">
                        {person.name}
                      </p>
                      <p className="text-[#bdbcbcb7]">{person.country}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
      {/* our customer */}

      {/* blog */}
      <div className="w-full bg-[#131313]  py-[120px]">
        <div className="container lg:w-[1440px] mx-auto my-10 px-3">
          <p className="text-[--mainColor]">{translate.Get_the_Latest_News}</p>
          <h2 className="text-2xl md:text-3xl lg:text-6xl text-white my-5">
            {translate.The_Modest_Living}
          </h2>
          <div className="flex justify-center items-center gap-5 flex-col lg:flex-row">
            <div className="right flex-1">
              <div className="imgCotainer overflow-hidden">
                <LazyLoadedItem x="-100">
                  <img
                    src="/images/home/blog-01.jpg"
                    alt="blog-01"
                    className="hover:scale-110 transition-all duration-500 cursor-pointer"
                  />
                </LazyLoadedItem>
              </div>
              <p className="date text-[--mainColor] my-3">
                May 27, 2024 -{" "}
                <span className="text-white ml-2">
                  By
                  <span className="hover:text-[--mainColor] cursor-pointer ml-2 transition-all duration-200">
                    Designer
                  </span>
                </span>
              </p>
              <h2 className="text-xl md:text-3xl text-white hover:text-[--mainColor] cursor-pointer transition-all duration-200">
                {translate.The_Modest_Living}
              </h2>
              <p className="text-[#d4d2d2bb] line-clamp-2 w-[70%] my-3">
                {translate.Bala_Explore_the_best}
              </p>
            </div>
            <div className="left flex-1 ">
              <div className="box flex justify-center items-center gap-5 h-[180px] mb-6">
                <div className="imgContainer w-[45%] overflow-hidden h-full">
                  <LazyLoadedItem x="100">
                    <img
                      src="/images/home/blog-04.jpg"
                      alt="blog-04"
                      className="h-full rounded-lg hover:scale-110 transition-all duration-500 cursor-pointer"
                    />
                  </LazyLoadedItem>
                </div>
                <div className="info flex-1">
                  <p className="date text-[--mainColor]">May 27, 2024</p>
                  <h2 className="mt-3 text-xl md:text-2xl text-white hover:text-[--mainColor] cursor-pointer transition-all duration-500">
                    {translate.Tips_For_Designing}
                  </h2>
                  <p className="text-[#d4d2d2bb] line-clamp-2 w-[70%] my-3">
                    {translate.Struggling_with_limited}.
                  </p>
                </div>
              </div>
              <div className="box flex justify-center items-center gap-5 h-[180px] mb-6">
                <div className="imgContainer w-[45%] overflow-hidden h-full">
                  <LazyLoadedItem x="100">
                    <img
                      src="/images/home/blog-05.jpg"
                      alt="blog-04"
                      className="h-full rounded-lg hover:scale-110 transition-all duration-500 cursor-pointer"
                    />
                  </LazyLoadedItem>
                </div>
                <div className="info flex-1">
                  <p className="date text-[--mainColor]">May 26, 2024</p>
                  <h2 className="mt-3 text-xl md:text-2xl text-white hover:text-[--mainColor] cursor-pointer transition-all duration-500">
                    {translate.Easy_Way}
                  </h2>
                  <p className="text-[#d4d2d2bb] line-clamp-2 w-[70%] my-3">
                    {translate.ransform_your_bedroom}.
                  </p>
                </div>
              </div>
              <div className="box flex justify-center items-center gap-5 h-[180px] ">
                <div className="imgContainer w-[45%] overflow-hidden h-full">
                  <LazyLoadedItem x="100">
                    <img
                      src="/images/home/blog-09.jpg"
                      alt="blog-04"
                      className="h-full rounded-lg hover:scale-110 transition-all duration-500 cursor-pointer"
                    />
                  </LazyLoadedItem>
                </div>
                <div className="info flex-1">
                  <p className="date text-[--mainColor]">May 25, 2024</p>
                  <h2 className="mt-3 text-xl md:text-2xl text-white hover:text-[--mainColor] cursor-pointer transition-all duration-500">
                    {translate.Minimalist_Modern}
                  </h2>
                  <p className="text-[#d4d2d2bb] line-clamp-2 w-[70%] my-3">
                    {translate.Discover_innovative}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* blog */}
      {/* Transforming */}
      <div className="transforming w-full min-h-[160px]">
        <div className="relative h-full w-full">
          <img
            src="/images/home/Hue_Saturation 1.png"
            alt=""
            className="h-full w-full"
          />
          <div className="text text-center mx-auto absolute z-20 top-1/2 left-1/2 transform translate-x-[-50%]  translate-y-[-50%]">
            <p className="text-[--mainColor] ">Art Of Comfort</p>
            <h2 className="text-xl md:text-3xl lg:text-6xl text-white my-2 md:my-5 ">
              {translate.Transforming_Spaces},
            </h2>
            <h2 className="text-2xl md:text-3xl lg:text-6xl text-white my-2 md:my-5 hidden md:block">
              {translate.Transforming_Style}
            </h2>
            <form className="relative w-[80%] mx-auto" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="off"
                className="placeholder:text-sm w-full placeholder:md:text-lg py-1 md:py-3 px-6 bg-transparent border border-[--mainColor] rounded-3xl  outline-none caret-[#6a6a6a] text-[#979696]"
                placeholder="Enter Your Email Here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit">
                <IoSendSharp className="absolute top-[27%] right-2 transform translate-y-[-50%] bg-white w-9 h-[20%]  lg:h-[40%] rounded-full text-black p-[9px] lg:[7px] cursor-pointer hover:bg-[--mainColor] hover:text-white transition-all duration-500 hidden lg:block" />
              </button>

              <div className="flex justify-center items-center mt-2 lg:mt-4 mb-2">
                <input
                  type="checkbox"
                  id="privacyPolicy"
                  className="mr-2 w-4 h-4 accent-[--mainColor] bg-gray-200 checked:bg-[--mainColor] checked:border-transparent "
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  required
                />
                <label
                  htmlFor="privacyPolicy"
                  className="text-[#979696] line-clamp-2 text-sm whitespace-nowrap"
                >
                  Your email is safe with us, we don't spam.
                  <Link href="/privacy-policy" className="underline text-white">
                    {translate.Privacy_Policy}
                  </Link>
                </label>
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>
      </div>
      {/* Transforming */}
    </div>
  );
}
export default Home;

export const DetailsBtn = ({ top, left, img, title, price }) => {
  const [showDtails, setShowDetails] = useState(false);
  function changeDetails() {
    setShowDetails((prev) => !prev);
  }
  return (
    <div className={`absolute ${top} ${left}`}>
      <button
        className={`bg-[--mainColor] text-white text-md lg:text-3xl w-[20px] h-[20px] md:w-[25px] md:h-[25px] lg:w-[34px] lg:h-[34px] flex justify-center items-center lg:items-start rounded-full transition-all duration-500 ${
          showDtails ? "rotate-45" : ""
        }`}
        onClick={changeDetails}
      >
        <span className="leading-none ">+</span>
      </button>

      <div
        className={`rounded-lg details absolute text-white flex-col md:flex-row flex justify-start mt-2 items-center gap-2 bg-[#101010] py-[20px] lg:py-[53px] px-3 min-w-[140px] max-h-[75px] md:min-w-[250px] md:max-h-[87px] lg:min-w-[290px] lg:max-h-[87px] ${
          showDtails ? "opacity-100" : "opacity-0"
        } transition-all duration-500 z-10 rtl`}
      >
        <div className="imgContainer bg-[#282828] max-h-[80px]  p-3">
          <img
            src={`${img}`}
            alt="detailsImg"
            className="rounded-lg max-w-full max-h-full w-[60px]"
          />
        </div>
        <div className="text ml-3">
          <p>{title}</p>
          <p>From {price}</p>
        </div>
      </div>
    </div>
  );
};
