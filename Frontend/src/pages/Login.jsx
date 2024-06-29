import React, { useState, useEffect } from "react";
import { Button } from "../components";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/authSlice';
import { useAuth } from "../utils/AuthProvider";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setUser } = useAuth(); // Get setUser from AuthProvider
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const alertShown = sessionStorage.getItem("alertShown");
    const alertMessage = location.state?.alertMessage || null;
    if (alertMessage && !alertShown) {
      setShowAlert(true);
      sessionStorage.setItem("alertShown", "true");

      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_DB_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        dispatch(authLogin(data.data.user));
        setUser(data.data.user); // Set user in context immediately
        console.log("User logged in");
        navigate("/user");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 flex flex-col justify-center sm:py-12 my-5 md:max-w-[85vw] mx-auto rounded-2xl">
      {showAlert && (
        <div className={`alert error ${showAlert ? "show" : ""}`}>
          Please login to your account first!
          <button className="close-btn" onClick={handleCloseAlert}>
            <i className="fa-solid fa-x"></i>
          </button>
        </div>
      )}
      <div className="relative py-3 sm:max-w-xl sm:mx-auto lg:min-w-[50%]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">
                Login to your Finance Zen!
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="username"
                      name="username"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full bg-white border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Email address"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label
                      htmlFor="username"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Username
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 bg-white w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Button btnText="Login" type="submit" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
