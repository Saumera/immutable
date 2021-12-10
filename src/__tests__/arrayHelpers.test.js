import { toObject, groupBy } from '../arrayHelpers';

const testData = [
  {
    id: 1,
    name: 'Joe Shmoe',
    employeeData: { groupId: 33, alias: 'Butterfingers' },
    status: 'active',
  },
  {
    id: 2,
    name: 'Jane Doe',
    employeeData: { groupId: 40, alias: 'The Governess' },
    status: 'active',
  },
  {
    id: 3,
    name: 'Fred Marks',
    employeeData: { groupId: 33, alias: 'Sir Criesalot' },
    status: 'active',
  },
  {
    id: 4,
    name: 'Nick Coronado',
    employeeData: { groupId: 33, alias: 'Tornado' },
    status: 'active',
  },
  {
    id: 5,
    name: 'Firstname Lastname',
    employeeData: { groupId: 33, alias: 'The Nameless' },
    status: 'inactive',
  },
];

describe('Array methods', () => {
  describe('toObject', () => {
    it('should create an object using key string', () => {
      const obj = toObject(testData, 'id');
      expect(obj[1]).toBe(testData[0]);
      expect(obj[2]).toBe(testData[1]);
      expect(obj[3]).toBe(testData[2]);
      expect(obj[4]).toBe(testData[3]);
      expect(obj[5]).toBe(testData[4]);
    });

    it('should create an object using key function', () => {
      const obj = toObject(testData, item => item.employeeData.alias);
      expect(obj['Butterfingers']).toBe(testData[0]);
      expect(obj['The Governess']).toBe(testData[1]);
      expect(obj['Sir Criesalot']).toBe(testData[2]);
      expect(obj['Tornado']).toBe(testData[3]);
      expect(obj['The Nameless']).toBe(testData[4]);
    });

    it('should create an object using key string and value string', () => {
      const obj = toObject(testData, 'id', 'name');
      expect(obj[1]).toBe('Joe Shmoe');
      expect(obj[2]).toBe('Jane Doe');
      expect(obj[3]).toBe('Fred Marks');
      expect(obj[4]).toBe('Nick Coronado');
      expect(obj[5]).toBe('Firstname Lastname');
    });

    it('should create an object using key string and value function', () => {
      const obj = toObject(testData, 'id', item => item.employeeData.groupId);
      expect(obj[1]).toBe(33);
      expect(obj[2]).toBe(40);
      expect(obj[3]).toBe(33);
      expect(obj[4]).toBe(33);
      expect(obj[5]).toBe(33);
    });
  });

  describe('groupBy', () => {
    it('should create an object grouped by key string', () => {
      const obj = groupBy(testData, 'status');
      expect(obj.active.length).toBe(4);
      expect(obj.inactive.length).toBe(1);
    });

    it('should create an object grouped by key function', () => {
      const obj = groupBy(testData, item => item.employeeData.groupId);
      expect(obj[33].length).toBe(4);
      expect(obj[40].length).toBe(1);
    });

    it('should create an object grouped by key string and val string', () => {
      const obj = groupBy(testData, 'status', 'id');
      expect(obj.active).toStrictEqual([1, 2, 3, 4]);
      expect(obj.inactive).toStrictEqual([5]);
    });

    it('should create an object grouped by key string and val function', () => {
      const obj = groupBy(testData, 'status', item => item.employeeData.alias);
      expect(obj.active).toStrictEqual([
        'Butterfingers',
        'The Governess',
        'Sir Criesalot',
        'Tornado',
      ]);
      expect(obj.inactive).toStrictEqual(['The Nameless']);
    });
  });
});
