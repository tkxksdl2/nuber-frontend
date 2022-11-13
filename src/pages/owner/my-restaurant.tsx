import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import {
  DISH_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragment";
import { useFragment } from "../../gql";
import {
  DishPartsFragment,
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
  OrderPartsFragment,
  RestaurantPartsFragment,
} from "../../gql/graphql";
import {
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
} from "victory";

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
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
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
  const orders = useFragment<OrderPartsFragment>(
    ORDERS_FRAGMENT,
    data?.myRestaurant.restaurant.orders
  );
  console.log(orders);
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
              {menu?.map((dish, index) => (
                <Dish
                  key={index}
                  name={dish.name}
                  price={dish.price}
                  description={dish.description}
                />
              ))}
            </div>
          )}
          <div className="mt-20 mb-10">
            <h4 className="text-center text-2xl font-medium">sales</h4>
            <VictoryChart
              domainPadding={{ y: 50 }}
              padding={{ left: 100, top: 50, bottom: 50, right: 50 }}
              height={400}
              width={window.innerWidth}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `￦ ${datum.y / 10000}M`}
                labelComponent={<VictoryTooltip renderInPortal dy={-20} />}
                data={orders?.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 3,
                  },
                }}
              />
              <VictoryAxis
                style={{
                  tickLabels: { fontSize: 20, fill: "#4D7C0F" },
                }}
                dependentAxis
                tickFormat={(tick) => `￦ ${tick / 10000}M`}
              />
              <VictoryAxis
                style={{
                  tickLabels: { fontSize: 20 },
                }}
                label="Days"
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
