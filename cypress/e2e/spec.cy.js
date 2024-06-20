// cypress/integration/login_spec.js

describe('Login Page', () => {

  //log in using incorrect credentials
  it('should display an error message for invalid login', () => {
    // Visit the login page
    cy.visit('http://localhost:3000');
    
    // Enter invalid username/email and password
    cy.get('#email').type('invalid_user');
    cy.get('#password').type('invalid_password');
    
    // Click the login button
    cy.get('#login-button').click();
    
    // Assert that the error message is displayed
    cy.get('#error_issue').should('be.visible').and('contain', 'Incorrect Credentials!');
  });

  
});
