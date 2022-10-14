import { Route, Routes } from "react-router-dom";
import { NotFound } from "../pages/404";
import { CreateAccount } from "../pages/create-account";
import { Login } from "../pages/login";

export const LoggedOutRouter = () => {
  return (
    <Routes>
      <Route>
        <Route path="/create-account" element={<CreateAccount />} />
      </Route>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
