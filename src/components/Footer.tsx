import {
  faAlignJustify,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
export const Footer = () => {
  return (
    <div className="text-2xl px-14 cursor-pointer border-b-2 border-gray-600 font-bold text-gray-300 w-full p-4 bg-gray-800 flex justify-between ">
      <div>
        <FontAwesomeIcon icon={faHome} className="cursor-pointer ml-4" />
        <h1>Home</h1>
      </div>
      <div>
        <FontAwesomeIcon icon={faSearch} className="cursor-pointer ml-6" />
        <h1>Explore</h1>
      </div>
      <div>
        <FontAwesomeIcon
          icon={faAlignJustify}
          className="cursor-pointer ml-7"
        />
        <h1>Activity</h1>
      </div>
    </div>
  );
};
