import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { RestaurantList } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { useFragment } from "../../gql";
import {
  MyRestaurantsQuery,
  MyRestaurantsQueryVariables,
  RestaurantPartsFragment,
} from "../../gql/graphql";

export const MY_RESTAURANTS_QUERY = gql`
  query MyRestaurants($input: MyRestaurantsInput!) {
    myRestaurants(input: $input) {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
      totalPages
      totalResult
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const [page, setPage] = useState(1);
  const { data } = useQuery<MyRestaurantsQuery, MyRestaurantsQueryVariables>(
    MY_RESTAURANTS_QUERY,
    {
      variables: { input: { page } },
    }
  );
  const totalPages = data?.myRestaurants.totalPages;
  const restaurantFragment = useFragment<RestaurantPartsFragment>(
    RESTAURANT_FRAGMENT,
    data?.myRestaurants.restaurants
  );
  return (
    <div>
      <Helmet>
        <title>MyRestaurants | Nuber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className="text-4xl font-semibold mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants.length >= 0 &&
        totalPages &&
        restaurantFragment ? (
          <div>
            <RestaurantList
              restaurants={restaurantFragment}
              page={page}
              totalPages={totalPages}
              setPageFunction={setPage}
            />
          </div>
        ) : (
          <div>
            <div className=" test-xl mb-5">No Restaurant here.</div>
            <Link className="link" to="/add-restaurant">
              Create One!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
