import { GiCheckMark } from "react-icons/gi";
import { HeaderPages } from "../components/HeaderPages";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faCouch,
  faBlender,
  faBriefcase,
  faBed,
  faChair,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function AboutUs() {
  const translate = useSelector((state) => state.language.translation);
  return (
    <div>
      {/* Section one*/}
      <HeaderPages namePage={`${translate.about_us}`} />

      {/* Section Two */}
      <div className="homeHub flex flex-col md:flex-row container lg:w-[1440px] mx-auto gap-4 py-20 my-[40px] px-[15px]">
        <div className="first flex-1">
          <p className="text-[--mainColor]">{translate.WE_DESIGN}</p>
          <h2 className="text-xl md:text-2xl lg:text-4xl text-white">
            {translate.world_h2}
          </h2>
          <p className="my-4 line-clamp-4 text-[#dfddddd2]">
            {translate.eleifend_p}
          </p>
          <img alt="example" src="/images/about/first.jpg" />
        </div>
        <div className="second flex-1">
          <img alt="example" src="/images/about/second.jpg" />
          <h2 className="text-xl md:text-2xl lg:text-4xl text-white mt-4">
            {translate.Crafting_Quality_Furnitre}
          </h2>
          <div className="my-6 line-clamp-4 text-[#dfddddd2]">
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

      {/* Section Three */}
      <section className="relative py-8">
        <div className="relative">
          <img
            src="/images/about/counter-bg-h2.jpg"
            alt="Counter Background"
            className="w-full h-48 md:h-64 lg:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>{" "}
          {/* تراكب غامق */}
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-white border-opacity-50 overflow-hidden">
            <div className="flex flex-col items-center justify-center space-y-2 border-b md:border-b-0 md:border-r border-white border-opacity-50 h-full p-2 md:p-4">
              <h2 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                10k+
              </h2>
              <p className="text-xs md:text-sm lg:text-base xl:text-lg text-white">
                {translate.Products_Sold}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 border-b md:border-b-0 md:border-r border-white border-opacity-50 h-full p-2 md:p-4">
              <h2 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                35
              </h2>
              <p className="text-xs md:text-sm lg:text-base xl:text-lg text-white">
                {translate.Years_Service}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 border-b md:border-b-0 md:border-r border-white border-opacity-50 h-full p-2 md:p-4">
              <h2 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                450
              </h2>
              <p className="text-xs md:text-sm lg:text-base xl:text-lg text-white">
                {translate.Outlets_Worldwide}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 border-b lg:border-b-0 h-full p-2 md:p-4">
              <h2 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                1000+
              </h2>
              <p className="text-xs md:text-sm lg:text-base xl:text-lg text-white">
                {translate.Satisfied_Customers}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Four */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[--mainColor] mb-4 text-sm md:text-base lg:text-lg">
              {translate.DIVERSE_RANGE}
            </p>
            <h2 className="text-xl md:text-2xl lg:text-4xl text-white">
              {translate.Customized_Furniture}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex justify-center items-center">
              <img
                src="/images/about/Home-3-Category-04 (1).jpg"
                alt="Customized Furniture"
                className="w-full h-auto object-cover rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center border border-white border-opacity-50 p-6 rounded-md hover:bg-[--mainColor] transition duration-300">
                <FontAwesomeIcon
                  icon={faUtensils}
                  className="text-4xl sm:text-5xl text-white mb-3"
                />
                <p className="text-base sm:text-lg md:text-xl text-white">
                  {translate.Dining_Room}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border border-white border-opacity-50 p-6 rounded-md hover:bg-[--mainColor] transition duration-300">
                <FontAwesomeIcon
                  icon={faCouch}
                  className="text-4xl sm:text-5xl text-white mb-3"
                />
                <p className="text-base sm:text-lg md:text-xl text-white">
                  {translate.Living_Room}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border border-white border-opacity-50 p-6 rounded-md hover:bg-[--mainColor] transition duration-300">
                <FontAwesomeIcon
                  icon={faBlender}
                  className="text-4xl sm:text-5xl text-white mb-3"
                />
                <p className="text-base sm:text-lg md:text-xl text-white">
                  {translate.Kitchen}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border border-white border-opacity-50 p-6 rounded-md hover:bg-[--mainColor] transition duration-300">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="text-4xl sm:text-5xl text-white mb-3"
                />
                <p className="text-base sm:text-lg md:text-xl text-white">
                  {translate.Office}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border border-white border-opacity-50 p-6 rounded-md hover:bg-[--mainColor] transition duration-300">
                <FontAwesomeIcon
                  icon={faBed}
                  className="text-4xl sm:text-5xl text-white mb-3"
                />
                <p className="text-base sm:text-lg md:text-xl text-white">
                  {translate.Bedroom}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border border-white border-opacity-50 p-6 rounded-md hover:bg-[--mainColor] transition duration-300">
                <FontAwesomeIcon
                  icon={faChair}
                  className="text-4xl sm:text-5xl text-white mb-3"
                />
                <p className="text-base sm:text-lg md:text-xl text-white">
                  {translate.Waiting_Hall}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Five */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[--mainColor]">{translate.COMFORTCRAFTERS}</p>
            <h2 className="text-xl md:text-2xl lg:text-4xl text-white">
              {translate.Special_Team}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <div className="flex flex-col items-center">
              <img
                src="/images/about/Home-2-Team-01.jpg"
                alt="Service 1"
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                {translate.chales_scarter}
              </h3>
              <p className="text-[#dfddddd2]">{translate.CEO}</p>
            </div>
            {/* Service 2 */}
            <div className="flex flex-col items-center">
              <img
                src="/images/about/Home-2-Team-03.jpg"
                alt="Service 1"
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                {translate.chales_scarter}
              </h3>
              <p className="text-[#dfddddd2]">{translate.VP_SALES}</p>
            </div>
            {/* Service 3 */}
            <div className="flex flex-col items-center">
              <img
                src="/images/about/Home-2-Team-01.jpg"
                alt="Service 1"
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                {translate.chales_scarter}
              </h3>
              <p className="text-[#dfddddd2]">{translate.PRODUCT_DESIGNER}</p>
            </div>
            {/* Service 4 */}
            <div className="flex flex-col items-center">
              <img
                src="/images/about/Home-2-Team-03.jpg"
                alt="Service 4"
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{translate.Roger}</h3>
              <p className="text-[#dfddddd2]">{translate.Web_Devolper}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-20">
        <div className="relative">
          <img
            src="/images/about/Brand-Logo-BG-Images-03.jpg"
            alt="Background"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-80"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 md:px-8">
            <p className="text-[--mainColor] mb-4 text-sm md:text-base lg:text-lg">
              {translate.ART_OF_COMFORT}
            </p>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
              {translate.Transforming_Spaces}
            </h2>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
              {translate.Transforming_Style}
            </h2>

            <div className="mb-4 w-full max-w-md md:max-w-lg">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your mail id here"
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-[--mainColor] bg-transparent"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <svg
                    className="h-5 w-5 text-[--mainColor]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm md:text-base">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-[--mainColor] rounded focus:ring-2 focus:ring-[--mainColor]"
              />
              <span>{translate.Your_span}</span>
              <Link
                href="#"
                className="text-blue-400 hover:text-blue-600 underline ml-2"
              >
                {translate.Privacy_Policy}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
