import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constant";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/nuber-logo.svg";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <React.Fragment>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="py-6">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={nuberLogo} className="w-24" alt="nuber-eats" />
          </Link>
          {/* temporal logout button for test */}
          <span className="text-xs">
            <button
              className="font-bold text-gray-700 mx-5"
              onClick={() => {
                localStorage.removeItem(LOCALSTORAGE_TOKEN);
                authToken(null);
                isLoggedInVar(false);
              }}
            >
              logout
            </button>
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="mx-2" />
              {data?.me.email}
            </Link>
          </span>
        </div>
      </header>
    </React.Fragment>
  );
};
