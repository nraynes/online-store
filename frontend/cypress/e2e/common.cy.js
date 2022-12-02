/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Common page tests', () => {
  Cypress.Cookies.defaults({
    preserve: ['accessToken', 'refreshToken'],
  });
  
  it('Should have a top bar.', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid="login-button"]')
      .should('exist');

    cy.get('[data-testid="app-title"]')
      .should('exist');

    cy.get('[data-testid="top-bar"]')
      .should('exist');
  });

  it('Should have a landing page.', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid="launch-pad-background"]')
      .should('exist');
  });

  it('Should have a title, description, and image.', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid="launch-pad-text-title"]')
      .should('exist');

    cy.get('[data-testid="launch-pad-text-description"]')
      .should('exist');

    cy.get('[data-testid="launch-pad-image"]')
      .should('exist');
  });

  it('Should have a button that brings you to the catalog.', () => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-testid="launch-pad-button"]')
      .should('exist');

    cy.get('[data-testid="launch-pad-button"]')
      .click();

    cy.url().should((url) => {
      expect(url).to.equal('http://localhost:3000/catalog');
    });
  });

});