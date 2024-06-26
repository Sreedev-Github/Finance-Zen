import React, { useState } from "react";
import { Button } from "../components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import { useAuth } from "../utils/AuthProvider";
// Remove the nav bar scroll down animation form this page
function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DB_URL}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);

        try {
          const loginResponse = await fetch(
            `${import.meta.env.VITE_DB_URL}/user/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password }),
            }
          );

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            localStorage.setItem("accessToken", loginData.data.accessToken);
            localStorage.setItem("refreshToken", loginData.data.refreshToken);
            dispatch(authLogin(loginData.data.user));
            setUser(loginData.data.user);
            console.log("User logged in");
            navigate("/user");
          } else {
            const errorText = await loginResponse.text();
            console.error("Login failed:", extractErrorMessage(errorText));
          }
        } catch (error) {
          console.error("Error during login:", error);
        }
      } else {
        const errorText = await response.text();
        console.error("Registration failed:", extractErrorMessage(errorText));
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const extractErrorMessage = (text) => {
    try {
      const errorJson = JSON.parse(text);
      return errorJson.message || "An error occurred";
    } catch (e) {
      return text.split("<pre>")[1]?.split("<br>")[0] || "An error occurred";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 flex flex-col justify-center sm:py-12 my-5 md:max-w-[85vw] mx-auto rounded-2xl">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto lg:min-w-[50%]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">
                Get started with Finance Zen!
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full bg-white border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Email address"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 bg-white w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
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
                    <Button btnText="Sign Up" />
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

export default Signup;
