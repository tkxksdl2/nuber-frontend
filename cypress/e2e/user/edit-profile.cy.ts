import { TEST_EMAIL, TEST_PASSWORD } from "../../test-constants";

describe("Edit Profile", () => {
  beforeEach(() => {
    cy.login(TEST_EMAIL, TEST_PASSWORD);
    cy.get('a[href="/edit-profile"]').click();
  });

  it("can go to /edit-profile using the header", () => {
    cy.title().should("eq", "Edit Profile | Nuber Eats");
  });

  it("can change email", () => {
    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.email = TEST_EMAIL;
      }
    });
    cy.findByPlaceholderText(/email/i).clear().type("changed@mail.com").blur();
    cy.findByText(/update/i).click();
  });
});
