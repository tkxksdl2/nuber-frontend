import { render, waitFor, screen } from "../../test-utils";
import { createMockClient } from "mock-apollo-client";
import React from "react";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import { ApolloProvider } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../gql/graphql";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useNavigate: () => {
      return mockedNavigate;
    },
  };
});

describe("<CreateAccount />", () => {
  const mockedClient = createMockClient();
  const setup = () => {
    render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>
    );
  };
  beforeEach(() => {
    setup();
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toEqual("CreateAccount | Nuber Eats");
    });
  });

  it("renders validation error", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const buttonSubmit = screen.getByRole("button");
    const user = userEvent.setup();

    await user.type(email, "won't work");
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Please enter a valid Email/i
      );
    });
    await user.clear(email);
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Email is required/i);
    });
    await user.type(email, "working@gmail.com");
    await user.click(buttonSubmit);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Password is required/i
      );
    });
    await user.type(password, "12");
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Password length must be more than 4/i
      );
    });
  });

  it("submits mutations with form values", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const buttonSubmit = screen.getByRole("button");
    const user = userEvent.setup();
    const MUTATION_ERROR = "mutation-error";
    const formData = {
      email: "working@gmail.com",
      password: "1234",
      role: UserRole.Client,
    };
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: MUTATION_ERROR,
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    await user.type(email, formData.email);
    await user.type(password, formData.password);
    await user.click(buttonSubmit);
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
    expect(mockedNavigate).toHaveBeenCalledWith("/", { replace: true });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(MUTATION_ERROR);
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
