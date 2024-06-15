import React from "react";
import mockupImage from "../assets/mockup.jpg"
function Card() {
  return (
    <div className="mx-16 my-8 lg:m-12 lg:py-10 h-auto lg:space-y-16 lg:flex lg:flex-col lg:content-between p-5 border-none shadow-xl rounded-xl lg:w-96 lg:hover:scale-105 lg:ease-in-out lg:duration-300">
      <div>
        <img src={mockupImage} alt="Card Image 1" />
      </div>
      {/* Card Content */}
      <div className="gap-3 flex flex-col mt-3">
        <h1 className="text-xl lg:text-2xl font-medium">We offer this</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis velit
          expedita incidunt illum, minima minus fuga ex sed reiciendis
          necessitatibus.
        </p>
      </div>
    </div>
  );
}

export default Card;
