import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Categories } from "../../components/categories";
import { RestaurantList } from "../../components/restaurant";
import { SearchBar } from "../../components/search-bar";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { useFragment } from "../../gql";
import {
  CategoryPartsFragment,
  RestaurantPartsFragment,
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../gql/graphql";

const RESTAURANT_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResult
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  const restaurantFragment = useFragment<RestaurantPartsFragment>(
    RESTAURANT_FRAGMENT,
    data?.restaurants.results
  );
  const categoryFragment = useFragment<CategoryPartsFragment>(
    CATEGORY_FRAGMENT,
    data?.allCategories.categories
  );
  const totalPages = data?.restaurants.totalPages;
  return (
    <div>
      <Helmet>
        <title>Restaurants | Nuber Eats</title>
      </Helmet>
      <SearchBar />
      {!loading && restaurantFragment && categoryFragment && totalPages && (
        <div className="container">
          <Categories categories={categoryFragment} />
          <RestaurantList
            restaurants={restaurantFragment}
            page={page}
            totalPages={totalPages}
            setPageFunction={setPage}
          />
        </div>
      )}
    </div>
  );
};
