import { openDB, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { EmployeeFormValues } from './employee.constants';

export type Employee = EmployeeFormValues & { id: string };

// Define the DB schema
type EmployeeDB = {
  employees: {
    key: string; // uuid
    value: Employee;
    indexes: { id: string };
  };
};

const DB_NAME = 'employee-db';
const DB_VERSION = 1;

async function getDb() {
  return openDB<EmployeeDB>(DB_NAME, DB_VERSION, {
    upgrade(db: IDBPDatabase<EmployeeDB>) {
      if (!db.objectStoreNames.contains('employees')) {
        const store = db.createObjectStore('employees', { keyPath: 'id' });
        store.createIndex('id', 'id', { unique: true });
      }
    },
  });
}

export async function addEmployee(employee: EmployeeFormValues) {
  const db = await getDb();
  const id = uuidv4();
  const record = { ...employee, id };
  console.log('before added employee');
  try {
    await db.add('employees', record);
  } catch (e) {
    console.log('error adding employee', e);
    throw new Error('Failed to add employee');
  }
  return record;
}

export async function updateEmployee(id: string, patch: EmployeeFormValues) {
  const db = await getDb();
  const existing = await db.get('employees', id);
  if (!existing) throw new Error('Employee not found');
  const updated = { ...existing, ...patch, id };
  await db.put('employees', updated);
  return updated;
}

export async function deleteEmployee(id: string) {
  const db = await getDb();
  await db.delete('employees', id);
}

export async function getEmployee(id: string) {
  const db = await getDb();
  return db.get('employees', id);
}

export async function listEmployees() {
  const db = await getDb();
  return db.getAll('employees');
}

export async function clearEmployees() {
  const db = await getDb();
  const tx = db.transaction('employees', 'readwrite');
  await tx.objectStore('employees').clear();
  await tx.done;
}
