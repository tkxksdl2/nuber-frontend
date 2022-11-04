import React from "react";
import { Link } from "react-router-dom";
import { RestaurantPartsFragment } from "../gql/graphql";

interface IRestaurantProp {
  id: string;
  coverImage: string;
  restaurantName: string;
  categoryName?: string;
}

interface IRestaurantListProp {
  restaurants: readonly RestaurantPartsFragment[];
  page: number;
  totalPages: number;
  setPageFunction: React.Dispatch<React.SetStateAction<number>>;
}

export const Restaurant: React.FC<IRestaurantProp> = ({
  id,
  coverImage,
  restaurantName,
  categoryName,
}) => {
  return (
    <Link to={`/restaurant/${id}`}>
      <div className="flex flex-col text-gray-800">
        <div
          className="bg-cover bg-center py-28"
          style={{ backgroundImage: `url(${coverImage})` }}
        ></div>
        <h3 className="text-xl mt-3 mb-1 font-bold">{restaurantName}</h3>
        <span className="pt-1 border-t-2 font-semibold text-xs opacity-70 border-gray-400">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};

export const RestaurantList: React.FC<IRestaurantListProp> = ({
  restaurants,
  page,
  totalPages,
  setPageFunction: setPage,
}) => {
  const onNextPageClick = () => {
    setPage((current) => (current += 1));
  };
  const onPrevPageClick = () => {
    setPage((current) => (current -= 1));
  };
  if (restaurants) {
    return (
      <>
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-8">
          {restaurants.map((restaurant) => (
            <Restaurant
              key={restaurant.id}
              id={restaurant.id + ""}
              coverImage={restaurant.coverImage}
              restaurantName={restaurant.name}
              categoryName={restaurant.category?.name}
            />
          ))}
        </div>
        <div className="flex justify-center items-center font-bold text-gray-800">
          {page > 1 && (
            <button
              onClick={onPrevPageClick}
              className="focust-outline-none text-2xl"
            >
              &larr;
            </button>
          )}
          <span className="mx-2">
            Page {page} of {totalPages}
          </span>
          {page !== totalPages && (
            <button
              onClick={onNextPageClick}
              className="focust-outline-none text-2xl"
            >
              &rarr;
            </button>
          )}
        </div>
      </>
    );
  }
  return <></>;
};
