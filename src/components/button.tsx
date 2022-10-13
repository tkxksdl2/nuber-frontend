import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => {
  return (
    <button
      className={`p-3 font-medium text-white  transition-colors
    ${
      canClick
        ? "bg-emerald-400 hover:bg-emerald-700 focus:outline-none"
        : "bg-gray-300 pointer-events-none"
    }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};
