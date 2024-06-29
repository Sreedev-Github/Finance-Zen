import React, { useEffect, useState } from "react";
import "../../index.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { useAuth } from "../../utils/AuthProvider";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.status); // Adjust selector as per your state structure
  const [navShow, setNavShow] = useState(false);
  const { setUser } = useAuth();

  useEffect(() => {
    // Perform any side effects or actions when authStatus changes
    console.log("Auth status changed:", authStatus);
  }, [authStatus]);

  const handleLogout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DB_URL}/user/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
        setUser(null);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <nav
        className={`flex justify-between w-full mx-auto mt-0 z-10 md:w-3/4 md:mt-6 p-4 rounded-md bg-white shadow-md text-sm`}
      >
        <div className="font-bold text-lg z-20">
          <Link to="/">Finance Zen</Link>
        </div>
        <div>
          <ul
            className={`pb-5 text-lg md:sticky flex text-black/80 flex-col md:flex-row gap-10 bg-white absolute min-h-[40vh] left-0 ${
              navShow ? "top-[4.4rem] opacity-100" : "top-[-100%] opacity-0"
            } md:opacity-100 transition-all duration-700 w-full justify-center items-center md:h-12 md:top-auto md:w-auto md:min-h-fit shadow-md md:shadow-none`}
          >
            <li className="cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="cursor-pointer">
              <Link to="/user">Dashboard</Link>
            </li>
            <li className="cursor-pointer">
              <Link to="/add-finance">Add Finance</Link>
            </li>
            {!authStatus && (
              <li className="cursor-pointer md:hidden">
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="flex gap-8">
          {!authStatus ? (
            <div className="flex">
              <Link to="/login">
                <button className="z-20 text-lg text-black/80 px-4 md:block hidden">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="z-20 text-lg text-black/80 px-4 md:block hidden">
                  Signup
                </button>
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="z-20 text-lg text-black/80 px-4 md:block hidden"
            >
              Logout
            </button>
          )}
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
