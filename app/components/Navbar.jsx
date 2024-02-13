import Link from "next/link";

import Image from "next/image";
import Logo from "../../public/LOGO.png";
const Navbar = () => {
  return (
    <div>
      <nav className=" px-2 sm:px-4 py-5 ">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          
            <a href="#" className="flex w-40">
              <Image src={Logo} alt="Logo" />
            </a>
          <div className="flex md:order-2">
            <button
              type="button"
              className="text-gray-700 hover:text-white hover:bg-primary-red border-2 border-primary-red   rounded-3xl  px-5 py-2.5 text-center mr-3 md:mr-0 "
            >
              GET A QUOTE
            </button>
            
          </div>
          <div
            className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
            id="mobile-menu-4"
          >
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0  ">
              <li>
                <Link href="/" className="block py-2 pr-4 pl-3 text-gray-500  md:hover:text-primary-red md:p-0 ">
                  
                    HOME
                  
                </Link>
              </li>
              <li>
                <Link href="/" className="block py-2 pr-4 pl-3 text-gray-500  md:hover:text-primary-red md:p-0 ">
                  
                    CREATE
                  
                </Link>
              </li>
              <li>
                <Link href="/modify" className="block py-2 pr-4 pl-3 text-gray-500  md:hover:text-primary-red md:p-0 ">
                  
                    MODIFY or DELETE
                  
                </Link>
              </li>
              
              <li>
                <Link href="/contact" className="block py-2 pr-4 pl-3 text-gray-500  md:hover:text-primary-red md:p-0 ">
                  
                    CONTACT
                  
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
