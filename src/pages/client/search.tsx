import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { RestaurantList } from "../../components/restaurant";
import { SearchBar } from "../../components/search-bar";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { useFragment } from "../../gql";
import {
  RestaurantPartsFragment,
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../gql/graphql";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResult
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const [page, setPage] = useState(1);
  const [searchBy, setSeachedBy] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [queryReadyToFetch, { data, loading }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return navigate("/", { replace: true });
    }
    queryReadyToFetch({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
    setSeachedBy(query);
  }, [page, location]);
  useEffect(() => {
    setPage(1);
  }, [location]);
  const matchedRestaurants = useFragment<RestaurantPartsFragment>(
    RESTAURANT_FRAGMENT,
    data?.searchRestaurant.restaurants
  );
  const totalPages = data?.searchRestaurant.totalPages;
  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <SearchBar />
      <div className=" pt-7 pb-4 px-5 text-gray-800 font-semibold text-xl">
        Searched by {searchBy}
      </div>
      {!loading && matchedRestaurants && totalPages ? (
        <div className="container">
          <RestaurantList
            restaurants={matchedRestaurants}
            page={page}
            setPageFunction={setPage}
            totalPages={totalPages}
          />
        </div>
      ) : (
        <div className="py-32 flex flex-col justify-center items-center text-gray-600 font-semibold">
          <h2>Oops, There's no matched restaurants</h2>
          <h3 className="mb-10">How about these categories below?</h3>
        </div>
      )}
    </div>
  );
};
