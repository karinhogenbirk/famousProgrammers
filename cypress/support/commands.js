// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (email, password) => {
  cy.visit("http://localhost:4000/admin.html");
  cy.contains("Admin page");
  cy.contains("Login to your account").click();
  cy.url().should("include", "login.html");
  cy.get("[name=email]").type(email);
  cy.get("[name=password").type(password);
  cy.get("form").contains("Log in").click();
  cy.url().should("include", "admin.html");
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
