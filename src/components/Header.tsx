import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="w-full p-4 bg-red-100 flex justify-between">
      <div>Header</div>
      <div>
        <Link to="/logout">log out</Link>
      </div>
    </div>
  );
};
