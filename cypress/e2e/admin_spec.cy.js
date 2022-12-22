describe("Admin test", () => {
  it("show list of programmers with correct search", () => {
    cy.login("karinhogenbirk93@gmail.com", "testtest");
    cy.get("[name=nameFind]").type("Karin");
    cy.get("[name=surnameFind]").type("Hogenbirk");
    cy.get("table").contains("Search").click();
    cy.get("table").contains("Karin");
  });
});

describe("Admin test", () => {
  it("can create new programmer by clicking create button", () => {
    cy.get("table").contains("Create").click();
    cy.get("[name=createModal]");
    cy.get("[name=nameCreate]").clear();
    cy.get("[name=surnameCreate]").clear();
    cy.get("[name=nameCreate]").type("Peter");
    cy.get("[name=surnameCreate]").type("Programmeur");
    cy.get("[name=projectCreate]").type("Veel testen");
    cy.get("[name=createModal]").contains("Create").click();
    cy.intercept("POST", "/auth/create", (req) => {
      expect(req.headers.Authorization).to.include("Bearer");
      req.reply({
        statusCode: 201,
        body: { message: "Programmer added! Thank you for the update." },
      });
    });
  });
});

//with database teardown:
describe("Admin test with database teardown", () => {
  afterEach(() => {
    cy.task("db:teardown");
    cy.task("db:seed");
  });

  it("can create new programmer by clicking create button", () => {
    cy.login("karinhogenbirk93@gmail.com", "testtest");
    cy.get("table").contains("Create").click();
    cy.get("[name=createModal]");
    cy.get("[name=nameCreate]").type("Karin");
    cy.get("[name=surnameCreate]").type("Programmeur");
    cy.get("[name=projectCreate]").type("Testing Cypress");
    cy.get("[name=createModal]").contains("Create").click();
    cy.get("h3").contains("Programmer added! Thank you for the update.");
  });
});
