/// <reference types="cypress" />

//const { post } = require("cypress/types/jquery");

describe('example to-do app',{ testIsolation: false }, () => {

  it('Intercept displays two todo items by default', () => {
    cy.visit('https://reqres.in/');
    cy.intercept('GET','users?page=2', {
      response: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }],status: 200,}).as('posts')
    cy.get("[data-id=users]").click()
    cy.wait('@posts');
  })

  it('Intercept by Url', () => {
    cy.visit('https://reqres.in/');
    cy.intercept('https://reqres.in/api/users/').as('posts')
    cy.get("[data-id=users]").click()
    cy.wait('@posts').its('response.body.data').should('have.length', 6)
  })
  it('Intercept by use pattern-matching to match URLs', () => {
    cy.visit('https://reqres.in/');
    cy.intercept('/api/users/').as('posts')
    cy.get("[data-id=users]").click()
    cy.wait('@posts').its('response.body.data').should('have.length', 6)
  })
  
  it('Intercept by regular expression', () => {
    cy.visit('https://reqres.in/');
    cy.intercept('/\/api/users?page=2').as('posts')
    cy.get("[data-id=users]").click()
    cy.wait('@posts').its('response.body.data').should('have.length', 6)
  })
  it('Intercept by matching GET method', () => {
    cy.visit('https://reqres.in/');
    cy.intercept('GET','api/users?page=2').as('posts')
    cy.get("[data-id=users]").click()
    cy.wait('@posts').its('response.body.data').should('have.length', 6)
  })
  it('Intercept by matching POST method', () => {
    cy.visit('https://reqres.in/');
    cy.intercept('POST', 'api/users', (req) => {
      req.reply({
        status: 200,
        body: {
          "name": "John",
          "job": "QA Manager",
      }
      })
    }).as('updateuser')
    cy.get("[data-id=post]").click()
    cy.wait('@updateuser')
  })

  it('Intercept by RouteMatcher ', () => {
    cy.visit('https://reqres.in/')
    cy.intercept('GET', 'https://reqres.in/api/users', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: [
            { id: 7, email: 'kailash.bluth@reqres.in', first_name: 'George', last_name: 'Bluth' },
            { id: 8, email: 'pathak.weaver@reqres.in', first_name: 'Janet', last_name: 'Weaver' },
            { id: 9, email: 'harry.wong@reqres.in', first_name: 'Emma', last_name: 'Wong' }
          ]
        }
      });
    }).as('postdata')
    cy.wait('@postdata')
  })
  it('Intercept by RouteMatcher ', () => {
    cy.visit('https://reqres.in/')
    cy.intercept({
      method: 'GET',
      url: 'https://reqres.in/api/users/**'
    }, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: [{
            id: 7,
            email: 'tim.Bluth@reqres.in',
            first_name: 'tim',
            last_name: 'Bluth',
            avatar: 'https://reqres.in/img/faces/1-image.jpg'}, {
              id: 8,
              email: 'janet.weaver@reqres.in',
              first_name: 'Janet',
              last_name: 'Weaver',
              avatar: 'https://reqres.in/img/faces/2-image.jpg'
            }
          ]
        }
      })
    }).as('postdata')
    cy.wait('@postdata').its('response.body.data').should('have.length', 2)
  })
  it('Intercept by Pattern Matching using glob matching ', () => {
    cy.visit('https://reqres.in/')
    cy.intercept({
      method: '+(GET|PATCH)',
      url: '**/users/**'
    }, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: [{
            id: 7,
            email: 'kim.smith@reqres.in',
            first_name: 'Kim',
            last_name: 'Smith',
            avatar: 'https://reqres.in/img/faces/1-image.jpg'}, {
              id: 8,
              email: 'janet.weaver@reqres.in',
              first_name: 'Janet',
              last_name: 'Weaver',
              avatar: 'https://reqres.in/img/faces/2-image.jpg'
            }
          ]
        }
      })
    }).as('postdata')
    cy.wait('@postdata').its('response.body.data').should('have.length', 2)
  })
  it('Stubbing a response With a string', () => {
    cy.visit('https://reqres.in/')
    cy.intercept('GET', '**/users/**', {
      statusCode: 200,
      body: 'Hello, world!'
    }).as('getUsers')
    cy.wait('@getUsers')
    cy.get('@getUsers').then((interception) => {
      expect(interception.response.body).to.equal('Hello, world!')
    })
  })
  it('Stubbing a response With Fixture file', () => {
    cy.visit('https://reqres.in/')
    cy.intercept('GET', 'https://reqres.in/api/users?page=2', { fixture: 'users.json' })
    .as('getUsers')

  cy.visit('https://reqres.in/')
  cy.wait('@getUsers').its('response.body').should('have.length', 2)
  })
  it('Intercepts and modifies a GET request', () => {
    cy.visit('https://reqres.in/')
    cy.intercept('GET', '**/api/users/**', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: [
            {
              id: 1,
              email: 'david.bluth@reqres.in',
              first_name: 'david',
              last_name: 'Bluth',
              avatar: 'https://reqres.in/img/faces/1-image.jpg',
            },
            {
              id: 2,
              email: 'janet.weaver@reqres.in',
              first_name: 'Janet',
              last_name: 'Weaver',
              avatar: 'https://reqres.in/img/faces/2-image.jpg',
            },
            {
              id: 3,
              email: 'emma.wong@reqres.in',
              first_name: 'Emma',
              last_name: 'Wong',
              avatar: 'https://reqres.in/img/faces/3-image.jpg',
            },
          ],
        },
      });
    }).as('postData')
    cy.wait('@postData')
    
    // Make a request to the API endpoint
    cy.request('https://reqres.in/api/users/').then((response) => {
      // Assert that the response contains the expected data
      expect(response.body.data).to.have.lengthOf(3);
      expect(response.body.data[0].email).to.equal('george.bluth@reqres.in');
    });
  });
})
describe('Intercepting Requests and Changing Headers', () => {
  it('Intercept a request and modify headers', () => {
    cy.visit('https://reqres.in');
    cy.intercept('GET', 'https://reqres.in/api/users', (req) => {
      req.headers['Authorization'] = 'Bearer my-token';
    }).as('getUserList');
    //cy.visit('https://reqres.in/api/users');
    cy.wait('@getUserList')
    cy.get('@getUserList').then((interception) => {
      const requestHeaders = interception.request.headers;
      expect(requestHeaders).to.have.property('Authorization', 'Bearer my-token');
    });
  });
});
describe.only('Override an existing intercept example', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://reqres.in/api/users').as('getUsers')
  })

  it('overrides the response of the /api/users request', () => {
    cy.visit('https://reqres.in/')
    cy.intercept('GET', 'https://reqres.in/api/users', (req) => {
      req.reply((res) => {
        res.send({
          data: [{ id: 1, email: 'test@test.com' }],
          page: 1,
          per_page: 1,
          total: 1,
          total_pages: 1
        })
      })
    }).as('getUsers')

    cy.wait('@getUsers').then((interception) => {
      expect(interception.response.body.data).to.have.length(1)
      expect(interception.response.body.data[0].email).to.eq('test@test.com')
    })
  })
})
