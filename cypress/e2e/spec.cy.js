// cypress/integration/login_spec.js

describe('Login testing', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
})

 /*  //login witoout email and password 
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
  }); */

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

  /* // forgot password for no email found in database
  it('Forgot password (email not found on database)', () => {
  
    // Click the login button
    cy.get('#login-form > :nth-child(2) > button').click();

    // enter valid username/email
    cy.get('#for-pas-email').type('notfoundemail');
    
    // Assert that the error message is displayed
    cy.get('#error_issue').should('contain', 'email not found! Register first');
  }); */

  // forgot password correct email
  it('Forgot password (email found on database)', () => {
  
    // Click the login button
    cy.get('#login-form > :nth-child(2) > button').click();

    // enter valid username/email
    cy.get('#for-pas-email').type('john.doe@example.com');
    
    // Assert that the error message is displayed
    cy.get('#forgot-password-form').should('not.exist');
  });

  it('Successful login (Work from Home)', () => {
    // Enter valid username/email and password
    cy.get('#email').type('alice.johnson@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Assert that the login button is not visible
    cy.get('#login-button').should('not.exist');
    cy.get('#time').should('be.visible');
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


describe('User Story #3', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })
  it('Current Week', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();       

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 
    // Assert that the Weekly Pay is visible
    cy.get('[style="width:45%"] > h2').should('be.visible');
  })

  it('Last Week', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();       

    // select Last Week
    cy.get('#emp-dropdown-week-id').select('Last Week'); 
    // Assert that the Weekly Pay is visible
    cy.get('[style="width:45%"] > h2').should('be.visible');
  })

  it('2 Weeks Ago', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();       

    // select 2 Weeks Ago
    cy.get('#emp-dropdown-week-id').select('2 Weeks Ago'); 
    // Assert that the Weekly Pay is visible
    cy.get('[style="width:45%"] > h2').should('be.visible');
  })
});


describe('User Story #4', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('Late Arrival Hours Column is visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();       

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 

    // Assert that the Late Arrivals is visible
    for (let i = 1; i <= 8; i++) {
      cy.get(`:nth-child(${i}) > :nth-child(11)`).should('be.visible');
    }  
  })

  it('Late Arrival Deduction Column is visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();    

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 

    // Assert that the Late Arrivals is visible
    for (let i = 1; i <= 8; i++) {
      cy.get(`:nth-child(${i}) > :nth-child(11)`).should('be.visible');
    }  
  })

  it('Total Deductions is visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();       

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 

    // Assert that the Total Deduction is visible
    cy.get('.num-input-1 > :nth-child(3)').should('be.visible');
  })
});


describe('User Story #5', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('Overtime Hours Column is visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();   

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 

    // Assert that the Overtime Hours column is visible
    for (let i = 1; i <= 8; i++) {
      cy.get(`:nth-child(${i}) > :nth-child(9)`).should('be.visible');
    }  
  })

  it('Compensation Column is visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();     

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 

    // Assert that the Compensation column is visible
    for (let i = 1; i <= 8; i++) {
      cy.get(`:nth-child(${i}) > :nth-child(10)`).should('be.visible');
    }  
  })
  
  it('Total Compensation (Additional) is visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();    

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 

    // Assert that the Total Deduction is visible
    cy.get('.num-input-1 > :nth-child(1)').should('be.visible');
  })
});


describe('User Story #7', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('Holiday  visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 
  })
})


describe('User Story #9', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('Export Button is visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    
    // Click the login button
    cy.get('#login-button').click();

    // Click the employee dashboard button
    cy.get(':nth-child(2) > p > a').click();    

    // select current Week
    cy.get('#emp-dropdown-week-id').select('Current Week'); 

    cy.get('.exportBtn > button').should('be.visible');
  })
})


describe('User Story #11', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('Total Tax Deduction is visible', () => {
    // Enter employee username/email and password
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
  
    // Click the login button
    cy.get('#login-button').click();

    // Click the Tax Deduction dashboard button
    cy.get(':nth-child(3) > p > a').click();    

    // Assert that the Weekly Pay is visible
    cy.get('[style="width:45%"] > h2').should('not.exist');
  })
})