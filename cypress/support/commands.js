Cypress.Commands.add(
  "fillMandatoryFieldsAndSubmit",
  (
    data = {
      firstName: "Jeisianne",
      lastName: "Mara Andrade",
      email: "jeisiannemara@hotmail.com",
      text: "Teste 2",
      telefone: false,
    }
  ) => {
    cy.get("#firstName").type(data.firstName);
    cy.get("#lastName").type(data.lastName);
    cy.get("#email").type(data.email);
    if (data.telefone) {
      cy.get("#phone-checkbox").check();
    }
    cy.get("#open-text-area").type(data.text);
    cy.contains("button", "Enviar").click();
  }
);
