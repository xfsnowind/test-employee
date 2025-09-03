import '@testing-library/cypress/add-commands';
import { DateTime } from 'luxon';

describe('Add Employee Drawer', () => {
  it('can add a new employee via the drawer', () => {
    // Ping base to avoid timing flake, then visit
    cy.request({ url: '/', timeout: 60000 }).then(() => {
      cy.visit('/', { timeout: 60000 });

      // Open the add drawer
      cy.contains('button', 'Add Employee').should('be.visible').click();

      // Drawer should be present with role dialog and title
      cy.findByTestId('AddEmployeeDrawer')
        .should('exist')
        .within(() => {
          cy.contains('Add Employee').should('be.visible');

          // Fill text fields
          cy.get('label').contains('First name').parent().find('input').type('Thomas');
          cy.get('label').contains('Last name').parent().find('input').type('Anderson');
          cy.get('label')
            .contains('Email')
            .parent()
            .find('input')
            .type('neo@example.test');
          cy.get('label').contains('Phone').parent().find('input').type('94567890');

          // Select gender radio (male is default, but ensure)
          cy.get('input[type="radio"]').check('male');

          // For date pickers, type into the text input the ISO date
          const dob = DateTime.fromFormat('1990-01-01', 'yyyy-MM-dd');
          const joined = DateTime.fromFormat('2020-06-15', 'yyyy-MM-dd');
          console.log(joined.toFormat('ddMMyyyy'));
          cy.get('label')
            .contains('Date of Birth')
            .parent()
            .find('.MuiPickersSectionList-root')
            .type(dob.toFormat('MMddyyyy'));
          cy.get('label')
            .contains('Joined Date')
            .parent()
            .find('.MuiPickersSectionList-root')
            .type(joined.toFormat('MMddyyyy'));

          // Submit
          cy.contains('button', 'Submit').click();
        });

      // After submit the drawer should close (dialog gone)
      cy.get('[role="dialog"]').should('not.exist');

      // The data grid should eventually contain a row with the email we added
      cy.contains('neo@example.test', { timeout: 5000 }).should('be.visible');
    });
  });
});
