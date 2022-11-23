import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "../components/header";
import { UserRole } from "../gql/graphql";

import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Category } from "../pages/client/category";
import { Restaurants } from "../pages/client/restaurants";
import { RestaurantDetail } from "../pages/client/restuarant-detail";
import { Search } from "../pages/client/search";
import { Dashboard } from "../pages/driver/dashboard";
import { AddDish } from "../pages/owner/add-dish";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Order } from "../pages/user/order";

const clientRoutes = [
  {
    path: "/",
    element: <Restaurants />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/category/:slug",
    element: <Category />,
  },
  {
    path: "/restaurant/:id",
    element: <RestaurantDetail />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    element: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    element: <EditProfile />,
  },
  {
    path: "/orders/:orderId",
    element: <Order />,
  },
];

const restaurantRoutes = [
  { path: "/", element: <MyRestaurants /> },
  { path: "/add-restaurant", element: <AddRestaurant /> },
  { path: "/restaurant/:id", element: <MyRestaurant /> },
  { path: "/restaurant/:restaurantId/add-dish", element: <AddDish /> },
];

const driverRoutes = [{ path: "/", element: <Dashboard /> }];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wider">Loading..</span>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Header />
      <Routes>
        {data?.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {data?.me.role === UserRole.Owner &&
          restaurantRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {data?.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route key={0} path="*" element={<NotFound />} />
      </Routes>
    </React.Fragment>
  );
};
