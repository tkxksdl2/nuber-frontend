import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { useFragment } from "../../gql";
import {
  DishPartsFragment,
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  RestaurantPartsFragment,
} from "../../gql/graphql";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

type IParams = {
  id: string;
};

export const MyRestaurant = () => {
  const { id } = useParams() as IParams;
  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    { variables: { input: { id: +id } } }
  );
  const restaurant = useFragment<RestaurantPartsFragment>(
    RESTAURANT_FRAGMENT,
    data?.myRestaurant.restaurant
  );
  const menu = useFragment<DishPartsFragment>(
    DISH_FRAGMENT,
    data?.myRestaurant.restaurant.menu
  );

  return (
    <div>
      <Helmet>
        <title>MyRestaurant | Nuber Eats</title>
      </Helmet>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${restaurant?.coverImage})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-semibold mb-10">
          {restaurant?.name || "Loading..."}
        </h2>
        <Link
          className="mr-8 text-white bg-gray-800 py-3 px-10"
          to={`/restaurant/${id}/add-dish`}
        >
          Add Dish &rarr;
        </Link>
        <Link className="text-white bg-emerald-700 py-3 px-10" to={``}>
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {menu?.length === 0 ? (
            <h4 className=" test-xl mb-5">Please upload a dish!</h4>
          ) : (
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-8">
              {menu?.map((dish) => (
                <Dish
                  name={dish.name}
                  price={dish.price}
                  description={dish.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
