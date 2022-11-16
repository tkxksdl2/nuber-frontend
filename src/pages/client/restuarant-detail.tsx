import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { useFragment } from "../../gql";
import {
  CreateOrderItemInput,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  DishPartsFragment,
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
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      error
      ok
      orderId
    }
  }
`;
type TRestaurantParams = {
  id: string;
};
export const RestaurantDetail = () => {
  const { id } = useParams() as TRestaurantParams;
  const navigate = useNavigate();
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
  const menu = useFragment<DishPartsFragment>(
    DISH_FRAGMENT,
    data?.restaurant.restaurant?.menu
  );

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [...current, { dishId, options: [] }]);
  };
  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };
  const addOptionsToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) return;
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((oldOption) => oldOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          ...current,
          { dishId, options: [...oldItem.options!, { name: optionName }] },
        ]);
      }
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) return;
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((oldOption) => oldOption.name === optionName)
      );
      if (hasOption) removeFromOrder(dishId);
      setOrderItems((current) => [
        ...current,
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
      ]);
    }
  };

  const triggerCancleOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const onCompleted = (data: CreateOrderMutation) => {
    if (data.createOrder.ok) {
      const {
        createOrder: { orderId },
      } = data;
      alert("Order Created");
      navigate(`/orders/${orderId}`);
    }
  };

  const [createOrderMuation, { loading: placingOrder }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION);

  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }
    const ok = window.confirm("You are about to confirm order.");
    if (ok) {
      createOrderMuation({
        variables: {
          input: {
            restaurantId: +id,
            items: orderItems,
          },
        },
        onCompleted,
      });
    }
  };
  return (
    <div>
      <div
        className="py-32 bg-center bg-cover bg-gray-800"
        style={{ backgroundImage: `url(${restaurant?.coverImage})` }}
      >
        <div className=" bg-white w-3/12 py-8 pl-3 xl:pl-40">
          <h4 className="text-3xl">{restaurant?.name}</h4>
          <h5 className="text-sm font-light">{restaurant?.category?.name}</h5>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>
      <div className="container flex flex-col items-end">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 m-1">
              Confirm Order
            </button>
            <button
              onClick={triggerCancleOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              Cancle Order
            </button>
          </div>
        )}
        {menu?.length === 0 ? (
          <h4 className=" test-xl mb-5">
            Restaurant is getting ready.. Please come later!
          </h4>
        ) : (
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-8 w-full">
            {menu?.map((dish, index) => (
              <Dish
                key={index}
                id={dish.id}
                name={dish.name}
                price={dish.price}
                description={dish.description}
                isCustomer={true}
                options={dish.options}
                orderStarted={orderStarted}
                addItemToOrder={addItemToOrder}
                removeFromOrder={removeFromOrder}
                isSelected={isSelected(dish.id)}
              >
                {dish.options?.map((option, index) => (
                  <DishOption
                    key={index}
                    isSelected={isOptionSelected(dish.id, option.name)}
                    name={option.name}
                    extra={option.extra}
                    dishId={dish.id}
                    addOptionsToItem={addOptionsToItem}
                    removeOptionFromItem={removeOptionFromItem}
                  />
                ))}
              </Dish>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
