import '@testing-library/cypress/add-commands';
import { DateTime } from 'luxon';
import { mockEmployee } from './constants';

describe('Add Employee Drawer', () => {
  it('can add a new employee via the drawer', () => {
    // Ping base to avoid timing flake, then visit
    cy.request({ url: '/' }).then(() => {
      cy.visit('/');

      // Open the add drawer
      cy.contains('button', 'Add Employee').should('be.visible').click();

      // Drawer should be present with role dialog and title
      cy.findByTestId('AddEmployeeDrawer')
        .should('exist')
        .within(() => {
          cy.contains('Add Employee').should('be.visible');

          // Fill text fields
          cy.findByTestId('firstName-input').find('input').type(mockEmployee.firstName);
          cy.findByTestId('lastName-input').find('input').type(mockEmployee.lastName);
          cy.findByTestId('email-input').find('input').type(mockEmployee.email);
          cy.findByTestId('phone-input').find('input').type(mockEmployee.phone);

          // Select gender radio (male is default, but ensure)
          cy.get('input[type="radio"]').check(mockEmployee.gender);

          // For date pickers, type into the text input the ISO date
          const dob = DateTime.fromJSDate(mockEmployee.dateOfBirth);
          const joined = DateTime.fromJSDate(mockEmployee.joinedDate);
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
      cy.findByTestId('AddEmployeeDrawer').should('not.exist');

      // The data grid should eventually contain a row with the email we added
      cy.contains(mockEmployee.email).should('be.visible');
    });
  });
});
