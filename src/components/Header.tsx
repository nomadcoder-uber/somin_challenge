import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="cursor-pointer border-b-2 border-gray-600 font-bold text-gray-300 w-full p-4 bg-gray-800 flex justify-between">
      <div>For You</div>
      <div>News</div>
      <div>Culture</div>
      <div>Education</div>
      <div>Business</div>

      <div>
        <Link to="/logout">log out</Link>
      </div>
    </div>
  );
};
