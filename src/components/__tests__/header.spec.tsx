import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "../../test-utils";
import React from "react";
import { Header } from "../header";
import { BrowserRouter as Router } from "react-router-dom";
import { ME_QUERY } from "../../hooks/useMe";
import { authToken, isLoggedInVar } from "../../apollo";

describe("<Header />", () => {
  it("renders without verify banner", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "test@email",
                  role: "Client",
                  verified: true,
                },
              },
            },
          },
        ]}
      >
        <Header />
      </MockedProvider>
    );
    expect(
      await screen.findByText("Please verify your email")
    ).toBeInTheDocument(); //loading.
    await waitFor(() =>
      expect(screen.queryByText("Please verify your email")).toBeNull()
    );
  });

  it("renders with verify banner", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "test@email",
                  role: "Client",
                  verified: false,
                },
              },
            },
          },
        ]}
      >
        <Header />
      </MockedProvider>
    );
    expect(
      await screen.findByText("Please verify your email")
    ).toBeInTheDocument();
    screen.getByText("Please verify your email");
  });

  it("should logout if click logout", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "test@email",
                  role: "Client",
                  verified: true,
                },
              },
            },
          },
        ]}
      >
        <Header />
      </MockedProvider>
    );
    await waitFor(() =>
      expect(screen.queryByText("Please verify your email")).toBeNull()
    );
    fireEvent.click(screen.getByText("logout"));
    expect(authToken()).toEqual(null);
    expect(isLoggedInVar()).toEqual(false);
  });
});
