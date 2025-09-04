import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as indexedDb from './indexedDb';
import { DateTime } from 'luxon';

// Provide a mutable fake DB that the mocked `openDB` will return.
let __fakeDb: any = null;
vi.mock('idb', () => ({
  openDB: async () => __fakeDb,
}));

const payload = {
  firstName: 'Bob',
  lastName: 'Jones',
  email: 'bob@example.com',
  phone: '91234568',
  gender: 'male' as const,
  dateOfBirth: DateTime.fromFormat('1985-05-05', 'yyyy-MM-dd').toJSDate(),
  joinedDate: DateTime.fromFormat('2019-05-05', 'yyyy-MM-dd').toJSDate(),
};

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
    const record = await indexedDb.addEmployee(payload);
    expect(record.id).toBeTruthy();
    const stored = await indexedDb.getEmployee(record.id);
    expect(stored).toEqual(record);
  });

  it('updates an existing employee', async () => {
    const added = await indexedDb.addEmployee(payload);
    const updated = await indexedDb.updateEmployee(added.id, {
      ...payload,
      phone: '99999999',
    });
    expect(updated.phone).toBe('99999999');
    const got = await indexedDb.getEmployee(added.id);
    if (!got) throw new Error('expected employee to exist');
    expect(got.phone).toBe('99999999');
  });

  it('throws when updating non-existent employee', async () => {
    await expect(
      indexedDb.updateEmployee('not-found', { ...payload, firstName: 'X' }),
    ).rejects.toThrow('Employee not found');
  });

  it('deletes an employee', async () => {
    const added = await indexedDb.addEmployee(payload);
    await indexedDb.deleteEmployee(added.id);
    const got = await indexedDb.getEmployee(added.id);
    expect(got).toBeNull();
  });

  it('lists all employees', async () => {
    await indexedDb.clearEmployees();
    const a = await indexedDb.addEmployee(payload);
    const b = await indexedDb.addEmployee({
      firstName: 'B',
      lastName: 'B',
      email: 'b@example.com',
      phone: '90000001',
      gender: 'other',
      dateOfBirth: DateTime.fromFormat('1991-02-02', 'yyyy-MM-dd').toJSDate(),
      joinedDate: DateTime.fromFormat('2022-02-02', 'yyyy-MM-dd').toJSDate(),
    });

    const all = await indexedDb.listEmployees();
    const ids = all.map((r) => r.id);
    expect(ids).toEqual(expect.arrayContaining([a.id, b.id]));
  });

  it('clears employees', async () => {
    await indexedDb.addEmployee(payload);
    await indexedDb.clearEmployees();
    const all = await indexedDb.listEmployees();
    expect(all).toHaveLength(0);
  });
});
