beforeEach(() => {
  cy.visit("/src/index.html");
});

describe("Central de Atendimento ao Cliente TAT", () => {
  it("verifica o título da aplicação", () => {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", () => {
    const longText = Cypress._.repeat("Obrigado ", 30);
    cy.get("#firstName").type("Alan");
    cy.get("#lastName").type("Rodrigues");
    cy.get("#email").type("alannrodrigues@gmail.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('button[type="submit"]').click();

    cy.get(".success").should("be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    const longText = Cypress._.repeat("Obrigado ", 30);
    cy.get("#firstName").type("Alan");
    cy.get("#lastName").type("Rodrigues Silveira");
    cy.get("#email").type("alannrodrigues@gmail,com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('button[type="submit"]').click();

    cy.get(".error").should("be.visible");
  });

  it("campo telefone continua vázio quando preenchido com valor não-numérico", () => {
    cy.get("#phone").type("abcd").should("have.value", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    const longText = Cypress._.repeat("Obrigado ", 30);
    cy.get("#firstName").type("Alan");
    cy.get("#lastName").type("Rodrigues");
    cy.get("#email").type("alannrodrigues@gmail.com");
    cy.get("#phone-checkbox").click();
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('button[type="submit"]').click();

    cy.get(".error").should("be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    const longText = Cypress._.repeat("Obrigado ", 30);
    cy.get("#firstName").type("Alan");
    cy.get("#firstName").should("have.value", "Alan");
    cy.get("#firstName").clear();
    cy.get("#firstName").should("have.value", "");

    cy.get("#lastName").type("Rodrigues");
    cy.get("#lastName").should("have.value", "Rodrigues");
    cy.get("#lastName").clear();
    cy.get("#lastName").should("have.value", "");

    cy.get("#email").type("alannrodrigues@gmail.com");
    cy.get("#email").should("have.value", "alannrodrigues@gmail.com");
    cy.get("#email").clear();
    cy.get("#email").should("have.value", "");

    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get("#open-text-area").should("have.value", longText);
    cy.get("#open-text-area").clear();
    cy.get("#open-text-area").should("have.value", "");

    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  /*  it.only("envia o formuário com sucesso usando um comando customizado", () => {
    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success").should("be.visible");
  }); */

  it("envia o formuário com sucesso usando um comando customizado passando objeto", () => {
    /* const data = {
      firstName: "Alan",
      lastName: "Rodrigues Silveira",
      email: "alannrodrigues@gmail.com",
      text: "Teste.",
    }; */

    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success").should("be.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it("marca o tipo de atendimento 'Feedback' ", () => {
    cy.get('input[type="radio"][value="feedback"] ')
      .check()
      .should("be.checked");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"] ').each((typeOfService) => {
      cy.wrap(typeOfService).check().should("be.checked");
    });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]').check().should("be.checked");
    cy.get('input[type="checkbox"]').last().uncheck().should("not.be.checked");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório", () => {
    const data = {
      firstName: "Alan",
      lastName: "Rodrigues Silveira",
      email: "alannrodrigues@gmail.com",
      text: "Teste 3",
      telefone: true,
    };
    cy.fillMandatoryFieldsAndSubmit(data);

    cy.get(".error").should("be.visible");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .selectFile("cypress/fixtures/example.json")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });
  it("seleciona um arquivo utilizando simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.contains("a", "Política de Privacidade")
      .should("have.attr", "target", "_blank")
      .and("have.attr", "href", "privacy.html");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.contains("a", "Política de Privacidade")
      .invoke("removeAttr", "target")
      .click();
    cy.contains("h1", "CAC TAT - Política de Privacidade").should("be.visible");
  });
});
