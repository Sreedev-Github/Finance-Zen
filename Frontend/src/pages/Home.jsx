import React from "react";
import { motion } from "framer-motion";
import splitStringUsingRegex from "../utils/splitStringUsingRegex";
import { Button, Card } from "../components/index";
import mockupImage from "../assets/mockup.jpg";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const heroHeading = "Your New Financial Sidekick";
  const heroText =
    "Your go-to platform for tracking earnings and expenditures effortlessly. With intuitive tools and insightful analytics, we simplify the journey towards financial clarity. Let us help you stay on top of your finances with ease and precision. Take control of your finances today and unlock a brighter financial future with Finance Zen.";
  const heroHeadChars = splitStringUsingRegex(heroHeading);
  const heroTextChars = splitStringUsingRegex(heroText);

  const charVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const navigate = useNavigate();

  const handleClick = (e) =>{
    e.preventDefault()

    navigate("/login", {state: {alertMessage: null}})
  }

  return (
    <>
      <div className="bg-slate-100 px-2 py-4 md:min-h-[85vh] mx-20 my-5 rounded-2xl flex flex-col items-center justify-center gap-10">
        {/* Hero Section */}
        <div className="text-center flex flex-col items-center justify-center gap-10">
          <motion.h1
            className="lg:text-5xl text-3xl font-light"
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.05 }}
          >
            {heroHeadChars.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                variants={charVariants}
                transition={{ duration: 1 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="w-3/4 md:w-2/3 lg:w-1/2 leading-loose text-sm"
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.0085 }}
          >
            {heroTextChars.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                variants={charVariants}
                transition={{ duration: 1 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>

          <Link to={"/login"} onClick={(e)=> {handleClick}}><Button btnText="Get Started" /></Link>
        </div>
      </div>

      {/* Mockup Section */}

      <div className="mx-5 flex flex-col justify-center items-center mt-20 mb-20 gap-8">
        <h1 className="lg:text-4xl text-2xl font-light text-center md:text-3xl">
          See how our webpage looks on other devices!
        </h1>
        <img
          src={mockupImage}
          alt="Mockup Image"
          className="w-5/6 rounded-md lg:w-3/5"
        />
      </div>

      {/* Cards */}
      <div className="flex flex-col text-center">
        <h1 className="lg:text-4xl text-2xl font-light md:text-3xl -mb-12">
          What we offer
        </h1>

        <div className="flex flex-col lg:flex-row lg:justify-evenly justify-center ">

          {/* Card */}
            <Card/>
            <Card/>
            <Card/>

        </div>
      </div>
    </>
  );
}

export default Home;
