import '@testing-library/cypress/add-commands';
import { DateTime } from 'luxon';
import { addEmployee, clearEmployees } from '../../src/lib/indexedDb';

const mockEmployee = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '91234567',
  gender: 'male' as const,
  dateOfBirth: DateTime.fromFormat('1990-01-01', 'yyyy-MM-dd').toJSDate(),
  joinedDate: DateTime.fromFormat('2020-01-01', 'yyyy-MM-dd').toJSDate(),
};

describe('App', () => {
  // clear the database every time
  beforeEach(() => {
    clearEmployees();
  });
  afterEach(() => {
    clearEmployees();
  });

  it('should show the employee in the list', () => {
    cy.visit('/');
    cy.contains('Employee Form').should('be.visible');
    addEmployee(mockEmployee);

    cy.get('.MuiDataGrid-virtualScrollerRenderZone')
      .find('.MuiDataGrid-row')
      .find('[data-field="firstName"]')
      .should('contain', mockEmployee.firstName);
  });

  it('should delete an employee', () => {
    cy.visit('/');
    addEmployee(mockEmployee);
    cy.get('.MuiDataGrid-virtualScrollerRenderZone')
      .children()
      .should('have.length', 1);

    cy.get('.MuiDataGrid-virtualScrollerRenderZone')
      .find('.MuiDataGrid-row')
      .find('[data-field="actions"]')
      .find('[title="Delete"]')
      .click();

    cy.findByTestId('delete-confirm-dialog').should('be.visible');
    cy.findByTestId('delete-employee-button').click();

    cy.get('.MuiDataGrid-virtualScrollerRenderZone')
      .children()
      .should('have.length', 0);
  });
});
