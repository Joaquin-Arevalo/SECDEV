// cypress/integration/login_spec.js

describe('Login testing', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
})

  it('Successful login (employee)', () => {
    // Enter valid username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Assert that the login button is not visible
    cy.get('#login-button').should('not.exist');
    cy.get('#time').should('be.visible');
  })

  it('Successful login (Admin)', () => {
    // Enter valid username/email and password
    cy.get('#email').type('jane.smith@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Assert that the login button is not visible
    cy.get('#login-button').should('not.exist');
    cy.get('#time').should('be.visible');
  })

  it('Successful logout', () => {
    // Enter valid username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the logout button
    cy.get('h2 > a').click();      

    // Assert that the login button is not visible
    cy.get('h2 > a').should('not.exist');
    cy.get('#login-button').should('be.visible');
  })
});
