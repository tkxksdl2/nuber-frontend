import React from "react";

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  dishId: number;
  addOptionsToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  dishId,
  addOptionsToItem,
  removeOptionFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionsToItem(dishId, name);
    }
  };
  return (
    <span
      onClick={onClick}
      className={`flex border items-center ${
        isSelected ? "border-gray-800" : ""
      }`}
    >
      <h6 className="ml-2">{name}</h6>
      {extra && <h6 className="text-sm ml-2"> (￦ {extra})</h6>}
    </span>
  );
};
