import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { useFragment } from "../../gql";
import {
  RestaurantDetailQuery,
  RestaurantDetailQueryVariables,
  RestaurantPartsFragment,
} from "../../gql/graphql";

const RESTAURANT_DETAIL_QUERY = gql`
  query restaurantDetail($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;
type TRestaurantParams = {
  id: string;
};
export const RestaurantDetail = () => {
  const { id } = useParams() as TRestaurantParams;
  const { data } = useQuery<
    RestaurantDetailQuery,
    RestaurantDetailQueryVariables
  >(RESTAURANT_DETAIL_QUERY, {
    variables: { input: { restaurantId: +id } },
  });
  const restaurant = useFragment<RestaurantPartsFragment>(
    RESTAURANT_FRAGMENT,
    data?.restaurant.restaurant
  );
  return (
    <div>
      <div
        className="py-32 bg-center bg-cover bg-gray-800"
        style={{ backgroundImage: `url(${restaurant?.coverImage})` }}
      >
        <div className=" bg-white w-3/12 py-8 pl-3 lg:pl-40">
          <h4 className="text-3xl">{restaurant?.name}</h4>
          <h5 className="text-sm font-light">{restaurant?.category?.name}</h5>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>
    </div>
  );
};
