describe('App', () => {
  it('shows the heading', () => {
    // First ping the base URL to avoid flakiness if the dev server is still starting.
    // Increase timeout for slow machines or cold starts.
    cy.request({ url: '/', timeout: 60000 }).then(() => {
      cy.visit('/', { timeout: 60000 });
      cy.contains('Employee Form', { timeout: 60000 }).should('be.visible');
    });
  });
});
