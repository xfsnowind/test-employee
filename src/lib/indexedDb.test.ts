import { beforeEach, describe, expect, it, vi } from 'vitest';

// Provide a mutable fake DB that the mocked `openDB` will return.
let __fakeDb: any = null;
vi.mock('idb', () => ({
  openDB: async () => __fakeDb,
}));

import * as indexedDb from './indexedDb';

describe('indexedDb helpers', () => {
  let store: Map<string, any>;
  let db: any;

  beforeEach(() => {
    store = new Map();

    db = {
      add: async (_storeName: string, record: any) => {
        store.set(record.id, record);
        return record.id;
      },
      get: async (_storeName: string, key: string) => {
        return store.get(key) ?? null;
      },
      put: async (_storeName: string, record: any) => {
        store.set(record.id, record);
        return record.id;
      },
      delete: async (_storeName: string, key: string) => {
        store.delete(key);
      },
      getAll: async (_storeName: string) => {
        return Array.from(store.values());
      },
      transaction: (_storeName: string, _mode: string) => {
        return {
          objectStore: (_: string) => ({
            clear: async () => store.clear(),
          }),
          done: Promise.resolve(),
        };
      },
    };

    // set the module mock's fake DB
    __fakeDb = db;
  });

  it('adds and returns a new employee with generated id', async () => {
    const payload = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phone: '91234567',
      gender: 'female',
      dateOfBirth: '1990-01-01',
      joinedDate: '2020-01-01',
    };

    const record = await indexedDb.addEmployee(payload as any);
    expect(record.id).toBeTruthy();
    const stored = await indexedDb.getEmployee(record.id);
    expect(stored).toEqual(record);
  });

  it('updates an existing employee', async () => {
    const payload = {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      phone: '91234568',
      gender: 'male',
      dateOfBirth: '1985-05-05',
      joinedDate: '2019-05-05',
    };

    const added = await indexedDb.addEmployee(payload as any);
    const updated = await indexedDb.updateEmployee(added.id, {
      phone: '99999999',
    });
    expect(updated.phone).toBe('99999999');
    const got = await indexedDb.getEmployee(added.id);
    if (!got) throw new Error('expected employee to exist');
    expect(got.phone).toBe('99999999');
  });

  it('throws when updating non-existent employee', async () => {
    await expect(
      indexedDb.updateEmployee('not-found', { firstName: 'X' }),
    ).rejects.toThrow('Employee not found');
  });

  it('deletes an employee', async () => {
    const payload = {
      firstName: 'Carol',
      lastName: 'Lee',
      email: 'carol@example.com',
      phone: '91234569',
      gender: 'female',
      dateOfBirth: '1992-02-02',
      joinedDate: '2021-02-02',
    };

    const added = await indexedDb.addEmployee(payload as any);
    await indexedDb.deleteEmployee(added.id);
    const got = await indexedDb.getEmployee(added.id);
    expect(got).toBeNull();
  });

  it('lists all employees', async () => {
    await indexedDb.clearEmployees();
    const a = await indexedDb.addEmployee({
      firstName: 'A',
      lastName: 'A',
      email: 'a@example.com',
      phone: '90000000',
      gender: 'other',
      dateOfBirth: '1991-01-01',
      joinedDate: '2022-01-01',
    } as any);
    const b = await indexedDb.addEmployee({
      firstName: 'B',
      lastName: 'B',
      email: 'b@example.com',
      phone: '90000001',
      gender: 'other',
      dateOfBirth: '1991-02-02',
      joinedDate: '2022-02-02',
    } as any);

    const all = await indexedDb.listEmployees();
    const ids = all.map((r: any) => r.id);
    expect(ids).toEqual(expect.arrayContaining([a.id, b.id]));
  });

  it('clears employees', async () => {
    await indexedDb.addEmployee({
      firstName: 'Z',
      lastName: 'Z',
      email: 'z@example.com',
      phone: '90000002',
      gender: 'other',
      dateOfBirth: '1993-03-03',
      joinedDate: '2023-03-03',
    } as any);
    await indexedDb.clearEmployees();
    const all = await indexedDb.listEmployees();
    expect(all).toHaveLength(0);
  });
});
