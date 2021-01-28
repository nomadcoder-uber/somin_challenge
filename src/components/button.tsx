import React from "react";

interface IButtonProps {
  isValid: boolean;
  loading: boolean;
  text: string;
  onClick?: () => void;
}

export const Button: React.FC<IButtonProps> = ({
  isValid,
  loading,
  text,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`text-gray-200 py-3 bg-gray-500 ${
      isValid && !loading ? "bg-gray-200" : "bg-gray-200 pointer-events-none"
    }`}
    disabled={loading ? true : false}
  >
    {loading ? "Loading..." : text}
  </button>
);
