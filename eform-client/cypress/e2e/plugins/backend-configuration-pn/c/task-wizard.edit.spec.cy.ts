import loginPage from '../../../Login.page';
import backendConfigurationPropertiesPage from '../BackendConfigurationProperties.page';
import {PropertyCreateUpdate} from '../../../../../e2e/Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import backendConfigurationPropertyWorkersPage, {PropertyWorker} from '../BackendConfigurationPropertyWorkers.page';
import {
  selectValueInNgSelector,
  generateRandmString,
  selectValueInNgSelectorNoSelector, selectDateOnNewDatePicker
} from 'cypress/e2e/helper-functions';

const property: PropertyCreateUpdate = {
  name: generateRandmString(5),
  chrNumber: generateRandmString(5),
  address: generateRandmString(5),
  cvrNumber: '1111111',
};
const property2: PropertyCreateUpdate = {
  name: generateRandmString(5),
  chrNumber: generateRandmString(5),
  address: generateRandmString(5),
  cvrNumber: '1111111',
};

const workerForCreate: PropertyWorker = {
  name: generateRandmString(5),
  surname: generateRandmString(5),
  language: 'Dansk',
  properties: [property.name, property2.name],
};

const task = {
  property: property.name,
  translations: [
    generateRandmString(12),
    generateRandmString(12),
    generateRandmString(12),
  ],
  eformName: '00. Info boks',
  startFrom: {
    year: 2023,
    month: 7,
    day: 21
  },
  repeatType: 'Dag',
  repeatEvery: '2',
};

const editedTask = {
  property: property2.name,
  translations: [
    generateRandmString(12),
    generateRandmString(12),
    generateRandmString(12),
  ],
  eformName: '00. Arbejdstid',
  startFrom: {
    year: 2022,
    month: 6,
    day: 24
  },
  repeatType: 'Uge',
  repeatEvery: '5',
};

describe('Area rules type 1', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  it('should create task', () => {
    backendConfigurationPropertiesPage.goToProperties();
    backendConfigurationPropertiesPage.createProperty(property);
    backendConfigurationPropertiesPage.createProperty(property2);
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    backendConfigurationPropertyWorkersPage.create(workerForCreate);
    backendConfigurationPropertiesPage.goToProperties();
    for (let i = 0; i < 2; i++) {
      const propertyEl = backendConfigurationPropertiesPage.getRowObjectByNum(i);
      propertyEl.goToAreas();
      propertyEl.bindAreasByName(['00. Logbøger'], false, true);
    }
    cy.get('#backend-configuration-pn-task-wizard').click();
    cy.wait(3000);
    cy.get('#createNewTaskBtn').should('be.enabled').click();
    cy.wait(500);
    // fill and create task
    cy.get('#createProperty').click();
    selectValueInNgSelectorNoSelector(`${property.cvrNumber} - ${property.chrNumber} - ${property.name}`);
    cy.wait(500);
    cy.get('#createFolder').click({force: true});
    cy.wait(500);
    cy.get('.mat-tree-node > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click();
    cy.wait(500);
    cy.get('.d-flex > #folderTreeName').click();
    cy.wait(500);
    for (let i = 0; i < task.translations.length; i++) {
      cy.get(`#createName${i}`).type(task.translations[i]);
    }
    selectValueInNgSelector('#createTemplateSelector', task.eformName, true);
    cy.get('#createStartFrom').click();
    selectDateOnNewDatePicker(task.startFrom.year, task.startFrom.month, task.startFrom.day);
    selectValueInNgSelector('#createRepeatType', task.repeatType, true);
    cy.get('#createRepeatEvery').should('be.visible').find('input').should('be.visible').clear().type(task.repeatEvery);
    cy.get(`.ng-option`).first().should('have.text', task.repeatEvery).should('be.visible').click();
    cy.get('mat-checkbox#checkboxCreateAssignment0').click();
    cy.get('#createTaskBtn').click();
    cy.wait(500);
    // check table
    cy.get('.cdk-row').should('have.length', 1);
    cy.get('.cdk-row .cdk-column-property span').should('have.text', task.property);
    cy.get('.cdk-row .cdk-column-folder span').should('have.text', '00. Logbøger');
    cy.get('.cdk-row .cdk-column-taskName span').should('have.text', task.translations[0]);
    cy.get('.cdk-row .cdk-column-eform span').should('have.text', task.eformName);
    cy.get('.cdk-row .cdk-column-startDate span')
      .should('have.text', `${task.startFrom.day}.${task.startFrom.month >= 10 ? '' : '0'}${task.startFrom.month}.${task.startFrom.year}`);
    cy.get('.cdk-row .cdk-column-repeat span').should('have.text', `${task.repeatEvery} ${task.repeatType}`);
    cy.get('.cdk-row .cdk-column-status span').should('have.text', 'Aktiv');
    cy.get('.cdk-row .cdk-column-assignedTo span').should('have.text', `${workerForCreate.name} ${workerForCreate.surname}`);
    // edit task
    cy.get('#advanced').click();
    cy.get('#folders').click();
    cy.contains(property2.name)
      .parent() // div
      .parent() // mat-tree-node
      .find('button')
      .last()
      .click();
    cy.get('#createFolderChildBtn').click();
    const newFolderName = generateRandmString(10);
    cy.get('#createFolderNameTranslation_0').type(newFolderName);
    cy.get('#folderSaveBtn').click();
    cy.wait(500);
    cy.get('#backend-configuration-pn-task-wizard').click();
    cy.get('.cdk-row .cdk-column-actions .editBtn').first().click();
    // change task
    cy.get('#updateProperty').click();
    selectValueInNgSelectorNoSelector(`${property2.cvrNumber} - ${property2.chrNumber} - ${property2.name}`);
    cy.wait(500);
    cy.get('#updateFolder').click({force: true});
    cy.wait(500);
    cy.get('.mat-tree-node > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click();
    cy.wait(500);
    cy.contains('#folderTreeName', newFolderName).click();
    cy.wait(500);
    for (let i = 0; i < editedTask.translations.length; i++) {
      cy.get(`#updateName${i}`).clear().type(editedTask.translations[i]);
    }
    selectValueInNgSelector('#updateTemplateSelector', editedTask.eformName, true);
    cy.get('#updateStartFrom').click();
    selectDateOnNewDatePicker(editedTask.startFrom.year, editedTask.startFrom.month, editedTask.startFrom.day);
    selectValueInNgSelector('#updateRepeatType', editedTask.repeatType, true);
    cy.get('#updateRepeatEvery').should('be.visible').find('input').should('be.visible').clear().type(editedTask.repeatEvery);
    cy.get(`.ng-option`).first().should('have.text', editedTask.repeatEvery).should('be.visible').click();
    cy.get('mat-checkbox#checkboxUpdateAssignment0').click();
    cy.get('#updateTaskBtn').click();
    cy.wait(500);
    // check table
    cy.get('.cdk-row').should('have.length', 1);
    cy.get('.cdk-row .cdk-column-property span').should('have.text', editedTask.property);
    cy.get('.cdk-row .cdk-column-folder span').should('have.text', newFolderName);
    cy.get('.cdk-row .cdk-column-taskName span').should('have.text', editedTask.translations[0]);
    cy.get('.cdk-row .cdk-column-eform span').should('have.text', editedTask.eformName);
    cy.get('.cdk-row .cdk-column-startDate span')
      .should('have.text', `${editedTask.startFrom.day}.${editedTask.startFrom.month >= 10 ? '' : '0'}${editedTask.startFrom.month}.${editedTask.startFrom.year}`);
    cy.get('.cdk-row .cdk-column-repeat span').should('have.text', `${editedTask.repeatEvery} ${editedTask.repeatType}`);
    cy.get('.cdk-row .cdk-column-status span').should('have.text', 'Aktiv');
    cy.get('.cdk-row .cdk-column-assignedTo span').should('have.text', `${workerForCreate.name} ${workerForCreate.surname}`);
  });
  after(() => {
    backendConfigurationPropertiesPage.goToProperties();
    cy.wait(500);
    backendConfigurationPropertiesPage.clearTable();
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    backendConfigurationPropertyWorkersPage.clearTable();
  });
});