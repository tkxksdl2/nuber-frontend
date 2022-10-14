import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import { Header } from "../components/header";

import { useMe } from "../hooks/useMe";
import { Restaurants } from "../pages/client/restaurant";

const ClientRoutes = [<Route key={0} path="/" element={<Restaurants />} />];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  console.log(data, loading, error);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wider">Loading..</span>
      </div>
    );
  }

  const onClick = () => {
    isLoggedInVar(false);
  };

  return (
    <React.Fragment>
      <Header />
      <Routes>
        {data.me.role === "Client" && ClientRoutes}
        <Route key={1} path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Fragment>
  );
};
