// cypress/integration/login_spec.js

describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
})

  //log in using incorrect credentials
  it('Invalid login', () => {
    // Enter invalid username/email and password
    cy.get('#email').type('invalid_user');
    cy.get('#password').type('invalid_password');
    
    // Click the login button
    cy.get('#login-button').click();
    
    // Assert that the error message is displayed
    cy.get('#error_issue').should('be.visible').and('contain', 'Incorrect Credentials!');
  });

  it('Successful login', () => {
    // Enter valid username/email and password
    cy.get('#email').type('alice.johnson@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Assert that the login button is not visible
    cy.get('#login-button').should('not.exist');
  })

  
});
