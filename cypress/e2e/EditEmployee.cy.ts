import { UnsavedChangesMessage } from '../../src/lib/employee.constants';
import { addEmployee, clearEmployees } from '../../src/lib/indexedDb';
import { mockEmployee, mockEmployee2 } from './constants';

describe('Edit Employee Drawer', () => {
  beforeEach(() => {
    // First, add an employee to edit
    addEmployee(mockEmployee);
  });

  afterEach(() => {
    // Clear the database
    clearEmployees();
  });

  it('can open edit drawer and display existing employee data', () => {
    cy.visit('/');
    // Find the row with our test employee and click edit
    cy.contains(mockEmployee.email)
      .parent()
      .within(() => {
        cy.get('button[aria-label="edit"]').click();
      });

    // Edit drawer should be present
    cy.findByTestId('EditEmployeeDrawer')
      .should('exist')
      .within(() => {
        cy.contains('Edit Employee').should('be.visible');

        // Verify existing data is loaded
        cy.findByTestId('firstName-input')
          .find('input')
          .should('have.value', mockEmployee.firstName);
        cy.findByTestId('lastName-input')
          .find('input')
          .should('have.value', mockEmployee.lastName);
        cy.findByTestId('email-input')
          .find('input')
          .should('have.value', mockEmployee.email);
        cy.findByTestId('phone-input')
          .find('input')
          .should('have.value', mockEmployee.phone);

        // Verify gender is selected
        cy.get(`input[type="radio"][value="${mockEmployee.gender}"]`).should(
          'be.checked',
        );
      });
  });

  it('can edit and update employee information', () => {
    cy.visit('/');
    // Find the row with our test employee and click edit
    cy.contains(mockEmployee.email)
      .parent()
      .within(() => {
        cy.get('button[aria-label="edit"]').click();
      });

    // Edit the employee data
    cy.findByTestId('EditEmployeeDrawer')
      .should('exist')
      .within(() => {
        // Update first name
        cy.findByTestId('firstName-input')
          .find('input')
          .clear()
          .type(mockEmployee2.firstName);

        // Update last name
        cy.findByTestId('lastName-input')
          .find('input')
          .clear()
          .type(mockEmployee2.lastName);

        // Update email
        cy.findByTestId('email-input').find('input').clear().type(mockEmployee2.email);

        // Update phone
        cy.findByTestId('phone-input').find('input').clear().type(mockEmployee2.phone);

        // Change gender
        cy.get(`input[type="radio"][value="${mockEmployee2.gender}"]`).check();

        // Submit the changes
        cy.findByTestId('submit-employee-button').click();
      });

    // After submit the drawer should close
    cy.findByTestId('EditEmployeeDrawer').should('not.exist');

    // The data grid should contain the updated information
    cy.contains(mockEmployee2.email).should('be.visible');
    cy.contains(mockEmployee2.firstName).should('be.visible');
    cy.contains(mockEmployee2.lastName).should('be.visible');
    cy.contains(mockEmployee2.phone).should('be.visible');

    // Original email should no longer exist
    cy.contains(mockEmployee.email).should('not.exist');
  });

  it('validates form fields during edit', () => {
    cy.visit('/');
    // Find the row with our test employee and click edit
    cy.contains(mockEmployee.email)
      .parent()
      .within(() => {
        cy.get('button[aria-label="edit"]').click();
      });

    // Test validation by entering invalid data
    cy.findByTestId('EditEmployeeDrawer')
      .should('exist')
      .within(() => {
        // Clear first name (should trigger validation)
        cy.findByTestId('firstName-input').find('input').clear();

        // Enter invalid email
        cy.findByTestId('email-input').find('input').clear().type('invalid-email');

        // Enter invalid phone
        cy.findByTestId('phone-input').find('input').clear().type('123');

        // Try to submit
        cy.findByTestId('submit-employee-button').click();

        // Should see validation errors
        cy.contains('First name must be at least').should('be.visible');
        cy.contains('Invalid email address').should('be.visible');
        cy.contains('Invalid Singapore phone number').should('be.visible');
      });
  });

  it('shows unsaved changes warning when trying to cancel with modifications', () => {
    cy.visit('/');
    // Find the row with our test employee and click edit
    cy.contains(mockEmployee.email)
      .parent()
      .within(() => {
        cy.get('button[aria-label="edit"]').click();
      });

    const newUnsavedText = 'Changed';

    // Make some changes to the form
    cy.findByTestId('EditEmployeeDrawer').should('exist');

    // Update first name to trigger dirty state
    cy.findByTestId('firstName-input').find('input').clear().type(newUnsavedText);

    // Try to cancel - should show confirmation dialog
    cy.findByTestId('cancel-employee-button').click();

    // Should see the confirmation dialog
    cy.findByTestId('confirm-dialog-message')
      .contains(UnsavedChangesMessage)
      .should('be.visible');
    // Click "Stay" to remain on the form
    cy.findByTestId('confirm-dialog-cancel-button').click();

    // Should still be in the drawer with the modified value
    cy.findByTestId('firstName-input')
      .find('input')
      .should('have.value', newUnsavedText);

    // Now try canceling again and confirm
    cy.findByTestId('EditEmployeeDrawer').should('exist');

    // Try to cancel again
    cy.findByTestId('cancel-employee-button').click();

    // Should see the confirmation dialog again
    cy.findByTestId('confirm-dialog-message')
      .contains(UnsavedChangesMessage)
      .should('be.visible');

    // Click "OK" to close the form
    cy.findByTestId('confirm-dialog-confirm-button').click();

    // After confirming, the drawer should close
    cy.findByTestId('EditEmployeeDrawer').should('not.exist');

    // The original data should still be there (no changes saved)
    cy.contains(mockEmployee.email).should('be.visible');
    cy.contains(mockEmployee.firstName).should('be.visible');
    cy.contains(newUnsavedText).should('not.exist');
  });

  it('not shows unsaved changes warning when value is same with the default value', () => {
    cy.visit('/');
    // Find the row with our test employee and click edit
    cy.contains(mockEmployee.email)
      .parent()
      .within(() => {
        cy.get('button[aria-label="edit"]').click();
      });

    cy.findByTestId('EditEmployeeDrawer').should('exist');

    // type the same first name
    cy.findByTestId('firstName-input')
      .find('input')
      .clear()
      .type(mockEmployee.firstName);

    // Try to cancel - should show confirmation dialog
    cy.findByTestId('cancel-employee-button').click();

    // Should not see the confirmation dialog
    cy.findByTestId('EditEmployeeDrawer').should('not.exist');
    cy.findByTestId('confirm-dialog-message').should('not.exist');

    // The original data should still be there (no changes saved)
    cy.contains(mockEmployee.email).should('be.visible');
    cy.contains(mockEmployee.firstName).should('be.visible');
  });
});
