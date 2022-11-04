import { ApolloProvider } from "@apollo/client";
import { render, RenderResult, waitFor, screen } from "../../test-utils";
import { createMockClient } from "mock-apollo-client";
import React from "react";
import { Login, LOGIN_MUTATION } from "../login";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  const mockedClient = createMockClient();
  const setup = () => {
    renderResult = render(
      <ApolloProvider client={mockedClient}>
        <Login />
      </ApolloProvider>
    );
  };

  beforeEach(async () => {
    setup();
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toEqual("Login | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { debug } = renderResult;
    const user = userEvent.setup();
    const email = screen.getByPlaceholderText(/email/i);

    // formMode가 onblur이기 때문에 클릭해주어야 formError가 렌더링됨
    await user.type(email, "this@wont");
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /please enter a valid Email/i
      );
    });

    await user.clear(email);
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Email is required/i);
    });
  });

  it("display pasword required errors", async () => {
    const user = userEvent.setup();
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole("button");

    await user.type(email, "this@gmail.com");
    await user.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Password is required/i
      );
    });

    await user.type(password, "12");
    await user.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Password length must be more than 4/i
      );
    });
  });

  it("submits form and calls mutation", async () => {
    const user = userEvent.setup();
    const formData = {
      email: "real@test.com",
      password: "1234",
    };
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole("button");

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    await user.type(email, formData.email);
    await user.type(password, formData.password);
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledWith({
        loginInput: {
          email: formData.email,
          password: formData.password,
        },
      });
    });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("mutation-error");
    });
  });
});
