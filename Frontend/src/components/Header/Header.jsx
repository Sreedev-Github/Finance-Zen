import React,{useEffect, useState} from "react";
import "../../index.css";
import { Link } from "react-router-dom";

function Header({val1 = "Home", val2= "About", val3= "AddTransaction"}) {

    const [navShow, setNavShow] = useState(false)
  //   const [navChange, setNavChange]= useState(false)

  //   useEffect(() => {
  //     const handleScroll = () => {
  //       if (window.scrollY > 130) {
  //         setNavChange(true);
  //       } else {
  //         setNavChange(false);
  //       }
  //     };
  
  //     window.addEventListener("scroll", handleScroll);
  
  //     // Remove the event listener when component unmounts
  //     return () => {
  //       window.removeEventListener("scroll", handleScroll);
  //     };
  // }, [navChange]);
  // ${navChange? "fixed top-0 left-1/2 -translate-x-1/2 ease-in-out duration-150 " : ""}

  return (
    <>
        <nav className={`flex justify-between w-full mx-auto mt-0 z-10 md:w-3/4 md:mt-6 p-4 rounded-md bg-white shadow-md text-sm`}>
        <div className="font-bold text-lg z-20">Finance Zen</div>
        <div>
        <ul
            className={`pb-5 text-lg md:sticky flex text-black/80 flex-col md:flex-row gap-10 bg-white absolute min-h-[40vh] left-0 ${navShow?"top-[4.4rem] opacity-100" : "top-[-100%] opacity-0"} md:opacity-100 transition-all duration-700 w-full justify-center items-center md:h-12 md:top-auto md:w-auto md:min-h-fit shadow-md md:shadow-none`}
          >
            <li className="cursor-pointer"><a href="/user">{val1}</a></li>
            <li className="cursor-pointer">{val2}</li>
            <li className="cursor-pointer"><a href="/add-transaction">{val3}</a></li>
            <li className="cursor-pointer md:hidden"><a href="/login">Login</a></li>
          </ul>
        </div>
        <div className="flex gap-12">
        <Link to={"/login"}><button className="z-20 text-lg text-black/80 px-4 md:block hidden">Login</button></Link>
        <label className="hamburger md:hidden z-20">
        <input type="checkbox" onChange={() => setNavShow(!navShow)} />
          <svg viewBox="0 0 32 32">
            <path
              className="line line-top-bottom"
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            ></path>
            <path className="line" d="M7 16 27 16"></path>
          </svg>
        </label>
        </div>
      </nav>
    </>
  );
}

export default Header;
