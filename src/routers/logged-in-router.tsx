import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "../components/header";

import { useMe } from "../hooks/useMe";
import { Restaurants } from "../pages/client/restaurant";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

const ClientRoutes = [
  <Route key={1} path="/" element={<Restaurants />} />,
  <Route key={2} path="/confirm" element={<ConfirmEmail />} />,
  <Route key={3} path="/edit-profile" element={<EditProfile />} />,
];

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
        {data?.me.role === "Client" && ClientRoutes}
        <Route key={0} path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Fragment>
  );
};
