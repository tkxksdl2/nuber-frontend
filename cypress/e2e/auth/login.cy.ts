import { TEST_EMAIL, TEST_PASSWORD } from "../../test-constants";

describe("First Test", () => {
  it("should see homepage", () => {
    cy.visit("/").title().should("eq", "Login | Nuber Eats");
  });
  it("can see email / password validation errors", () => {
    cy.visit("/");
    const email = cy.findByPlaceholderText(/email/i).type("bad email").blur();
    const password = cy.findByPlaceholderText(/password/i);
    cy.findByRole("alert").should("have.text", "Please enter a valid Email");

    email.clear().blur();
    cy.findByRole("alert").should("have.text", "Email is required");

    email.type("test@email.com");
    password.type("12").blur();
    cy.findByRole("alert").should(
      "have.text",
      "Password length must be more than 4"
    );

    password.clear().blur();
    cy.findByRole("alert").should("have.text", "Password is required");
  });
  it("can fill out form and login", () => {
    cy.login(TEST_EMAIL, TEST_PASSWORD);
  });
});
