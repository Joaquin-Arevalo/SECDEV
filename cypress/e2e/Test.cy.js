// cypress/integration/login_spec.js


describe('forgot password', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
})

   // forgot password for no email found in database
   it('Forgot password (email not found on database)', () => {
  
    // Click the forgot password button
    cy.get('#login-form > :nth-child(2) > button').click();

    // enter valid username/email
    cy.get('#for-pas-email').type('notfoundemail');
    
    // Assert that the error message is displayed
    cy.get('#error_issue').should('be.visible').and('contain', 'Username is Required!');
  }); 
}); 


describe('error messages in login', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
})
   
 //login witoout email and password 
  it('login without username', () => {
    // Enter invalid username/email and password
    cy.get('#email').type('');
    cy.get('#password').type('');
    
    // Click the login button
    cy.get('#login-button').click();
    
    // Assert that the error message is displayed
    cy.get('#error_issue').should('be.visible').and('contain', 'Username is Required!');
  });

  //login witoout password 
  it('login without password', () => {
    // Enter invalid username/email and password
    cy.get('#email').type('invalid_user');
    cy.get('#password').type('');
    
    // Click the login button
    cy.get('#login-button').click();
    
    // Assert that the error message is displayed
    cy.get('#error_issue').should('be.visible').and('contain', 'Password is Required!');
  });
}); 

