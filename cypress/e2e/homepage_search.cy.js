describe("Homepage test", () => {
  it("Shows the homepage", () => {
    cy.visit("http://localhost:4000/");
    cy.contains("PROGRAMMERS' QUIZ");
  });

  it("Shows dropdown menu when you click on Options", () => {
    cy.visit("http://localhost:4000/");
    cy.contains("Options").click();
    cy.get(".dropdown-content").should("be.visible");
  });

  it("Takes you to login page", () => {
    cy.visit("http://localhost:4000/");
  });

  it("Starts the quiz", () => {
    cy.visit("http://localhost:4000/");
    cy.contains("Start the quiz").click();
    cy.url().should("include", "quiz.html");
  });
});
