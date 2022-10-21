import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Categories } from "../../components/categories";
import { RestaurantList } from "../../components/restaurant";
import { SearchBar } from "../../components/search-bar";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { useFragment } from "../../gql";
import {
  CategoryPartsFragment,
  CategoryQuery,
  CategoryQueryVariables,
  RestaurantPartsFragment,
} from "../../gql/graphql";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    category(input: $input) {
      ok
      error
      totalPages
      totalResult
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
  const [page, setPage] = useState(1);
  const { slug } = useParams<"slug">();
  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    { variables: { input: { page, slug: slug + "" } } }
  );

  const restaurants = useFragment<RestaurantPartsFragment>(
    RESTAURANT_FRAGMENT,
    data?.category.restaurants
  );
  const categoryFragment = useFragment<CategoryPartsFragment>(
    CATEGORY_FRAGMENT,
    data?.allCategories.categories
  );
  const totalPages = data?.category.totalPages;

  return (
    <div>
      <SearchBar />
      <div className=" pt-7 pb-4 px-5 text-gray-800 font-semibold text-xl">
        Restaurants Category {slug}
      </div>
      {!loading && restaurants && totalPages ? (
        <div className="container">
          <RestaurantList
            restaurants={restaurants}
            page={page}
            setPageFunction={setPage}
            totalPages={totalPages}
          />
        </div>
      ) : (
        <div className="py-32 flex flex-col justify-center items-center text-gray-600 font-semibold">
          <h2>Oops, There's no restaurant in this category!</h2>
          <h3 className="mb-10">How about these categories below?</h3>
          <Categories categories={categoryFragment!} />
        </div>
      )}
    </div>
  );
};
