import { faAt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";


function Footer(){
  return(
    <footer className="bg-black py-8 flex justify-between w-[1440px] m-auto">
      <div className="w-[30%]">
        <h2 className="text-white text-3xl">Nestoria</h2>
        <p className="text-white text-xl my-5">Proin a interdum elit. Etiam eu sapien sem. Suspendisse a massa justo. Cras eget lorem nunc. Fusce nec urna tempus tempus</p>
        <div className="flex gap-4">
          <FontAwesomeIcon className="text-white text-xl" icon={faAt} />
          <FaInstagram className="text-white text-xl" />
          <FaFacebookF className="text-white text-xl" />
          <FaYoutube className="text-white text-xl"></FaYoutube>
          <FaTwitter className="text-white text-xl"></FaTwitter>
        </div>
      </div>

      <div className="flex gap-10 w-[40%]">
        <div className="text-white flex flex-col">
          <h4 className="text-xl mb-4">Useful links</h4>
          <Link className="my-1 hover:text-orange-500 duration-500" to={"/"}>History</Link>
          <Link className="my-1 hover:text-orange-500 duration-500" to={"/"}>Our Team</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Privacy Policy</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Services Offered</Link>
          <Link className="hover:text-orange-500 duration-500">Product Catalog</Link>
        </div>

        <div className="text-white flex flex-col">
          <h4 className="text-xl mb-4">Information</h4>
          <Link className="my-2 hover:text-orange-500 duration-500">FAQ/Return</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Privacy/Terms</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Affiliate</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Sizing Guide</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Accessibility</Link>
        </div>

        <div className="text-white flex flex-col">
          <h4 className="text-xl mb-4">Support</h4>
          <Link className="my-1 hover:text-orange-500 duration-500">Your Account</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Press Release</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Return Centre</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">App Download</Link>
          <Link className="my-1 hover:text-orange-500 duration-500">Advertisements</Link>
        </div>
      </div>

      <div>
        <h4 className="text-xl">Follow @Instagram</h4>
      </div>
    </footer>
  );
}

export default Footer;