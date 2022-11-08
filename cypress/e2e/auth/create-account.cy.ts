import { TEST_EMAIL, TEST_PASSWORD } from "../../test-constants";

describe("Create Account", () => {
  it("should see email / password validation errors", () => {
    cy.visit("/");
    cy.findByText(/create an account/i).click();
    const email = cy.findByPlaceholderText(/email/i).type("bad@email").blur();
    cy.findByRole("alert").should("have.text", "Please enter a valid Email");
    email.clear().blur();
    cy.findByRole("alert").should("have.text", "Email is required");

    email.type("tksxksdl2@test.com");
    const password = cy
      .findByPlaceholderText(/password/i)
      .type("12")
      .blur();
    cy.findByRole("alert").should(
      "have.text",
      "Password length must be more than 4"
    );
    password.clear().blur();
    cy.findByRole("alert").should("have.text", "Password is required");
  });
  it("should be able to create account and login", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName === "CreateAccount") {
        req.reply((res) => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });
    cy.visit("/create-account");

    cy.findByPlaceholderText(/email/i).type(TEST_EMAIL);
    cy.findByPlaceholderText(/password/i)
      .type("1234")
      .blur();
    cy.findByRole("button").click();

    cy.wait(1000);

    cy.login(TEST_EMAIL, TEST_PASSWORD);
  });
});
