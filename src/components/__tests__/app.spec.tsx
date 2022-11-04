import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { isLoggedInVar } from "../../apollo";
import { App } from "../app";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span data-testid="is-logged-in">logged-out</span>,
  };
});
jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span data-testid="is-logged-in">logged-in</span>,
  };
});

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    render(<App />);
    screen.getByText("logged-out");
  });

  it("renders LoggedInRouter", async () => {
    render(<App />);
    isLoggedInVar(true);
    await waitFor(() => {
      expect(screen.getByTestId("is-logged-in")).toHaveTextContent(
        "loggded-in"
      );
    });
  });
});
