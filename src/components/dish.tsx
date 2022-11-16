import React from "react";

export type DishOptions = Array<{
  __typename?: "DishOption";
  name: string;
  extra?: number | null;
  choices?: Array<{
    __typename?: "DishChoice";
    name: string;
    extra?: number | null;
  }> | null;
}> | null;

interface IDishProps {
  id?: number;
  name: string;
  price: number;
  description: string;
  isCustomer?: boolean;
  options?: DishOptions;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  isSelected?: boolean;
  children?: React.ReactNode;
}

export const Dish: React.FC<IDishProps> = ({
  id,
  name,
  price,
  description,
  isCustomer = false,
  options,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
  isSelected,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted && id) {
      if (!isSelected && addItemToOrder) {
        addItemToOrder(id);
      } else if (isSelected && removeFromOrder) {
        removeFromOrder(id);
      }
    }
  };

  return (
    <div
      className={`px-8 pt-3 pb-8 border hover:border-gray-800 transition-all ${
        isSelected ? " border-2 border-gray-800" : "cursor-pointer"
      }`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {name}
          {orderStarted && (
            <button className="ml-3" onClick={onClick}>
              {isSelected ? "Remove from Order" : "Select"}
            </button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>￦ {price}</span>
      {isCustomer && options && options.length !== 0 && (
        <div>
          <h5 className="my-2 font-semibold">Dish Options:</h5>
          {dishOptions}
        </div>
      )}
    </div>
  );
};
