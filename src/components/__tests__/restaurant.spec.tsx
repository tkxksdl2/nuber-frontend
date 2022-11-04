import { render, screen } from "../../test-utils";
import React from "react";
import { Restaurant, RestaurantList } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";
import { RestaurantPartsFragment } from "../../gql/graphql";
describe("<Restaurant />", () => {
  const restaurantProps = {
    id: "1",
    coverImage: "x",
    restaurantName: "test-res",
    categoryName: "test-cate",
  };
  it("renders OK with props", () => {
    render(<Restaurant {...restaurantProps} />);
    screen.getByText(restaurantProps.restaurantName);
    screen.getByText(restaurantProps.categoryName);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/restaurant/${restaurantProps.id}`
    );
  });
});

describe("<RestaurantList />", () => {
  const setPage = jest.fn(() => {});
  const restaurants: RestaurantPartsFragment[] = [
    {
      __typename: "Restaurant",
      id: 1,
      coverImage: "x",
      name: "test-res",
      address: "",
      isPromoted: false,
      category: {
        name: "test-cate",
        __typename: "Category",
      },
      " $fragmentName": "RestaurantPartsFragment",
    },
  ];
  const restaurantListProps = {
    restaurants,
    page: 1,
    totalPages: 1,
    setPageFunction: setPage,
  };
  it("renders OK with props", () => {
    render(<RestaurantList {...restaurantListProps} />);
  });
});
